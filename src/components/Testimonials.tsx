"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-400 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            {t.testimonials.tag}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            {t.testimonials.title}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <span className="text-white/70 text-sm ml-2">
              4.9 · 48 {t.testimonials.reviews}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.items.map((item) => (
            <div
              key={item.name}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors"
            >
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-sm italic">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-terracotta-600 flex items-center justify-center text-white font-semibold text-sm">
                  {item.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{item.name}</div>
                  <div className="text-white/50 text-xs">
                    {item.origin} · {item.date}
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
