"use client";

import Image from "next/image";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    [t.nav.villa, "#villa"],
    [t.nav.amenities, "#amenities"],
    [t.nav.gallery, "#gallery"],
    [t.nav.location, "#location"],
    [t.nav.book, "#booking"],
  ];

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Image
                src="/images/candita_logo.JPG"
                alt="Villas Candita"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-terracotta-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-terracotta-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">{t.footer.navigation}</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/60 hover:text-terracotta-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="mailto:hola@villascandita.com"
                  className="flex items-center gap-3 text-white/60 hover:text-terracotta-400 transition-colors"
                >
                  <Mail size={15} />
                  hola@villascandita.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+529991234567"
                  className="flex items-center gap-3 text-white/60 hover:text-terracotta-400 transition-colors"
                >
                  <Phone size={15} />
                  +52 999 123 4567
                </a>
              </li>
              <li className="text-white/60">
                <p>Mérida, Yucatán, México</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Villas Candita. {t.footer.rights}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white/70 transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
