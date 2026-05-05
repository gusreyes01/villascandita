"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parseISO, addDays } from "date-fns";
import {
  CalendarDays,
  Users,
  Lock,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Building2,
  Store,
  Copy,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OpenPay: any;
  }
}

type PaymentMethod = "card" | "spei" | "paynet";

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

interface SpeiData {
  bank: string;
  clabe: string;
  name: string;
  agreement: string;
}

interface PaynetData {
  reference: string;
  barcodeUrl: string;
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
  const [deviceSessionId, setDeviceSessionId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [copied, setCopied] = useState(false);

  const [speiData, setSpeiData] = useState<SpeiData | null>(null);
  const [paynetData, setPaynetData] = useState<PaynetData | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");
  const [pendingDueDate, setPendingDueDate] = useState<string>("");

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
        const sessionId = window.OpenPay.deviceData.setup("payment-form", "device-session-id");
        setDeviceSessionId(sessionId);
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

  const handleCardPayment = async (e: React.FormEvent) => {
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
          const bookingParams = {
            checkIn, checkOut,
            nights: nights.toString(),
            guests: guests.toString(),
            total: total.toString(),
            name: guestForm.firstName,
            email: guestForm.email,
          };
          const res = await fetch("/api/charge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              method: "card",
              tokenId,
              amount: total,
              description: `Villas Candita - ${roomName} — ${checkIn} to ${checkOut} (${nights} nights)`,
              deviceSessionId,
              customer: {
                name: guestForm.firstName,
                lastName: guestForm.lastName,
                email: guestForm.email,
                phone: guestForm.phone,
              },
              bookingParams,
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error ?? t.bookingPage.errorGeneric);

          if (data.status === "charge_pending" && data.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          }

          const params = new URLSearchParams({
            orderId: data.orderId ?? `VC-${Date.now()}`,
            ...bookingParams,
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

  const handleAlternativePayment = async (method: "bank_account" | "store") => {
    setError(null);
    setLoading(true);

    const dueDate = addDays(new Date(), 3).toISOString().replace("Z", "-05:00");

    try {
      const res = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          amount: total,
          description: `Villas Candita - ${roomName} — ${checkIn} to ${checkOut} (${nights} nights)`,
          dueDate,
          customer: {
            name: guestForm.firstName,
            lastName: guestForm.lastName,
            email: guestForm.email,
            phone: guestForm.phone,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? t.bookingPage.errorGeneric);

      setPendingOrderId(data.orderId);
      setPendingDueDate(data.dueDate ?? dueDate);

      if (method === "bank_account") {
        setSpeiData({
          bank: data.paymentMethod.bank ?? "BBVA Bancomer",
          clabe: data.paymentMethod.clabe ?? "",
          name: data.paymentMethod.name ?? "",
          agreement: data.paymentMethod.agreement ?? "",
        });
      } else {
        setPaynetData({
          reference: data.paymentMethod.reference ?? "",
          barcodeUrl: data.paymentMethod.barcodeUrl ?? "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.bookingPage.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();

  const formatDueDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMM yyyy, HH:mm", { locale: dateLocale });
    } catch {
      return dateStr;
    }
  };

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

  const renderPaymentMethodSelector = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
        {t.bookingPage.paymentMethodTitle}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {([
          { id: "card" as PaymentMethod, icon: CreditCard, label: t.bookingPage.methodCard, desc: t.bookingPage.methodCardDesc },
          { id: "spei" as PaymentMethod, icon: Building2, label: t.bookingPage.methodSpei, desc: t.bookingPage.methodSpeiDesc },
          { id: "paynet" as PaymentMethod, icon: Store, label: t.bookingPage.methodPaynet, desc: t.bookingPage.methodPaynetDesc },
        ]).map(({ id, icon: Icon, label, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setPaymentMethod(id); setError(null); }}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === id
                ? "border-terracotta-500 bg-terracotta-50/50 shadow-sm"
                : "border-stone-200 hover:border-stone-300 bg-white"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              paymentMethod === id ? "bg-terracotta-100 text-terracotta-600" : "bg-stone-100 text-stone-500"
            }`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${paymentMethod === id ? "text-terracotta-700" : "text-stone-800"}`}>
                {label}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentMethod === id ? "border-terracotta-500" : "border-stone-300"
            }`}>
              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSpeiResult = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <Clock size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-amber-800 font-medium text-sm">{t.bookingPage.pendingPaymentTitle}</p>
          <p className="text-amber-700 text-xs mt-0.5">{t.bookingPage.pendingPaymentSubtitle}</p>
        </div>
      </div>

      <p className="text-stone-600 text-sm">{t.bookingPage.speiInstructions}</p>

      <div className="bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200">
        {speiData?.bank && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">{t.bookingPage.speiBank}</p>
              <p className="text-stone-800 font-medium text-sm">{speiData.bank}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-stone-500">{t.bookingPage.speiClabe}</p>
            <p className="text-stone-800 font-mono font-bold text-sm tracking-wider">{speiData?.clabe}</p>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(speiData?.clabe ?? "")}
            className="text-terracotta-600 hover:text-terracotta-700 p-2 rounded-lg hover:bg-terracotta-50 transition-colors"
            title={t.bookingPage.copy}
          >
            <Copy size={16} />
          </button>
        </div>
        {speiData?.name && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">{t.bookingPage.speiReference}</p>
              <p className="text-stone-800 font-mono font-medium text-sm">{speiData.name}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(speiData.name)}
              className="text-terracotta-600 hover:text-terracotta-700 p-2 rounded-lg hover:bg-terracotta-50 transition-colors"
              title={t.bookingPage.copy}
            >
              <Copy size={16} />
            </button>
          </div>
        )}
        {speiData?.agreement && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">{t.bookingPage.speiAgreement}</p>
              <p className="text-stone-800 font-medium text-sm">{speiData.agreement}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-stone-500">{t.bookingPage.speiAmount}</p>
            <p className="text-terracotta-600 font-bold text-lg">${total.toLocaleString("es-MX")} MXN</p>
          </div>
        </div>
        {pendingDueDate && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">{t.bookingPage.speiDueDate}</p>
              <p className="text-stone-800 font-medium text-sm">{formatDueDate(pendingDueDate)}</p>
            </div>
          </div>
        )}
      </div>

      {pendingOrderId && (
        <div className="text-center">
          <p className="text-xs text-stone-500">ID: <span className="font-mono">{pendingOrderId}</span></p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-blue-700 text-sm">{t.bookingPage.speiNote}</p>
      </div>
    </div>
  );

  const renderPaynetResult = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <Clock size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-amber-800 font-medium text-sm">{t.bookingPage.pendingPaymentTitle}</p>
          <p className="text-amber-700 text-xs mt-0.5">{t.bookingPage.pendingPaymentSubtitle}</p>
        </div>
      </div>

      <p className="text-stone-600 text-sm">{t.bookingPage.paynetInstructions}</p>

      <div className="bg-stone-50 rounded-xl border border-stone-200 divide-y divide-stone-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-stone-500">{t.bookingPage.paynetReference}</p>
            <p className="text-stone-800 font-mono font-bold text-base tracking-wider">{paynetData?.reference}</p>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(paynetData?.reference ?? "")}
            className="text-terracotta-600 hover:text-terracotta-700 p-2 rounded-lg hover:bg-terracotta-50 transition-colors"
            title={t.bookingPage.copy}
          >
            <Copy size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-stone-500">{t.bookingPage.paynetAmount}</p>
            <p className="text-terracotta-600 font-bold text-lg">${total.toLocaleString("es-MX")} MXN</p>
          </div>
        </div>
        {pendingDueDate && (
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">{t.bookingPage.paynetDueDate}</p>
              <p className="text-stone-800 font-medium text-sm">{formatDueDate(pendingDueDate)}</p>
            </div>
          </div>
        )}
      </div>

      {paynetData?.barcodeUrl && (
        <div className="text-center py-3">
          <p className="text-xs text-stone-500 mb-2">{t.bookingPage.paynetBarcode}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paynetData.barcodeUrl}
            alt="Barcode"
            className="mx-auto h-16"
          />
        </div>
      )}

      {pendingOrderId && (
        <div className="text-center">
          <p className="text-xs text-stone-500">ID: <span className="font-mono">{pendingOrderId}</span></p>
        </div>
      )}

      <div className="bg-stone-100 border border-stone-200 rounded-xl p-4">
        <p className="text-stone-600 text-xs">{t.bookingPage.paynetStores}</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-blue-700 text-sm">{t.bookingPage.paynetNote}</p>
      </div>
    </div>
  );

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

            {step === 2 && !speiData && !paynetData && (
              <form id="payment-form" onSubmit={paymentMethod === "card" ? handleCardPayment : (e) => { e.preventDefault(); handleAlternativePayment(paymentMethod === "spei" ? "bank_account" : "store"); }} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
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

                {renderPaymentMethodSelector()}

                {paymentMethod === "card" && (
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
                )}

                {paymentMethod === "spei" && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-sm">
                        {t.bookingPage.speiNote}
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "paynet" && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Store size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-purple-700 text-sm mb-2">
                          {t.bookingPage.paynetNote}
                        </p>
                        <p className="text-purple-600 text-xs">
                          {t.bookingPage.paynetStores}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-5">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {copied && (
                  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
                    {t.bookingPage.copiedToClipboard}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (paymentMethod === "card" && !openpayReady)}
                  className="mt-6 w-full bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {paymentMethod === "card" ? t.bookingPage.processing : t.bookingPage.generatingPayment}
                    </>
                  ) : paymentMethod === "card" ? (
                    <>
                      <Lock size={16} />
                      {t.bookingPage.payButton} ${total.toLocaleString("es-MX")} MXN
                    </>
                  ) : (
                    <>
                      {paymentMethod === "spei" ? <Building2 size={16} /> : <Store size={16} />}
                      {t.bookingPage.generatePayment}
                    </>
                  )}
                </button>

                {paymentMethod === "card" && (
                  <div className="mt-5 flex items-center justify-center gap-4 opacity-50">
                    <FaCcMastercard size={32} className="text-stone-600" />
                    <FaCcVisa size={32} className="text-stone-600" />
                    <FaCcAmex size={32} className="text-stone-600" />
                  </div>
                )}
              </form>
            )}

            {step === 2 && speiData && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <h2 className="font-serif text-2xl text-stone-800 mb-6">{t.bookingPage.methodSpei}</h2>
                {renderSpeiResult()}
              </div>
            )}

            {step === 2 && paynetData && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <h2 className="font-serif text-2xl text-stone-800 mb-6">{t.bookingPage.methodPaynet}</h2>
                {renderPaynetResult()}
              </div>
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
                  <span>${(rate || subtotal / (nights || 1)).toLocaleString("es-MX")} x {nights} {nights === 1 ? t.bookingPage.night : t.bookingPage.nights}</span>
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
                  <CheckCircle size={10} className="text-terracotta-400 mt-0.5 flex-shrink-0" />
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

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          {t.bookingPage.copiedToClipboard}
        </div>
      )}
    </div>
  );
}
