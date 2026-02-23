"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle,
  CalendarDays,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  Home,
} from "lucide-react";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "VC-000000";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const nights = parseInt(searchParams.get("nights") ?? "0");
  const guests = parseInt(searchParams.get("guests") ?? "1");
  const total = parseInt(searchParams.get("total") ?? "0");
  const guestName = searchParams.get("name") ?? "Huésped";
  const guestEmail = searchParams.get("email") ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-terracotta-600 flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xs">VC</span>
          </div>
          <span className="font-serif text-stone-800 font-semibold">Villas Candita</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Success banner */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jungle-100 mb-6">
            <CheckCircle className="text-jungle-600" size={44} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
            ¡Reserva confirmada!
          </h1>
          <p className="text-stone-500 text-lg max-w-lg mx-auto">
            Gracias, <strong className="text-stone-700">{guestName}</strong>. Tu reserva en
            Villas Candita ha sido procesada exitosamente.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full">
            <span className="text-stone-500 text-sm">Número de reserva:</span>
            <span className="font-mono font-bold text-stone-800 text-sm">{orderId}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Booking details */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="font-serif text-xl text-stone-800 mb-5">Detalles de tu estancia</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="text-terracotta-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Check-in</p>
                  <p className="font-semibold text-stone-800">
                    {checkIn && format(parseISO(checkIn), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  <p className="text-stone-500 text-sm flex items-center gap-1 mt-1">
                    <Clock size={12} />A partir de las 3:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="text-terracotta-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Check-out</p>
                  <p className="font-semibold text-stone-800">
                    {checkOut && format(parseISO(checkOut), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  <p className="text-stone-500 text-sm flex items-center gap-1 mt-1">
                    <Clock size={12} />Antes de las 12:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0">
                  <Users className="text-terracotta-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Huéspedes</p>
                  <p className="font-semibold text-stone-800">
                    {guests} {guests === 1 ? "persona" : "personas"} · {nights}{" "}
                    {nights === 1 ? "noche" : "noches"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-terracotta-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Propiedad</p>
                  <p className="font-semibold text-stone-800">Villas Candita</p>
                  <p className="text-stone-500 text-sm">Mérida, Yucatán, México</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment summary & next steps */}
          <div className="space-y-6">
            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h2 className="font-serif text-xl text-stone-800 mb-4">Pago realizado</h2>
              <div className="flex items-center justify-between py-3 border-b border-stone-50">
                <span className="text-stone-600 text-sm">Total pagado</span>
                <span className="font-bold text-xl text-terracotta-600">
                  ${total.toLocaleString("es-MX")}{" "}
                  <span className="text-sm font-normal text-stone-400">MXN</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-stone-400">
                <CheckCircle size={12} className="text-jungle-500" />
                <span>Procesado de forma segura con Openpay</span>
              </div>
            </div>

            {/* Confirmation email */}
            <div className="bg-jungle-50 border border-jungle-100 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="text-jungle-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">
                    Revisa tu correo electrónico
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Hemos enviado la confirmación de tu reserva y los detalles de acceso a{" "}
                    <strong>{guestEmail}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">¿Necesitas ayuda?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:hola@villascandita.com"
                  className="flex items-center gap-3 text-stone-600 hover:text-terracotta-600 transition-colors text-sm"
                >
                  <Mail size={15} className="text-terracotta-500" />
                  hola@villascandita.com
                </a>
                <a
                  href="tel:+529991234567"
                  className="flex items-center gap-3 text-stone-600 hover:text-terracotta-600 transition-colors text-sm"
                >
                  <Phone size={15} className="text-terracotta-500" />
                  +52 999 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What to expect */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8">
          <h2 className="font-serif text-xl text-stone-800 mb-6">¿Qué sigue?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Confirmación por correo",
                desc: "Recibirás un correo con todos los detalles de tu reserva y las instrucciones de acceso.",
              },
              {
                step: "02",
                title: "Coordina tu llegada",
                desc: "48 horas antes de tu llegada, te contactaremos para coordinar el check-in y entregarte el código de acceso.",
              },
              {
                step: "03",
                title: "¡Disfruta Mérida!",
                desc: "Llega a partir de las 3 PM, relájate en tu villa privada y descubre la magia de Yucatán.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="text-3xl font-serif text-stone-200 font-bold leading-none">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">{title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 border-2 border-stone-200 text-stone-600 hover:border-stone-400 font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            <Download size={16} />
            Imprimir confirmación
          </button>
        </div>
      </main>

      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-100 mt-8">
        © {new Date().getFullYear()} Villas Candita · Mérida, Yucatán, México
      </footer>
    </div>
  );
}
