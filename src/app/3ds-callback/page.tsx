"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function ThreeDSCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const chargeId = searchParams.get("id");
    if (!chargeId) {
      setError("No se encontro el ID de la transaccion.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/charge/verify?id=${chargeId}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data.error ?? "Error al verificar el pago.");
          return;
        }

        if (data.status === "completed") {
          const params = new URLSearchParams({
            orderId: data.orderId ?? data.id,
            checkIn: searchParams.get("checkIn") ?? "",
            checkOut: searchParams.get("checkOut") ?? "",
            nights: searchParams.get("nights") ?? "0",
            guests: searchParams.get("guests") ?? "1",
            total: searchParams.get("total") ?? "0",
            name: searchParams.get("name") ?? "",
            email: searchParams.get("email") ?? "",
          });
          router.replace(`/confirmation?${params.toString()}`);
        } else if (data.status === "failed") {
          setError("El pago fue rechazado. Intenta con otra tarjeta.");
        } else {
          setError(
            `El pago no pudo ser confirmado (estado: ${data.status}). Contacta a soporte.`
          );
        }
      } catch {
        setError("Error de conexion al verificar el pago.");
      }
    };

    verify();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-serif text-stone-800 mb-3">
            Pago no completado
          </h1>
          <p className="text-stone-500 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-terracotta-600 animate-spin mx-auto mb-4" />
        <p className="text-stone-500">Verificando tu pago...</p>
      </div>
    </div>
  );
}

export default function ThreeDSCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500">Verificando tu pago...</p>
          </div>
        </div>
      }
    >
      <ThreeDSCallbackContent />
    </Suspense>
  );
}
