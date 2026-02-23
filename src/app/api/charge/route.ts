import { NextRequest, NextResponse } from "next/server";

const OPENPAY_MERCHANT_ID = process.env.OPENPAY_MERCHANT_ID ?? "";
const OPENPAY_PRIVATE_KEY = process.env.OPENPAY_PRIVATE_KEY ?? "";
const OPENPAY_SANDBOX = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

const OPENPAY_BASE_URL = OPENPAY_SANDBOX
  ? "https://sandbox-api.openpay.mx/v1"
  : "https://api.openpay.mx/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenId, amount, description, deviceSessionId, customer } = body;

    if (!tokenId || !amount || !customer?.email) {
      return NextResponse.json(
        { error: "Datos de pago incompletos." },
        { status: 400 }
      );
    }

    // Create charge via Openpay REST API
    const credentials = Buffer.from(`${OPENPAY_PRIVATE_KEY}:`).toString("base64");

    const chargePayload = {
      source_id: tokenId,
      method: "card",
      amount: amount / 100, // Openpay uses pesos, not centavos for MXN
      currency: "MXN",
      description,
      device_session_id: deviceSessionId,
      customer: {
        name: customer.name,
        last_name: customer.lastName,
        email: customer.email,
        phone_number: customer.phone,
      },
      capture: true,
    };

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

    // Here you would typically save the booking to your database
    // e.g.: await saveBooking({ ...booking, chargeId: data.id, customer })

    return NextResponse.json({
      success: true,
      orderId: data.id,
      status: data.status,
    });
  } catch (error) {
    console.error("Openpay charge error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
