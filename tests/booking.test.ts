import { describe, expect, it } from "vitest";
import {
  CLEANING_FEE,
  calculateQuote,
  rangeIncludesBlockedDate,
} from "../src/lib/booking";

const TODAY = new Date("2026-01-01T12:00:00.000Z");

describe("calculateQuote", () => {
  it("calculates the authoritative room rate and cleaning fee", () => {
    const result = calculateQuote(
      {
        roomId: "canario",
        checkIn: "2026-02-01",
        checkOut: "2026-02-04",
        guests: 2,
      },
      TODAY
    );

    expect(result).toMatchObject({
      success: true,
      nights: 3,
      subtotal: 4500,
      cleaningFee: CLEANING_FEE,
      total: 5300,
    });
  });

  it("uses the selected room's server-side rate", () => {
    const result = calculateQuote(
      {
        roomId: "rosa",
        checkIn: "2026-02-01",
        checkOut: "2026-02-03",
        guests: 4,
      },
      TODAY
    );

    expect(result).toMatchObject({ success: true, subtotal: 5200, total: 6000 });
  });

  it.each([
    [
      "unknown room",
      { roomId: "penthouse", checkIn: "2026-02-01", checkOut: "2026-02-04", guests: 1 },
      "invalid_room",
    ],
    [
      "malformed date",
      { roomId: "canario", checkIn: "2026-02-30", checkOut: "2026-03-04", guests: 1 },
      "invalid_dates",
    ],
    [
      "past arrival",
      { roomId: "canario", checkIn: "2025-12-31", checkOut: "2026-01-02", guests: 1 },
      "past_check_in",
    ],
    [
      "one-night stay",
      { roomId: "canario", checkIn: "2026-02-01", checkOut: "2026-02-02", guests: 1 },
      "invalid_stay",
    ],
    [
      "stay longer than 30 nights",
      { roomId: "canario", checkIn: "2026-05-01", checkOut: "2026-06-01", guests: 1 },
      "invalid_stay",
    ],
    [
      "room over capacity",
      { roomId: "canario", checkIn: "2026-02-01", checkOut: "2026-02-04", guests: 3 },
      "invalid_guests",
    ],
    [
      "fractional guest count",
      { roomId: "azul", checkIn: "2026-02-01", checkOut: "2026-02-04", guests: 1.5 },
      "invalid_guests",
    ],
    [
      "blocked night",
      { roomId: "azul", checkIn: "2026-03-14", checkOut: "2026-03-18", guests: 2 },
      "blocked_dates",
    ],
  ])("rejects %s", (_name, input, expectedCode) => {
    const result = calculateQuote(input, TODAY);
    expect(result).toMatchObject({ success: false, code: expectedCode });
  });
});

describe("rangeIncludesBlockedDate", () => {
  it("checks occupied nights but permits checkout on a blocked date", () => {
    expect(rangeIncludesBlockedDate("2026-03-13", "2026-03-15")).toBe(false);
    expect(rangeIncludesBlockedDate("2026-03-14", "2026-03-16")).toBe(true);
  });
});
