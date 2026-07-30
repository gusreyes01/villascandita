import { describe, expect, it } from "vitest";
import {
  createChargeVerificationToken,
  createCheckoutToken,
  createReceiptToken,
  verifyChargeVerificationToken,
  verifyCheckoutToken,
  verifyReceiptToken,
} from "../src/lib/payment-verification";

const SECRET = "test-secret-that-is-definitely-32-characters-long";
const NOW = 1_800_000_000_000;
const booking = {
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

describe("signed checkout and receipt tokens", () => {
  it("round-trips trusted checkout and receipt data", () => {
    const checkout = createCheckoutToken(
      { orderId: "VC-order", booking },
      SECRET,
      NOW
    );
    expect(verifyCheckoutToken(checkout, SECRET, NOW + 1)).toEqual({
      orderId: "VC-order",
      booking,
    });

    const receipt = createReceiptToken(
      { orderId: "charge_123", ...booking },
      SECRET,
      NOW
    );
    expect(verifyReceiptToken(receipt, SECRET, NOW + 1)).toMatchObject({
      orderId: "charge_123",
      total: "5300",
    });
  });

  it("rejects tampered and expired payloads", () => {
    const token = createCheckoutToken(
      { orderId: "VC-order", booking },
      SECRET,
      NOW
    );
    expect(verifyCheckoutToken(`${token}x`, SECRET, NOW)).toBeNull();
    expect(verifyCheckoutToken(token, SECRET, NOW + 15 * 60_000 + 1)).toBeNull();
  });
});

describe("charge verification tokens", () => {
  const checkout = createCheckoutToken(
    { orderId: "VC-order", booking },
    SECRET,
    NOW
  );

  it("accepts the matching charge and checkout during its lifetime", () => {
    const token = createChargeVerificationToken(
      "charge_123",
      checkout,
      SECRET,
      NOW
    );
    expect(
      verifyChargeVerificationToken(
        token,
        "charge_123",
        checkout,
        SECRET,
        NOW + 60_000
      )
    ).toBe(true);
  });

  it("rejects another charge, checkout, tampering, and expiration", () => {
    const token = createChargeVerificationToken(
      "charge_123",
      checkout,
      SECRET,
      NOW
    );
    expect(
      verifyChargeVerificationToken(token, "charge_456", checkout, SECRET, NOW)
    ).toBe(false);
    expect(
      verifyChargeVerificationToken(
        token,
        "charge_123",
        `${checkout}x`,
        SECRET,
        NOW
      )
    ).toBe(false);
    expect(
      verifyChargeVerificationToken(
        `${token}x`,
        "charge_123",
        checkout,
        SECRET,
        NOW
      )
    ).toBe(false);
    expect(
      verifyChargeVerificationToken(
        token,
        "charge_123",
        checkout,
        SECRET,
        NOW + 15 * 60_000 + 1
      )
    ).toBe(false);
  });

  it("rejects missing tokens and weak secrets", () => {
    expect(
      verifyChargeVerificationToken(
        undefined,
        "charge_123",
        checkout,
        SECRET,
        NOW
      )
    ).toBe(false);
    const weakToken = createChargeVerificationToken(
      "charge_123",
      checkout,
      "short",
      NOW
    );
    expect(
      verifyChargeVerificationToken(
        weakToken,
        "charge_123",
        checkout,
        "short",
        NOW
      )
    ).toBe(false);
  });
});
