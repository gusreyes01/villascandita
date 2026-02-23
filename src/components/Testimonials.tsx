const testimonials = [
  {
    name: "Ana González",
    origin: "Ciudad de México",
    rating: 5,
    date: "Enero 2026",
    text: "Una experiencia mágica. La villa es exactamente como en las fotos, o incluso mejor. La piscina es espectacular y el jardín es un paraíso. Definitivamente volveremos.",
    avatar: "AG",
  },
  {
    name: "Carlos Rodríguez",
    origin: "Guadalajara",
    rating: 5,
    date: "Diciembre 2025",
    text: "Celebramos el fin de año aquí y fue perfecto. La ubicación es ideal, a pocos minutos de Paseo de Montejo. El anfitrión estuvo disponible en todo momento. 100% recomendado.",
    avatar: "CR",
  },
  {
    name: "Patricia & Familia",
    origin: "Monterrey",
    rating: 5,
    date: "Noviembre 2025",
    text: "Llevamos a los niños y fue una semana increíble. El espacio es amplio, limpio y muy seguro. La cocina tiene todo lo que necesitas. Ya reservamos para las vacaciones de verano.",
    avatar: "PF",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-400 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Opiniones
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Lo que dicen nuestros huéspedes
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <span className="text-white/70 text-sm ml-2">4.9 · 48 reseñas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors"
            >
              <div className="flex mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-sm italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-terracotta-600 flex items-center justify-center text-white font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-white/50 text-xs">
                    {t.origin} · {t.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
