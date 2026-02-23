import { Suspense } from "react";
import ConfirmationContent from "./ConfirmationContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-jungle-200 border-t-jungle-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500">Verificando tu reserva...</p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmationContent />
    </Suspense>
  );
}
