import { createHmac, timingSafeEqual } from "node:crypto";
import type { BookingSummary } from "./payment";

const TOKEN_LIFETIME_MS = 15 * 60 * 1000;
const RECEIPT_LIFETIME_MS = 60 * 60 * 1000;

export interface CheckoutPayload {
  orderId: string;
  booking: BookingSummary;
}

export interface ReceiptPayload extends BookingSummary {
  orderId: string;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(received: string, expected: string): boolean {
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return (
    receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes)
  );
}

function createPayloadToken(
  kind: "checkout" | "receipt",
  value: unknown,
  secret: string,
  now: number,
  lifetime: number
): string {
  const encoded = Buffer.from(
    JSON.stringify({ kind, expiresAt: now + lifetime, value })
  ).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

function verifyPayloadToken<T>(
  token: string | undefined,
  kind: "checkout" | "receipt",
  secret: string,
  now: number
): T | null {
  if (!token || token.length > 5000 || secret.length < 32) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!signaturesMatch(signature, sign(encoded, secret))) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as { kind?: string; expiresAt?: number; value?: T };
    if (
      decoded.kind !== kind ||
      !Number.isFinite(decoded.expiresAt) ||
      decoded.expiresAt! < now ||
      !decoded.value ||
      typeof decoded.value !== "object"
    ) {
      return null;
    }
    return decoded.value;
  } catch {
    return null;
  }
}

function isStringRecord(
  value: unknown,
  requiredKeys: readonly string[]
): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return requiredKeys.every(
    key => typeof record[key] === "string" && record[key].length <= 300
  );
}

const BOOKING_KEYS = [
  "checkIn",
  "checkOut",
  "nights",
  "guests",
  "subtotal",
  "cleaningFee",
  "total",
  "room",
  "roomName",
  "rate",
  "name",
  "email",
] as const;

export function createCheckoutToken(
  payload: CheckoutPayload,
  secret: string,
  now = Date.now()
): string {
  return createPayloadToken(
    "checkout",
    payload,
    secret,
    now,
    TOKEN_LIFETIME_MS
  );
}

export function verifyCheckoutToken(
  token: string | undefined,
  secret: string,
  now = Date.now()
): CheckoutPayload | null {
  const payload = verifyPayloadToken<CheckoutPayload>(
    token,
    "checkout",
    secret,
    now
  );
  if (
    !payload ||
    typeof payload.orderId !== "string" ||
    payload.orderId.length > 200 ||
    !isStringRecord(payload.booking, BOOKING_KEYS)
  ) {
    return null;
  }
  return payload;
}

export function createReceiptToken(
  payload: ReceiptPayload,
  secret: string,
  now = Date.now()
): string {
  return createPayloadToken(
    "receipt",
    payload,
    secret,
    now,
    RECEIPT_LIFETIME_MS
  );
}

export function verifyReceiptToken(
  token: string | undefined,
  secret: string,
  now = Date.now()
): ReceiptPayload | null {
  const payload = verifyPayloadToken<ReceiptPayload>(
    token,
    "receipt",
    secret,
    now
  );
  if (
    !payload ||
    !isStringRecord(payload, ["orderId", ...BOOKING_KEYS])
  ) {
    return null;
  }
  return payload as ReceiptPayload;
}

export function createChargeVerificationToken(
  chargeId: string,
  checkoutToken: string,
  secret: string,
  now = Date.now()
): string {
  const encodedId = Buffer.from(chargeId).toString("base64url");
  const checkoutDigest = sign(checkoutToken, secret);
  const expiresAt = String(now + TOKEN_LIFETIME_MS);
  const payload = `${encodedId}.${checkoutDigest}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyChargeVerificationToken(
  token: string | undefined,
  chargeId: string,
  checkoutToken: string,
  secret: string,
  now = Date.now()
): boolean {
  if (!token || secret.length < 32) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [encodedId, checkoutDigest, expiresAt, signature] = parts;
  const payload = `${encodedId}.${checkoutDigest}.${expiresAt}`;
  if (!signaturesMatch(signature, sign(payload, secret))) return false;

  const decodedId = Buffer.from(encodedId, "base64url").toString();
  const expiry = Number(expiresAt);
  return (
    decodedId === chargeId &&
    signaturesMatch(checkoutDigest, sign(checkoutToken, secret)) &&
    Number.isFinite(expiry) &&
    expiry >= now
  );
}
