import { Suspense } from "react";
import BookingForm from "./BookingForm";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500">Cargando reserva...</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingForm />
    </Suspense>
  );
}
