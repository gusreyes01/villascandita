import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  createChargeVerificationToken,
  createCheckoutToken,
  verifyReceiptToken,
} from "../src/lib/payment-verification";

const SECRET = "route-test-secret-that-is-at-least-32-characters";
const bookingSummary = {
  checkIn: "2027-02-01",
  checkOut: "2027-02-04",
  nights: "3",
  guests: "2",
  subtotal: "4500",
  cleaningFee: "800",
  total: "5300",
  room: "canario",
  roomName: "Habitacion Canario",
  rate: "1500",
  name: "Ada",
  email: "ada@example.com",
};
const validBody = {
  method: "card",
  tokenId: "tok_test",
  deviceSessionId: "device_test",
  customer: {
    name: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "+52 999 123 4567",
  },
  booking: {
    roomId: "canario",
    checkIn: "2027-02-01",
    checkOut: "2027-02-04",
    guests: 2,
  },
};

function configurePayment(sandbox = "true") {
  vi.stubEnv("OPENPAY_MERCHANT_ID", "merchant_test");
  vi.stubEnv("OPENPAY_PRIVATE_KEY", "sk_test");
  vi.stubEnv("PAYMENT_SIGNING_SECRET", SECRET);
  vi.stubEnv("APP_BASE_URL", "http://localhost:3000");
  vi.stubEnv("NEXT_PUBLIC_OPENPAY_SANDBOX", sandbox);
}

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/charge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetModules();
  configurePayment();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("POST /api/charge", () => {
  it("rejects client-controlled payment fields at the HTTP boundary", async () => {
    const provider = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("../src/app/api/charge/route");
    const response = await POST(postRequest({ ...validBody, amount: 1 }));

    expect(response.status).toBe(400);
    expect(provider).not.toHaveBeenCalled();
  });

  it("fails closed when payment configuration is incomplete", async () => {
    vi.stubEnv("PAYMENT_SIGNING_SECRET", "short");
    const provider = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("../src/app/api/charge/route");
    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(503);
    expect(provider).not.toHaveBeenCalled();
  });

  it("rejects localhost as a production callback target", async () => {
    vi.resetModules();
    configurePayment("false");
    const provider = vi.spyOn(globalThis, "fetch");
    const { POST } = await import("../src/app/api/charge/route");
    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(503);
    expect(provider).not.toHaveBeenCalled();
  });

  it("sets a bound HttpOnly cookie and trusted data for pending 3DS", async () => {
    const provider = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "charge_123",
          status: "charge_pending",
          payment_method: { url: "https://sandbox.openpay.mx/3ds" },
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );
    const { POST } = await import("../src/app/api/charge/route");
    const response = await POST(postRequest(validBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      orderId: "charge_123",
      status: "charge_pending",
      amount: 5300,
      booking: { total: "5300", room: "canario" },
      redirectUrl: "https://sandbox.openpay.mx/3ds",
    });
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    const submitted = JSON.parse(
      String(provider.mock.calls[0]?.[1]?.body)
    ) as Record<string, unknown>;
    expect(submitted.amount).toBe(5300);
    expect(submitted).not.toHaveProperty("amount", 1);
    expect(String(submitted.redirect_url)).toContain("checkout=");
  });
});

describe("GET /api/charge/verify", () => {
  function verificationRequest(
    status: string,
    options?: { chargeId?: string; providerOrderId?: string; amount?: number }
  ) {
    const chargeId = options?.chargeId ?? "charge_123";
    const checkout = createCheckoutToken(
      { orderId: "VC-order", booking: bookingSummary },
      SECRET
    );
    const cookie = createChargeVerificationToken(
      "charge_123",
      checkout,
      SECRET
    );
    const url = new URL("http://localhost/api/charge/verify");
    url.searchParams.set("id", chargeId);
    url.searchParams.set("checkout", checkout);
    const request = new NextRequest(url, {
      headers: { cookie: `vc_charge_verification=${cookie}` },
    });
    const providerResponse = new Response(
      JSON.stringify({
        id: "charge_123",
        status,
        amount: options?.amount ?? 5300,
        order_id: options?.providerOrderId ?? "VC-order",
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
    return { request, providerResponse };
  }

  it("rejects a cookie bound to another charge before provider access", async () => {
    const { request } = verificationRequest("completed", {
      chargeId: "charge_456",
    });
    const provider = vi.spyOn(globalThis, "fetch");
    const { GET } = await import("../src/app/api/charge/verify/route");
    const response = await GET(request);

    expect(response.status).toBe(403);
    expect(provider).not.toHaveBeenCalled();
  });

  it("preserves verification authorization while the provider is pending", async () => {
    const { request, providerResponse } = verificationRequest("in_progress");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(providerResponse);
    const { GET } = await import("../src/app/api/charge/verify/route");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.receiptToken).toBeUndefined();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("issues a signed receipt and consumes authorization on completion", async () => {
    const { request, providerResponse } = verificationRequest("completed");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(providerResponse);
    const { GET } = await import("../src/app/api/charge/verify/route");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(verifyReceiptToken(body.receiptToken, SECRET)).toMatchObject({
      orderId: "charge_123",
      total: "5300",
      checkIn: "2027-02-01",
    });
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("rejects provider data that does not match the signed checkout", async () => {
    const { request, providerResponse } = verificationRequest("completed", {
      amount: 1,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(providerResponse);
    const { GET } = await import("../src/app/api/charge/verify/route");
    const response = await GET(request);

    expect(response.status).toBe(409);
  });
});
