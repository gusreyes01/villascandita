"use client";

import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image placeholder — replace with your property photos */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1570538907569-6c1c1f7e2b12?w=1920&q=85')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-terracotta-300 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-4">
          Mérida, Yucatán · México
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
          Villas Candita
        </h1>
        <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Un refugio privado donde la elegancia colonial se fusiona con el
          encanto tropical de la Península de Yucatán. Piscina, jardín y lujo
          auténtico.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#booking"
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold py-4 px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base"
          >
            Reservar fechas
          </a>
          <a
            href="#villa"
            className="border-2 border-white/70 text-white hover:bg-white hover:text-stone-800 font-semibold py-4 px-10 rounded-lg transition-all duration-200 text-base"
          >
            Conocer la villa
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-16 text-white/80">
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white">6</div>
            <div className="text-xs tracking-wide uppercase mt-1">Huéspedes</div>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white">3</div>
            <div className="text-xs tracking-wide uppercase mt-1">Habitaciones</div>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white">2</div>
            <div className="text-xs tracking-wide uppercase mt-1">Baños</div>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-serif font-bold text-white">★ 4.9</div>
            <div className="text-xs tracking-wide uppercase mt-1">Calificación</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white/60" size={28} />
      </div>
    </section>
  );
}
