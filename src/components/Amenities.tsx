"use client";

import {
  Wifi,
  Waves,
  Wind,
  UtensilsCrossed,
  Car,
  Tv,
  ShowerHead,
  Sun,
  Coffee,
  Dumbbell,
  Lock,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LucideIcon } from "lucide-react";

export default function Amenities() {
  const { t } = useLanguage();

  const amenities: { icon: LucideIcon; label: string; description: string }[] = [
    { icon: Waves, label: t.amenities.pool.label, description: t.amenities.pool.desc },
    { icon: Wind, label: t.amenities.ac.label, description: t.amenities.ac.desc },
    { icon: Wifi, label: t.amenities.wifi.label, description: t.amenities.wifi.desc },
    { icon: UtensilsCrossed, label: t.amenities.kitchen.label, description: t.amenities.kitchen.desc },
    { icon: Car, label: t.amenities.parking.label, description: t.amenities.parking.desc },
    { icon: Tv, label: t.amenities.tv.label, description: t.amenities.tv.desc },
    { icon: ShowerHead, label: t.amenities.shower.label, description: t.amenities.shower.desc },
    { icon: Sun, label: t.amenities.terrace.label, description: t.amenities.terrace.desc },
    { icon: Coffee, label: t.amenities.coffee.label, description: t.amenities.coffee.desc },
    { icon: Dumbbell, label: t.amenities.relax.label, description: t.amenities.relax.desc },
    { icon: Lock, label: t.amenities.security.label, description: t.amenities.security.desc },
    { icon: MapPin, label: t.amenities.location.label, description: t.amenities.location.desc },
  ];

  return (
    <section id="amenities" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            {t.amenities.tag}
          </p>
          <h2 className="section-title">{t.amenities.title}</h2>
          <p className="section-subtitle max-w-xl mx-auto">{t.amenities.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group border border-stone-100"
            >
              <div className="w-12 h-12 rounded-xl bg-terracotta-50 flex items-center justify-center mb-4 group-hover:bg-terracotta-100 transition-colors">
                <Icon className="text-terracotta-600" size={22} />
              </div>
              <h3 className="font-semibold text-stone-800 text-sm mb-1">{label}</h3>
              <p className="text-stone-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
