"use client";

import { useState, useEffect } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { addDays, differenceInDays, format, isBefore, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, ChevronDown, BedDouble } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CLEANING_FEE = 800;
const MIN_NIGHTS = 2;

const ROOMS = [
  { id: "canario", nameEs: "Habitación Canario", nameEn: "Room Canario", rate: 1500, capacity: 2 },
  { id: "azul",    nameEs: "Habitación Azul",    nameEn: "Room Azul",    rate: 2400, capacity: 5 },
  { id: "rosa",    nameEs: "Habitación Rosa",     nameEn: "Room Rosa",    rate: 2600, capacity: 4 },
] as const;

type RoomId = typeof ROOMS[number]["id"];

const blockedDates: Date[] = [
  new Date("2026-03-15"),
  new Date("2026-03-16"),
  new Date("2026-03-17"),
  new Date("2026-04-05"),
  new Date("2026-04-06"),
];

function isDateBlocked(date: Date): boolean {
  return blockedDates.some(
    (blocked) => format(blocked, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );
}

function isRangeBlocked(start: Date, end: Date): boolean {
  let current = new Date(start);
  while (isBefore(current, end)) {
    if (isDateBlocked(current)) return true;
    current = addDays(current, 1);
  }
  return false;
}

export default function BookingWidget() {
  const router = useRouter();
  const { t, lang, dateLocale } = useLanguage();
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>("canario");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? ROOMS[0];
  const roomName = lang === "es" ? selectedRoom.nameEs : selectedRoom.nameEn;

  const [dateRange, setDateRange] = useState<Range>({
    startDate: addDays(new Date(), 3),
    endDate: addDays(new Date(), 6),
    key: "selection",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedRoom") as RoomId | null;
    if (stored && ROOMS.find((r) => r.id === stored)) {
      setSelectedRoomId(stored);
      sessionStorage.removeItem("selectedRoom");
    }
    const handler = (e: Event) => {
      const roomId = (e as CustomEvent<RoomId>).detail;
      if (ROOMS.find((r) => r.id === roomId)) {
        setSelectedRoomId(roomId);
        setGuests((g) => Math.min(g, ROOMS.find((r) => r.id === roomId)!.capacity));
      }
    };
    window.addEventListener("roomSelected", handler);
    return () => window.removeEventListener("roomSelected", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setGuests((g) => Math.min(g, selectedRoom.capacity));
  }, [selectedRoom]);

  const nights =
    dateRange.startDate && dateRange.endDate
      ? Math.max(0, differenceInDays(dateRange.endDate, dateRange.startDate))
      : 0;

  const subtotal = nights * selectedRoom.rate;
  const total = subtotal + (nights > 0 ? CLEANING_FEE : 0);

  const handleRangeChange = (item: RangeKeyDict) => {
    const selection = item.selection;
    setRangeError(null);
    if (selection.startDate && selection.endDate) {
      if (isRangeBlocked(selection.startDate, selection.endDate)) {
        setRangeError(t.booking.blockedDatesError);
        return;
      }
    }
    setDateRange(selection);
  };

  const handleReserve = () => {
    if (nights < MIN_NIGHTS) {
      setRangeError(`${t.booking.minStay} ${MIN_NIGHTS} ${t.booking.minStayNights}`);
      return;
    }
    if (rangeError) return;

    const params = new URLSearchParams({
      checkIn: format(dateRange.startDate!, "yyyy-MM-dd"),
      checkOut: format(dateRange.endDate!, "yyyy-MM-dd"),
      nights: nights.toString(),
      guests: guests.toString(),
      subtotal: subtotal.toString(),
      cleaningFee: CLEANING_FEE.toString(),
      total: total.toString(),
      room: selectedRoom.id,
      roomName: roomName,
      rate: selectedRoom.rate.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("#booking-calendar-wrapper")) {
        setShowRoomPicker(false);
        setShowGuests(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-stone-100 to-sand-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            {t.booking.tag}
          </p>
          <h2 className="section-title">{t.booking.title}</h2>
          <p className="section-subtitle max-w-xl mx-auto">{t.booking.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">

              {/* Calendar column */}
              <div className="p-6 md:p-8" id="booking-calendar-wrapper">
                <h3 className="font-serif text-xl text-stone-800 mb-6">{t.booking.selectDatesTitle}</h3>

                {/* Room picker */}
                <div className="mb-6 relative">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    {t.booking.roomLabel}
                  </label>
                  <button
                    onClick={() => setShowRoomPicker(!showRoomPicker)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl hover:border-terracotta-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BedDouble size={18} className="text-stone-400" />
                      <span className="text-stone-700">{roomName}</span>
                      <span className="text-stone-400 text-sm">
                        · ${selectedRoom.rate.toLocaleString("es-MX")} {t.booking.perNight}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform flex-shrink-0 ${showRoomPicker ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showRoomPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-20">
                      {ROOMS.map((room) => {
                        const rName = lang === "es" ? room.nameEs : room.nameEn;
                        return (
                          <button
                            key={room.id}
                            onClick={() => { setSelectedRoomId(room.id); setShowRoomPicker(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left ${
                              room.id === selectedRoomId ? "bg-terracotta-50" : ""
                            }`}
                          >
                            <div>
                              <p className={`font-medium text-sm ${room.id === selectedRoomId ? "text-terracotta-700" : "text-stone-700"}`}>
                                {rName}
                              </p>
                              <p className="text-stone-400 text-xs">
                                {t.booking.upTo} {room.capacity} {t.booking.persons}
                              </p>
                            </div>
                            <span className={`text-sm font-semibold ${room.id === selectedRoomId ? "text-terracotta-600" : "text-stone-600"}`}>
                              ${room.rate.toLocaleString("es-MX")} MXN
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="w-full overflow-x-auto">
                  <DateRange
                    ranges={[dateRange]}
                    onChange={handleRangeChange}
                    minDate={startOfDay(new Date())}
                    months={1}
                    direction="vertical"
                    showMonthAndYearPickers={true}
                    showDateDisplay={false}
                    rangeColors={["#ce4c23"]}
                    locale={dateLocale}
                    disabledDates={blockedDates}
                    className="!w-full"
                  />
                </div>

                {rangeError && (
                  <p className="mt-3 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                    {rangeError}
                  </p>
                )}

                {/* Guest selector */}
                <div className="mt-6 relative">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    {t.booking.guestsLabel}
                  </label>
                  <button
                    onClick={() => setShowGuests(!showGuests)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl hover:border-terracotta-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-stone-400" />
                      <span className="text-stone-700">
                        {guests} {guests === 1 ? t.booking.guest : t.booking.guests}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform ${showGuests ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showGuests && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-4 z-20">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-700 font-medium">{t.booking.adultsAndKids}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:border-terracotta-500 hover:text-terracotta-600 transition-colors text-stone-600 font-bold"
                          >
                            –
                          </button>
                          <span className="w-6 text-center font-semibold text-stone-800">{guests}</span>
                          <button
                            onClick={() => setGuests(Math.min(selectedRoom.capacity, guests + 1))}
                            className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:border-terracotta-500 hover:text-terracotta-600 transition-colors text-stone-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-stone-400 text-xs mt-3">
                        {t.booking.maxCapacity}: {selectedRoom.capacity} {t.booking.persons}
                      </p>
                      <button
                        onClick={() => setShowGuests(false)}
                        className="w-full mt-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        {t.booking.confirm}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Price summary column */}
              <div className="p-6 md:p-8 flex flex-col">
                <h3 className="font-serif text-xl text-stone-800 mb-6">{t.booking.priceSummaryTitle}</h3>

                {/* Dates summary */}
                <div className="flex items-center gap-4 mb-6 bg-sand-50 rounded-xl p-4 border border-sand-100">
                  <CalendarDays className="text-terracotta-500 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                      {t.booking.yourDates}
                    </div>
                    {dateRange.startDate && dateRange.endDate ? (
                      <div className="text-stone-800 font-medium text-sm">
                        {format(dateRange.startDate, "d 'de' MMMM", { locale: dateLocale })}
                        {" — "}
                        {format(dateRange.endDate, "d 'de' MMMM, yyyy", { locale: dateLocale })}
                      </div>
                    ) : (
                      <div className="text-stone-400 text-sm">{t.booking.selectDatesPrompt}</div>
                    )}
                    {nights > 0 && (
                      <div className="text-terracotta-600 text-xs mt-1 font-medium">
                        {nights} {nights === 1 ? t.booking.night : t.booking.nights}
                      </div>
                    )}
                  </div>
                </div>

                {nights > 0 ? (
                  <div className="flex-1">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-stone-700">
                        <span>
                          ${selectedRoom.rate.toLocaleString("es-MX")} MXN × {nights}{" "}
                          {nights === 1 ? t.booking.night : t.booking.nights}
                        </span>
                        <span className="font-medium">${subtotal.toLocaleString("es-MX")}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-700">
                        <span>{t.booking.cleaningFee}</span>
                        <span className="font-medium">${CLEANING_FEE.toLocaleString("es-MX")}</span>
                      </div>
                      <div className="border-t border-stone-100 pt-4 flex justify-between items-center">
                        <span className="font-bold text-stone-800 text-lg">{t.booking.total}</span>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-terracotta-600">
                            ${total.toLocaleString("es-MX")}
                            <span className="text-sm text-stone-500 font-normal ml-1">MXN</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {nights < MIN_NIGHTS && (
                      <p className="text-amber-600 text-sm bg-amber-50 px-4 py-3 rounded-lg border border-amber-100 mb-4">
                        {t.booking.minStay} {MIN_NIGHTS} {t.booking.minStayNights}
                      </p>
                    )}

                    <button
                      onClick={handleReserve}
                      disabled={nights < MIN_NIGHTS || !!rangeError}
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-base"
                    >
                      {t.booking.reserveButton} — ${total.toLocaleString("es-MX")} MXN
                    </button>

                    <p className="text-center text-stone-400 text-xs mt-4">
                      {t.booking.noChargeUntilConfirm}
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <CalendarDays className="text-stone-200 mb-4" size={48} />
                    <p className="text-stone-400">{t.booking.selectDatesToSeePrice}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>{t.booking.cancellationPolicy}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>{t.booking.checkInOut}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>{t.booking.securePayment}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
