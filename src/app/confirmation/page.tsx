import Link from "next/link";
import ConfirmationContent from "./ConfirmationContent";
import { verifyReceiptToken } from "@/lib/payment-verification";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ receipt?: string }>;
}) {
  const { receipt: token } = await searchParams;
  const secret = process.env.PAYMENT_SIGNING_SECRET?.trim() ?? "";
  const receipt = verifyReceiptToken(token, secret);

  if (!receipt) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white border border-stone-100 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-serif text-stone-800 mb-3">
            Comprobante no válido
          </h1>
          <p className="text-stone-500 mb-6">
            Este enlace de confirmación es inválido o ya expiró.
          </p>
          <Link
            href="/"
            className="inline-flex bg-terracotta-600 text-white font-semibold py-3 px-6 rounded-xl"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return <ConfirmationContent receipt={receipt} />;
}
