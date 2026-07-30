import { NextRequest, NextResponse } from "next/server";
import {
  createReceiptToken,
  verifyChargeVerificationToken,
  verifyCheckoutToken,
} from "@/lib/payment-verification";

const OPENPAY_SANDBOX = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";
const OPENPAY_BASE_URL = OPENPAY_SANDBOX
  ? "https://sandbox-api.openpay.mx/v1"
  : "https://api.openpay.mx/v1";

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get("id")?.trim();
  if (!chargeId || !/^[A-Za-z0-9_-]{4,200}$/.test(chargeId)) {
    return NextResponse.json(
      { error: "ID de transacción inválido." },
      { status: 400 }
    );
  }

  const merchantId = process.env.OPENPAY_MERCHANT_ID?.trim();
  const privateKey = process.env.OPENPAY_PRIVATE_KEY?.trim();
  const signingSecret = process.env.PAYMENT_SIGNING_SECRET?.trim();
  if (!merchantId || !privateKey || !signingSecret || signingSecret.length < 32) {
    return NextResponse.json(
      { error: "El servicio de pagos no está configurado." },
      { status: 503 }
    );
  }

  const checkoutToken = req.nextUrl.searchParams.get("checkout")?.trim();
  const checkout = verifyCheckoutToken(checkoutToken, signingSecret);
  if (!checkout || !checkoutToken) {
    return NextResponse.json(
      { error: "La sesion de reserva no es valida o expiro." },
      { status: 403 }
    );
  }

  const verificationToken = req.cookies.get("vc_charge_verification")?.value;
  if (
    !verifyChargeVerificationToken(
      verificationToken,
      chargeId,
      checkoutToken,
      signingSecret
    )
  ) {
    return NextResponse.json(
      { error: "No autorizado para verificar esta transacción." },
      { status: 403 }
    );
  }

  try {
    const credentials = Buffer.from(`${privateKey}:`).toString("base64");
    const response = await fetch(
      `${OPENPAY_BASE_URL}/${merchantId}/charges/${chargeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15_000),
      }
    );
    const data = (await response.json()) as {
      id?: string;
      status?: string;
      amount?: number;
      order_id?: string;
    };

    if (!response.ok || !data.id) {
      return NextResponse.json(
        { error: "Error al verificar el pago." },
        { status: 400 }
      );
    }

    if (
      data.order_id !== checkout.orderId ||
      data.amount !== Number(checkout.booking.total)
    ) {
      return NextResponse.json(
        { error: "Los datos del pago no coinciden con la reserva." },
        { status: 409 }
      );
    }

    const receiptToken =
      data.status === "completed"
        ? createReceiptToken(
            { orderId: data.id, ...checkout.booking },
            signingSecret
          )
        : undefined;
    const result = NextResponse.json({
      id: data.id,
      status: data.status,
      amount: data.amount,
      orderId: data.order_id,
      receiptToken,
    });
    if (["completed", "failed", "cancelled"].includes(data.status ?? "")) {
      result.cookies.set("vc_charge_verification", "", {
        httpOnly: true,
        secure: !OPENPAY_SANDBOX,
        sameSite: "lax",
        maxAge: 0,
        path: "/api/charge/verify",
      });
    }
    return result;
  } catch (error) {
    console.error("Openpay verify error:", error);
    return NextResponse.json(
      { error: "Error temporal al verificar el pago." },
      { status: 502 }
    );
  }
}
