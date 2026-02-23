"use client";

import { MapPin, Clock, Car, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const placeIcons: LucideIcon[] = [MapPin, MapPin, MapPin, MapPin, Plane, Car];

export default function Location() {
  const { t } = useLanguage();

  return (
    <section id="location" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
              {t.location.tag}
            </p>
            <h2 className="section-title">{t.location.title}</h2>
            <p className="text-stone-600 leading-relaxed mb-8">{t.location.subtitle}</p>

            <div className="space-y-4 mb-8">
              {t.location.places.map(({ label, distance }, i) => {
                const Icon = placeIcons[i] ?? MapPin;
                return (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-terracotta-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-terracotta-600" />
                    </div>
                    <div className="flex-1 flex justify-between items-center border-b border-stone-100 pb-4">
                      <span className="text-stone-700 text-sm">{label}</span>
                      <span className="text-stone-400 text-sm ml-4 flex-shrink-0 flex items-center gap-1">
                        <Clock size={12} />
                        {distance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-sand-50 border border-sand-200 rounded-xl p-5">
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong className="text-stone-800">{t.location.exactAddress}</strong>{" "}
                {t.location.addressNote}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-stone-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119824.79082836537!2d-89.71399!3d20.96666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56715cab450d17%3A0x5dfc155715abeb09!2sM%C3%A9rida%2C%20Yucatan%2C%20Mexico!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.location.mapTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
