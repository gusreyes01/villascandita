import { NextRequest, NextResponse } from "next/server";

const OPENPAY_MERCHANT_ID = process.env.OPENPAY_MERCHANT_ID ?? "";
const OPENPAY_PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY ?? "";
const OPENPAY_SANDBOX = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

const OPENPAY_BASE_URL = OPENPAY_SANDBOX
  ? "https://sandbox-api.openpay.mx/v1"
  : "https://api.openpay.mx/v1";

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get("id");

  if (!chargeId) {
    return NextResponse.json(
      { error: "ID de transaccion requerido." },
      { status: 400 }
    );
  }

  try {
    const credentials = Buffer.from(`${OPENPAY_PRIVATE_KEY}:`).toString(
      "base64"
    );

    const response = await fetch(
      `${OPENPAY_BASE_URL}/${OPENPAY_MERCHANT_ID}/charges/${chargeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.description ?? "Error al verificar el pago." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      amount: data.amount,
      orderId: data.order_id,
    });
  } catch (error) {
    console.error("Openpay verify error:", error);
    return NextResponse.json(
      { error: "Error interno al verificar el pago." },
      { status: 500 }
    );
  }
}
