import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/booking";
import {
  buildBookingSummary,
  buildChargePayload,
  chargeRequestSchema,
} from "@/lib/payment";
import {
  createChargeVerificationToken,
  createCheckoutToken,
  createReceiptToken,
} from "@/lib/payment-verification";

const OPENPAY_SANDBOX = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";
const OPENPAY_BASE_URL = OPENPAY_SANDBOX
  ? "https://sandbox-api.openpay.mx/v1"
  : "https://api.openpay.mx/v1";

function paymentConfiguration():
  | {
      success: true;
      merchantId: string;
      privateKey: string;
      signingSecret: string;
      baseUrl: string;
    }
  | { success: false } {
  const merchantId = process.env.OPENPAY_MERCHANT_ID?.trim();
  const privateKey = process.env.OPENPAY_PRIVATE_KEY?.trim();
  const signingSecret = process.env.PAYMENT_SIGNING_SECRET?.trim();
  const configuredBaseUrl = process.env.APP_BASE_URL?.trim();

  if (
    !merchantId ||
    !privateKey ||
    !signingSecret ||
    signingSecret.length < 32 ||
    !configuredBaseUrl
  ) {
    return { success: false };
  }

  try {
    const url = new URL(configuredBaseUrl);
    const isLocalhost = url.hostname === "localhost";
    const isSandboxLocalHttp =
      OPENPAY_SANDBOX && isLocalhost && url.protocol === "http:";
    if ((!OPENPAY_SANDBOX && isLocalhost) || (
      url.protocol !== "https:" && !isSandboxLocalHttp
    )) {
      return { success: false };
    }
    return {
      success: true,
      merchantId,
      privateKey,
      signingSecret,
      baseUrl: url.origin,
    };
  } catch {
    return { success: false };
  }
}

function openpayErrorMessage(errorCode: number | undefined): string {
  switch (errorCode) {
    case 3001:
    case 3004:
      return "Tarjeta rechazada. Verifica los datos o usa otra tarjeta.";
    case 3002:
      return "Tarjeta vencida. Usa una tarjeta vigente.";
    default:
      return "Error al procesar el pago.";
  }
}

export async function POST(req: NextRequest) {
  const configuration = paymentConfiguration();
  if (!configuration.success) {
    return NextResponse.json(
      { error: "El servicio de pagos no está configurado." },
      { status: 503 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = chargeRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de pago inválidos.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const quote = calculateQuote(parsed.data.booking);
  if (!quote.success) {
    return NextResponse.json({ error: quote.error, code: quote.code }, { status: 400 });
  }

  const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const orderId = `VC-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const booking = buildBookingSummary(quote, parsed.data.customer);
  const checkoutToken = createCheckoutToken(
    { orderId, booking },
    configuration.signingSecret
  );
  const redirectUrl = `${configuration.baseUrl}/3ds-callback?checkout=${encodeURIComponent(checkoutToken)}`;
  const chargePayload = buildChargePayload(parsed.data, quote, {
    orderId,
    dueDate,
    redirectUrl,
  });
  const credentials = Buffer.from(`${configuration.privateKey}:`).toString("base64");

  try {
    const response = await fetch(
      `${OPENPAY_BASE_URL}/${configuration.merchantId}/charges`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chargePayload),
        signal: AbortSignal.timeout(15_000),
      }
    );

    const data = (await response.json()) as {
      id?: string;
      status?: string;
      error_code?: number;
      due_date?: string;
      payment_method?: Record<string, string>;
    };

    if (!response.ok || !data.id) {
      return NextResponse.json(
        { error: openpayErrorMessage(data.error_code) },
        { status: 400 }
      );
    }

    if (parsed.data.method === "bank_account") {
      return NextResponse.json({
        success: true,
        orderId: data.id,
        status: data.status,
        method: "bank_account",
        amount: quote.total,
        paymentMethod: {
          type: data.payment_method?.type,
          bank: data.payment_method?.bank,
          clabe: data.payment_method?.clabe,
          name: data.payment_method?.name,
          agreement: data.payment_method?.agreement,
        },
        dueDate: data.due_date,
      });
    }

    if (parsed.data.method === "store") {
      return NextResponse.json({
        success: true,
        orderId: data.id,
        status: data.status,
        method: "store",
        amount: quote.total,
        paymentMethod: {
          type: data.payment_method?.type,
          reference: data.payment_method?.reference,
          barcodeUrl: data.payment_method?.barcode_url,
          paybinReference: data.payment_method?.paybin_reference,
          barcodePaybinUrl: data.payment_method?.barcode_paybin_url,
        },
        dueDate: data.due_date,
      });
    }

    if (data.status === "charge_pending" && data.payment_method?.url) {
      const result = NextResponse.json({
        success: true,
        orderId: data.id,
        status: "charge_pending",
        method: "card",
        amount: quote.total,
        booking,
        redirectUrl: data.payment_method.url,
      });
      result.cookies.set(
        "vc_charge_verification",
        createChargeVerificationToken(
          data.id,
          checkoutToken,
          configuration.signingSecret
        ),
        {
          httpOnly: true,
          secure: !OPENPAY_SANDBOX,
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/api/charge/verify",
        }
      );
      return result;
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      status: data.status,
      method: "card",
      amount: quote.total,
      receiptToken: createReceiptToken(
        { orderId: data.id, ...booking },
        configuration.signingSecret
      ),
    });
  } catch (error) {
    console.error("Openpay charge error:", error);
    return NextResponse.json(
      { error: "Error temporal del servicio de pagos. Intenta de nuevo." },
      { status: 502 }
    );
  }
}
