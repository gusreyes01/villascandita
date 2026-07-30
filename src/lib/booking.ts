export const CLEANING_FEE = 800;
export const MIN_NIGHTS = 2;
export const MAX_NIGHTS = 30;

export const ROOMS = [
  {
    id: "canario",
    nameEs: "Habitación Canario",
    nameEn: "Room Canario",
    rate: 1500,
    capacity: 2,
  },
  {
    id: "azul",
    nameEs: "Habitación Azul",
    nameEn: "Room Azul",
    rate: 2400,
    capacity: 5,
  },
  {
    id: "rosa",
    nameEs: "Habitación Rosa",
    nameEn: "Room Rosa",
    rate: 2600,
    capacity: 4,
  },
] as const;

export type RoomId = (typeof ROOMS)[number]["id"];

export const BLOCKED_DATE_STRINGS = [
  "2026-03-15",
  "2026-03-16",
  "2026-03-17",
  "2026-04-05",
  "2026-04-06",
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const blockedDates = new Set<string>(BLOCKED_DATE_STRINGS);

function parseUtcDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getBlockedDates(): Date[] {
  return BLOCKED_DATE_STRINGS.map(value => new Date(`${value}T00:00:00`));
}

export function rangeIncludesBlockedDate(
  checkInValue: string,
  checkOutValue: string
): boolean {
  const checkIn = parseUtcDate(checkInValue);
  const checkOut = parseUtcDate(checkOutValue);
  if (!checkIn || !checkOut || checkOut <= checkIn) return false;

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS);
  for (let offset = 0; offset < nights; offset += 1) {
    if (blockedDates.has(toIsoDate(new Date(checkIn.getTime() + offset * DAY_MS)))) {
      return true;
    }
  }
  return false;
}

export type QuoteResult =
  | {
      success: true;
      room: (typeof ROOMS)[number];
      checkIn: string;
      checkOut: string;
      guests: number;
      nights: number;
      subtotal: number;
      cleaningFee: number;
      total: number;
    }
  | {
      success: false;
      code:
        | "invalid_room"
        | "invalid_dates"
        | "past_check_in"
        | "invalid_stay"
        | "invalid_guests"
        | "blocked_dates";
      error: string;
    };

export function calculateQuote(
  input: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  },
  today = new Date()
): QuoteResult {
  const room = ROOMS.find(candidate => candidate.id === input.roomId);
  if (!room) {
    return { success: false, code: "invalid_room", error: "Habitación inválida." };
  }

  const checkIn = parseUtcDate(input.checkIn);
  const checkOut = parseUtcDate(input.checkOut);
  if (!checkIn || !checkOut) {
    return { success: false, code: "invalid_dates", error: "Fechas inválidas." };
  }

  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  if (checkIn.getTime() < todayUtc) {
    return {
      success: false,
      code: "past_check_in",
      error: "La fecha de entrada no puede estar en el pasado.",
    };
  }

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS);
  if (nights < MIN_NIGHTS || nights > MAX_NIGHTS) {
    return {
      success: false,
      code: "invalid_stay",
      error: `La estancia debe ser de ${MIN_NIGHTS} a ${MAX_NIGHTS} noches.`,
    };
  }

  if (
    !Number.isInteger(input.guests) ||
    input.guests < 1 ||
    input.guests > room.capacity
  ) {
    return {
      success: false,
      code: "invalid_guests",
      error: `La habitación admite de 1 a ${room.capacity} huéspedes.`,
    };
  }

  if (rangeIncludesBlockedDate(input.checkIn, input.checkOut)) {
    return {
      success: false,
      code: "blocked_dates",
      error: "El rango incluye fechas no disponibles.",
    };
  }

  const subtotal = nights * room.rate;
  return {
    success: true,
    room,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    nights,
    subtotal,
    cleaningFee: CLEANING_FEE,
    total: subtotal + CLEANING_FEE,
  };
}
