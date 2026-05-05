import { NextRequest, NextResponse } from "next/server";

const OPENPAY_MERCHANT_ID = process.env.OPENPAY_MERCHANT_ID ?? "";
const OPENPAY_PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY ?? "";
const OPENPAY_SANDBOX = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const OPENPAY_BASE_URL = OPENPAY_SANDBOX
  ? "https://sandbox-api.openpay.mx/v1"
  : "https://api.openpay.mx/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, tokenId, amount, description, deviceSessionId, customer, dueDate, bookingParams } = body;

    if (!amount || !customer?.email) {
      return NextResponse.json(
        { error: "Datos de pago incompletos." },
        { status: 400 }
      );
    }

    if (method === "card" && !tokenId) {
      return NextResponse.json(
        { error: "Token de tarjeta requerido." },
        { status: 400 }
      );
    }

    const credentials = Buffer.from(`${OPENPAY_PRIVATE_KEY}:`).toString("base64");
    const orderId = `VC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    let chargePayload: Record<string, unknown>;

    switch (method) {
      case "bank_account":
        chargePayload = {
          method: "bank_account",
          amount: Number(amount),
          currency: "MXN",
          description,
          order_id: orderId,
          due_date: dueDate,
          customer: {
            name: customer.name,
            last_name: customer.lastName,
            email: customer.email,
            phone_number: customer.phone,
          },
        };
        break;

      case "store":
        chargePayload = {
          method: "store",
          amount: Number(amount),
          currency: "MXN",
          description,
          order_id: orderId,
          due_date: dueDate,
          customer: {
            name: customer.name,
            last_name: customer.lastName,
            email: customer.email,
            phone_number: customer.phone,
          },
        };
        break;

      case "card":
      default: {
        const redirectParams = new URLSearchParams(bookingParams ?? {});
        const redirectUrl = `${BASE_URL}/3ds-callback?${redirectParams.toString()}`;
        chargePayload = {
          source_id: tokenId,
          method: "card",
          amount: Number(amount),
          currency: "MXN",
          description,
          order_id: orderId,
          device_session_id: deviceSessionId,
          customer: {
            name: customer.name,
            last_name: customer.lastName,
            email: customer.email,
            phone_number: customer.phone,
          },
          use_3d_secure: true,
          redirect_url: redirectUrl,
          capture: true,
        };
        break;
      }
    }

    const response = await fetch(
      `${OPENPAY_BASE_URL}/${OPENPAY_MERCHANT_ID}/charges`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chargePayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        data.error_code === 3001
          ? "Tarjeta rechazada. Verifica los datos o usa otra tarjeta."
          : data.error_code === 3002
          ? "Tarjeta vencida. Usa una tarjeta vigente."
          : data.error_code === 3004
          ? "Fondos insuficientes."
          : data.description ?? "Error al procesar el pago.";

      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    if (method === "bank_account") {
      return NextResponse.json({
        success: true,
        orderId: data.id,
        status: data.status,
        method: "bank_account",
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

    if (method === "store") {
      return NextResponse.json({
        success: true,
        orderId: data.id,
        status: data.status,
        method: "store",
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
      return NextResponse.json({
        success: true,
        orderId: data.id,
        status: "charge_pending",
        method: "card",
        redirectUrl: data.payment_method.url,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      status: data.status,
      method: "card",
    });
  } catch (error) {
    console.error("Openpay charge error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
