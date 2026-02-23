"use client";

import { useState, useEffect } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { addDays, differenceInDays, format, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, ChevronDown, BedDouble } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CLEANING_FEE = 800;
const MIN_NIGHTS = 2;

const ROOMS = [
  { id: "canario", name: "Habitación Canario", rate: 1500, capacity: 2 },
  { id: "azul",    name: "Habitación Azul",    rate: 2400, capacity: 5 },
  { id: "rosa",    name: "Habitación Rosa",     rate: 2600, capacity: 4 },
] as const;

type RoomId = typeof ROOMS[number]["id"];

// Blocked dates — update these with your actual unavailable dates
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
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>("canario");
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? ROOMS[0];

  const [dateRange, setDateRange] = useState<Range>({
    startDate: addDays(new Date(), 3),
    endDate: addDays(new Date(), 6),
    key: "selection",
  });

  // Listen for room selection from the Rooms section
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
        setGuests(Math.min(guests, ROOMS.find((r) => r.id === roomId)!.capacity));
      }
    };
    window.addEventListener("roomSelected", handler);
    return () => window.removeEventListener("roomSelected", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clamp guests to room capacity when room changes
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
      const hasBlocked = isRangeBlocked(selection.startDate, selection.endDate);
      if (hasBlocked) {
        setRangeError("El rango seleccionado incluye fechas no disponibles. Por favor elige otras fechas.");
        return;
      }
    }

    setDateRange(selection);
  };

  const handleReserve = () => {
    if (nights < MIN_NIGHTS) {
      setRangeError(`La estadía mínima es de ${MIN_NIGHTS} noches.`);
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
      roomName: selectedRoom.name,
      rate: selectedRoom.rate.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  // Close dropdowns on outside click
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
            Disponibilidad
          </p>
          <h2 className="section-title">Reserva tu estancia</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Selecciona tus fechas y te calcularemos el precio total al instante.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">

              {/* Calendar column */}
              <div className="p-6 md:p-8" id="booking-calendar-wrapper">
                <h3 className="font-serif text-xl text-stone-800 mb-6">Selecciona tus fechas</h3>

                {/* Room picker */}
                <div className="mb-6 relative">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Habitación
                  </label>
                  <button
                    onClick={() => setShowRoomPicker(!showRoomPicker)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl hover:border-terracotta-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BedDouble size={18} className="text-stone-400" />
                      <span className="text-stone-700">{selectedRoom.name}</span>
                      <span className="text-stone-400 text-sm">
                        · ${selectedRoom.rate.toLocaleString("es-MX")} MXN/noche
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform flex-shrink-0 ${showRoomPicker ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showRoomPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-20">
                      {ROOMS.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => { setSelectedRoomId(room.id); setShowRoomPicker(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left ${
                            room.id === selectedRoomId ? "bg-terracotta-50" : ""
                          }`}
                        >
                          <div>
                            <p className={`font-medium text-sm ${room.id === selectedRoomId ? "text-terracotta-700" : "text-stone-700"}`}>
                              {room.name}
                            </p>
                            <p className="text-stone-400 text-xs">Hasta {room.capacity} personas</p>
                          </div>
                          <span className={`text-sm font-semibold ${room.id === selectedRoomId ? "text-terracotta-600" : "text-stone-600"}`}>
                            ${room.rate.toLocaleString("es-MX")} MXN
                          </span>
                        </button>
                      ))}
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
                    locale={es}
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
                    Huéspedes
                  </label>
                  <button
                    onClick={() => setShowGuests(!showGuests)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl hover:border-terracotta-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-stone-400" />
                      <span className="text-stone-700">
                        {guests} {guests === 1 ? "huésped" : "huéspedes"}
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
                        <span className="text-stone-700 font-medium">Adultos y niños</span>
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
                      <p className="text-stone-400 text-xs mt-3">Capacidad máxima: {selectedRoom.capacity} personas</p>
                      <button
                        onClick={() => setShowGuests(false)}
                        className="w-full mt-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        Confirmar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Price summary column */}
              <div className="p-6 md:p-8 flex flex-col">
                <h3 className="font-serif text-xl text-stone-800 mb-6">Resumen del precio</h3>

                {/* Dates summary */}
                <div className="flex items-center gap-4 mb-6 bg-sand-50 rounded-xl p-4 border border-sand-100">
                  <CalendarDays className="text-terracotta-500 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Tus fechas</div>
                    {dateRange.startDate && dateRange.endDate ? (
                      <div className="text-stone-800 font-medium text-sm">
                        {format(dateRange.startDate, "d 'de' MMMM", { locale: es })}
                        {" — "}
                        {format(dateRange.endDate, "d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                    ) : (
                      <div className="text-stone-400 text-sm">Selecciona tus fechas</div>
                    )}
                    {nights > 0 && (
                      <div className="text-terracotta-600 text-xs mt-1 font-medium">
                        {nights} {nights === 1 ? "noche" : "noches"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price breakdown */}
                {nights > 0 ? (
                  <div className="flex-1">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-stone-700">
                        <span>
                          ${selectedRoom.rate.toLocaleString("es-MX")} MXN × {nights}{" "}
                          {nights === 1 ? "noche" : "noches"}
                        </span>
                        <span className="font-medium">${subtotal.toLocaleString("es-MX")}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-700">
                        <span>Tarifa de limpieza</span>
                        <span className="font-medium">${CLEANING_FEE.toLocaleString("es-MX")}</span>
                      </div>
                      <div className="border-t border-stone-100 pt-4 flex justify-between items-center">
                        <span className="font-bold text-stone-800 text-lg">Total</span>
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
                        La estadía mínima es de {MIN_NIGHTS} noches.
                      </p>
                    )}

                    <button
                      onClick={handleReserve}
                      disabled={nights < MIN_NIGHTS || !!rangeError}
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-base"
                    >
                      Reservar — ${total.toLocaleString("es-MX")} MXN
                    </button>

                    <p className="text-center text-stone-400 text-xs mt-4">
                      No se te cobrará nada hasta confirmar el pago
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <CalendarDays className="text-stone-200 mb-4" size={48} />
                    <p className="text-stone-400">
                      Selecciona tus fechas de llegada y salida para ver el precio.
                    </p>
                  </div>
                )}

                {/* Policies */}
                <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>Cancelación gratuita hasta 7 días antes de la llegada</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>Check-in a partir de las 3:00 PM · Check-out antes de las 12:00 PM</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="text-terracotta-400 font-bold mt-0.5">✓</span>
                    <span>Pago 100% seguro con Openpay</span>
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
