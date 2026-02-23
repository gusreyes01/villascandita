import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Villas Candita — Renta Vacacional en Mérida, Yucatán",
  description:
    "Disfruta una estancia inolvidable en Villas Candita, una propiedad de renta vacacional ubicada en el corazón de Mérida, Yucatán. Piscina privada, jardín tropical y todo el confort que mereces.",
  keywords: [
    "renta vacacional mérida",
    "villas yucatán",
    "airbnb mérida",
    "casa vacacional mérida yucatán",
    "villas candita",
  ],
  openGraph: {
    title: "Villas Candita — Mérida, Yucatán",
    description:
      "Tu refugio privado en el corazón de Mérida. Piscina, jardín tropical y diseño colonial auténtico.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
