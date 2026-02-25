"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  CalendarDays,
  Users,
  Lock,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OpenPay: any;
  }
}

interface GuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface CardForm {
  cardNumber: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, dateLocale } = useLanguage();

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const nights = parseInt(searchParams.get("nights") ?? "0");
  const guests = parseInt(searchParams.get("guests") ?? "1");
  const subtotal = parseInt(searchParams.get("subtotal") ?? "0");
  const cleaningFee = parseInt(searchParams.get("cleaningFee") ?? "0");
  const total = parseInt(searchParams.get("total") ?? "0");
  const roomName = searchParams.get("roomName") ?? "Villas Candita";
  const rate = parseInt(searchParams.get("rate") ?? "0");

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openpayReady, setOpenpayReady] = useState(false);

  const [guestForm, setGuestForm] = useState<GuestForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: "",
    holderName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://js.openpay.mx/openpay.v1.min.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://js.openpay.mx/openpay-data.v1.min.js";
    script2.async = true;

    script1.onload = () => { document.head.appendChild(script2); };
    script2.onload = () => {
      if (window.OpenPay) {
        window.OpenPay.setId(process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID ?? "");
        window.OpenPay.setApiKey(process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY ?? "");
        window.OpenPay.setSandboxMode(process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false");
        setOpenpayReady(true);
      }
    };

    document.head.appendChild(script1);
    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
      if (document.head.contains(script2)) document.head.removeChild(script2);
    };
  }, []);

  const validateGuestForm = (): boolean => {
    if (!guestForm.firstName.trim()) { setError(t.bookingPage.firstNameRequired); return false; }
    if (!guestForm.lastName.trim()) { setError(t.bookingPage.lastNameRequired); return false; }
    if (!guestForm.email.includes("@")) { setError(t.bookingPage.emailInvalid); return false; }
    if (guestForm.phone.length < 10) { setError(t.bookingPage.phoneInvalid); return false; }
    return true;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (validateGuestForm()) setStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!openpayReady || !window.OpenPay) {
      setError(t.bookingPage.openpayNotReady);
      setLoading(false);
      return;
    }

    window.OpenPay.token.create(
      {
        card_number: cardForm.cardNumber.replace(/\s/g, ""),
        holder_name: cardForm.holderName,
        expiration_year: cardForm.expYear,
        expiration_month: cardForm.expMonth,
        cvv2: cardForm.cvv,
      },
      async (response: { data: { id: string } }) => {
        const tokenId = response.data.id;
        try {
          const res = await fetch("/api/charge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tokenId,
              amount: total,
              description: `Villas Candita · ${roomName} — ${checkIn} to ${checkOut} (${nights} nights)`,
              deviceSessionId: window.OpenPay.deviceData.setup("payment-form", "device-session-id"),
              customer: {
                name: guestForm.firstName,
                lastName: guestForm.lastName,
                email: guestForm.email,
                phone: guestForm.phone,
              },
              booking: { checkIn, checkOut, nights, guests, subtotal, cleaningFee, total },
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error ?? t.bookingPage.errorGeneric);
          const params = new URLSearchParams({
            orderId: data.orderId ?? `VC-${Date.now()}`,
            checkIn, checkOut,
            nights: nights.toString(),
            guests: guests.toString(),
            total: total.toString(),
            name: guestForm.firstName,
            email: guestForm.email,
          });
          router.push(`/confirmation?${params.toString()}`);
        } catch (err) {
          setError(err instanceof Error ? err.message : t.bookingPage.errorGeneric);
          setLoading(false);
        }
      },
      (err: { data: { description: string } }) => {
        setError(`Error: ${err.data.description}`);
        setLoading(false);
      }
    );
  };

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();

  if (!checkIn || !checkOut || !total) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center px-6">
          <p className="text-stone-600 mb-6">{t.bookingPage.noBookingInfo}</p>
          <Link href="/#booking" className="btn-primary">
            {t.bookingPage.selectDates}
          </Link>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={18} />
            <span className="text-sm">{t.bookingPage.back}</span>
          </Link>
          <div className="w-px h-5 bg-stone-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-terracotta-600 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xs">VC</span>
            </div>
            <span className="font-serif text-stone-800 font-semibold">Villas Candita</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-10">
          {[
            { n: 1, label: t.bookingPage.step1 },
            { n: 2, label: t.bookingPage.step2 },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step === n
                    ? "bg-terracotta-600 text-white"
                    : step > n
                    ? "bg-jungle-500 text-white"
                    : "bg-stone-200 text-stone-500"
                }`}
              >
                {step > n ? <CheckCircle size={16} /> : n}
              </div>
              <span className={`text-sm font-medium ${step === n ? "text-stone-800" : "text-stone-400"}`}>
                {label}
              </span>
              {n < 2 && <div className="w-12 h-px bg-stone-200 ml-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <h2 className="font-serif text-2xl text-stone-800 mb-6">{t.bookingPage.guestInfoTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.firstName} *
                    </label>
                    <input
                      type="text" required value={guestForm.firstName}
                      onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                      placeholder={t.bookingPage.firstNamePlaceholder} className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.lastName} *
                    </label>
                    <input
                      type="text" required value={guestForm.lastName}
                      onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                      placeholder={t.bookingPage.lastNamePlaceholder} className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.email} *
                    </label>
                    <input
                      type="email" required value={guestForm.email}
                      onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                      placeholder={t.bookingPage.emailPlaceholder} className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.phone} *
                    </label>
                    <input
                      type="tel" required value={guestForm.phone}
                      onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder={t.bookingPage.phonePlaceholder} className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.specialRequests}{" "}
                      <span className="text-stone-400 normal-case tracking-normal font-normal">
                        {t.bookingPage.specialRequestsOpt}
                      </span>
                    </label>
                    <textarea
                      value={guestForm.specialRequests}
                      onChange={(e) => setGuestForm({ ...guestForm, specialRequests: e.target.value })}
                      placeholder={t.bookingPage.specialRequestsPlaceholder}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-5">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button type="submit" className="mt-6 w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg">
                  {t.bookingPage.continue}
                </button>
              </form>
            )}

            {step === 2 && (
              <form id="payment-form" onSubmit={handlePayment} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-stone-800">{t.bookingPage.paymentTitle}</h2>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); }}
                    className="text-sm text-stone-500 hover:text-terracotta-600 transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    {t.bookingPage.editData}
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-4 mb-6 border border-stone-100">
                  <Lock size={15} className="text-jungle-600 flex-shrink-0" />
                  <p className="text-stone-600 text-sm">
                    {t.bookingPage.securePaymentNote} <strong>Openpay</strong>.
                  </p>
                </div>

                <input type="hidden" id="device-session-id" />

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.cardNumber} *
                    </label>
                    <div className="relative">
                      <input
                        type="text" required value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
                        placeholder="4111 1111 1111 1111" maxLength={19}
                        className="w-full pl-4 pr-12 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition font-mono text-base tracking-wider"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      {t.bookingPage.cardHolder} *
                    </label>
                    <input
                      type="text" required value={cardForm.holderName}
                      onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value.toUpperCase() })}
                      placeholder="MARIA GARCIA"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition uppercase tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                        {t.bookingPage.month} *
                      </label>
                      <select
                        required value={cardForm.expMonth}
                        onChange={(e) => setCardForm({ ...cardForm, expMonth: e.target.value })}
                        className="w-full px-3 py-3 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">{t.bookingPage.mm}</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = String(i + 1).padStart(2, "0");
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                        {t.bookingPage.year} *
                      </label>
                      <select
                        required value={cardForm.expYear}
                        onChange={(e) => setCardForm({ ...cardForm, expYear: e.target.value })}
                        className="w-full px-3 py-3 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">{t.bookingPage.yy}</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const y = String(new Date().getFullYear() + i).slice(-2);
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                        {t.bookingPage.cvv} *
                      </label>
                      <input
                        type="text" required value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        placeholder="123" maxLength={4}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-5">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit" disabled={loading || !openpayReady}
                  className="mt-6 w-full bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {t.bookingPage.processing}
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      {t.bookingPage.payButton} ${total.toLocaleString("es-MX")} MXN
                    </>
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-4 opacity-50">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6" />
                </div>
              </form>
            )}
          </div>

          {/* Booking summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-6">
              <h3 className="font-serif text-lg text-stone-800 mb-5">{t.bookingPage.summaryTitle}</h3>

              <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-stone-100">
                <img src="/images/Candita/PATIO3.JPG" alt="Villas Candita" className="w-full h-full object-cover" />
              </div>

              <div className="mb-5">
                <p className="font-semibold text-stone-800">{roomName}</p>
                <p className="text-stone-500 text-sm">Villas Candita · Mérida, Yucatán</p>
              </div>

              <div className="space-y-3 text-sm border-t border-stone-100 pt-4">
                <div className="flex items-start gap-3">
                  <CalendarDays size={15} className="text-terracotta-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-stone-500 text-xs uppercase tracking-wide mb-0.5">
                      {t.bookingPage.datesLabel}
                    </p>
                    <p className="text-stone-800 font-medium">
                      {checkIn && format(parseISO(checkIn), "d MMM yyyy", { locale: dateLocale })}
                      {" "}{t.bookingPage.dateArrow}{" "}
                      {checkOut && format(parseISO(checkOut), "d MMM yyyy", { locale: dateLocale })}
                    </p>
                    <p className="text-stone-500 text-xs">
                      {nights} {nights === 1 ? t.bookingPage.night : t.bookingPage.nights}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users size={15} className="text-terracotta-500 flex-shrink-0" />
                  <div>
                    <p className="text-stone-500 text-xs uppercase tracking-wide mb-0.5">
                      {t.bookingPage.guestLabel}
                    </p>
                    <p className="text-stone-800 font-medium">
                      {guests} {guests === 1 ? t.bookingPage.guestSingle : t.bookingPage.guestsPlural}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-stone-100 mt-4 pt-4 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>${(rate || subtotal / (nights || 1)).toLocaleString("es-MX")} × {nights} {nights === 1 ? t.bookingPage.night : t.bookingPage.nights}</span>
                  <span>${subtotal.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t.bookingPage.cleaningFee}</span>
                  <span>${cleaningFee.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-800 text-base border-t border-stone-100 pt-2 mt-2">
                  <span>{t.bookingPage.total}</span>
                  <span className="text-terracotta-600">${total.toLocaleString("es-MX")} MXN</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                <div className="flex items-start gap-2 text-xs text-stone-500">
                  <span className="text-terracotta-400 mt-0.5">✓</span>
                  <span>{t.bookingPage.cancellation}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-500">
                  <Lock size={10} className="text-terracotta-400 mt-0.5 flex-shrink-0" />
                  <span>{t.bookingPage.securePaymentSmall}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
