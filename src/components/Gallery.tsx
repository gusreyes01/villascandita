"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  {
    src: "/images/Candita/PATIO3.JPG",
    alt: "Patio colonial",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/Candita/IMG_3191.jpeg",
    alt: "Áreas comunes",
    span: "",
  },
  {
    src: "/images/Candita/IMG_3192.jpeg",
    alt: "Jardín tropical",
    span: "",
  },
  {
    src: "/images/Candita/IMG_3214.jpeg",
    alt: "Espacios interiores",
    span: "",
  },
  {
    src: "/images/Candita/P1012829.JPG",
    alt: "Fachada colonial",
    span: "",
  },
  {
    src: "/images/Candita/PATIO5.jpeg",
    alt: "Terraza y jardín",
    span: "col-span-2",
  },
  {
    src: "/images/Candita/P1012840.JPG",
    alt: "Detalles arquitectónicos",
    span: "",
  },
  {
    src: "/images/Candita/IMG_3201.jpeg",
    alt: "Rincones de la villa",
    span: "",
  },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null));
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % galleryImages.length : null));

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Galería
          </p>
          <h2 className="section-title">Cada espacio, una experiencia</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Descubre los rincones que harán de tu estancia un recuerdo
            imborrable.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow ${img.span}`}
              onClick={() => setLightbox(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
          >
            <ChevronLeft size={36} />
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
          </div>
          <button
            className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Siguiente"
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-6 text-white/60 text-sm">
            {lightbox + 1} / {galleryImages.length} — {galleryImages[lightbox].alt}
          </div>
        </div>
      )}
    </section>
  );
}
