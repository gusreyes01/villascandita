import { z } from "zod";
import type { QuoteResult, RoomId } from "./booking";

const customerSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
    phone: z.string().trim().regex(/^[+()\d\s-]{10,24}$/),
  })
  .strict();

const bookingSchema = z
  .object({
    roomId: z.enum(["canario", "azul", "rosa"] satisfies [RoomId, ...RoomId[]]),
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.number().int(),
  })
  .strict();

export const chargeRequestSchema = z
  .object({
    method: z.enum(["card", "bank_account", "store"]),
    tokenId: z.string().trim().min(1).max(200).optional(),
    deviceSessionId: z.string().trim().min(1).max(200).optional(),
    customer: customerSchema,
    booking: bookingSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.method === "card" && !value.tokenId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tokenId"],
        message: "Token de tarjeta requerido.",
      });
    }
    if (value.method === "card" && !value.deviceSessionId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deviceSessionId"],
        message: "Sesion de dispositivo requerida.",
      });
    }
  });

export type ChargeRequest = z.infer<typeof chargeRequestSchema>;
type ValidQuote = Extract<QuoteResult, { success: true }>;

export interface BookingSummary {
  checkIn: string;
  checkOut: string;
  nights: string;
  guests: string;
  subtotal: string;
  cleaningFee: string;
  total: string;
  room: string;
  roomName: string;
  rate: string;
  name: string;
  email: string;
}

export function buildBookingSummary(
  quote: ValidQuote,
  customer: ChargeRequest["customer"]
): BookingSummary {
  return {
    checkIn: quote.checkIn,
    checkOut: quote.checkOut,
    nights: String(quote.nights),
    guests: String(quote.guests),
    subtotal: String(quote.subtotal),
    cleaningFee: String(quote.cleaningFee),
    total: String(quote.total),
    room: quote.room.id,
    roomName: quote.room.nameEs,
    rate: String(quote.room.rate),
    name: customer.name,
    email: customer.email,
  };
}

export function buildChargePayload(
  input: ChargeRequest,
  quote: ValidQuote,
  options: {
    orderId: string;
    dueDate: string;
    redirectUrl: string;
  }
): Record<string, unknown> {
  const common = {
    method: input.method,
    amount: quote.total,
    currency: "MXN",
    description: `Villas Candita - ${quote.room.nameEs} — ${quote.checkIn} a ${quote.checkOut} (${quote.nights} noches)`,
    order_id: options.orderId,
    customer: {
      name: input.customer.name,
      last_name: input.customer.lastName,
      email: input.customer.email,
      phone_number: input.customer.phone,
    },
  };

  if (input.method === "card") {
    return {
      ...common,
      source_id: input.tokenId,
      device_session_id: input.deviceSessionId,
      use_3d_secure: "true",
      redirect_url: options.redirectUrl,
    };
  }

  return {
    ...common,
    due_date: options.dueDate,
  };
}
