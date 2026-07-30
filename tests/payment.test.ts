import { describe, expect, it } from "vitest";
import { calculateQuote } from "../src/lib/booking";
import {
  buildBookingSummary,
  buildChargePayload,
  chargeRequestSchema,
} from "../src/lib/payment";

const customer = {
  name: "Ada",
  lastName: "Lovelace",
  email: "ADA@example.com",
  phone: "+52 999 123 4567",
};
const booking = {
  roomId: "canario" as const,
  checkIn: "2027-02-01",
  checkOut: "2027-02-04",
  guests: 2,
};

function validCardRequest() {
  return {
    method: "card" as const,
    tokenId: "tok_test",
    deviceSessionId: "device_test",
    customer,
    booking,
  };
}

describe("chargeRequestSchema", () => {
  it("normalizes a valid request", () => {
    const result = chargeRequestSchema.parse(validCardRequest());
    expect(result.customer.email).toBe("ada@example.com");
  });

  it("requires a token for card charges", () => {
    const request = validCardRequest();
    const result = chargeRequestSchema.safeParse({ ...request, tokenId: undefined });
    expect(result.success).toBe(false);
  });

  it("requires a device session for card charges", () => {
    const request: Partial<ReturnType<typeof validCardRequest>> =
      validCardRequest();
    delete request.deviceSessionId;
    expect(chargeRequestSchema.safeParse(request).success).toBe(false);
  });

  it.each(["amount", "description", "dueDate", "bookingParams"])(
    "rejects client-controlled %s",
    field => {
      const result = chargeRequestSchema.safeParse({
        ...validCardRequest(),
        [field]: "untrusted",
      });
      expect(result.success).toBe(false);
    }
  );

  it("rejects extra booking fields and invalid customer data", () => {
    expect(
      chargeRequestSchema.safeParse({
        ...validCardRequest(),
        booking: { ...booking, total: 1 },
      }).success
    ).toBe(false);
    expect(
      chargeRequestSchema.safeParse({
        ...validCardRequest(),
        customer: { ...customer, email: "not-an-email" },
      }).success
    ).toBe(false);
  });

  it("accepts bank and store payments without a card token", () => {
    for (const method of ["bank_account", "store"] as const) {
      expect(
        chargeRequestSchema.safeParse({ method, customer, booking }).success
      ).toBe(true);
    }
  });
});

describe("server-generated Openpay data", () => {
  const quote = calculateQuote(booking, new Date("2027-01-01T00:00:00Z"));
  if (!quote.success) throw new Error("Test quote must be valid");

  it("uses the authoritative quote for amount and description", () => {
    const input = chargeRequestSchema.parse(validCardRequest());
    const payload = buildChargePayload(input, quote, {
      orderId: "VC-test",
      dueDate: "2027-01-04T00:00:00.000Z",
      redirectUrl: "https://example.com/3ds-callback",
    });

    expect(payload).toMatchObject({
      amount: 5300,
      currency: "MXN",
      order_id: "VC-test",
      source_id: "tok_test",
      redirect_url: "https://example.com/3ds-callback",
    });
    expect(payload.description).toContain("2027-02-01");
  });

  it("adds due dates only to offline payment methods", () => {
    const input = chargeRequestSchema.parse({
      method: "bank_account",
      customer,
      booking,
    });
    const payload = buildChargePayload(input, quote, {
      orderId: "VC-bank",
      dueDate: "2027-01-04T00:00:00.000Z",
      redirectUrl: "https://example.com/unused",
    });
    expect(payload).toMatchObject({
      method: "bank_account",
      amount: 5300,
      due_date: "2027-01-04T00:00:00.000Z",
    });
    expect(payload).not.toHaveProperty("redirect_url");
  });

  it("builds a display summary from trusted values", () => {
    const summary = buildBookingSummary(
      quote,
      chargeRequestSchema.parse(validCardRequest()).customer
    );
    expect(summary).toMatchObject({
      room: "canario",
      nights: "3",
      total: "5300",
      email: "ada@example.com",
    });
  });
});
