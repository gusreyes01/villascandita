"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
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
                  href="mailto:villascandita@yahoo.com"
                  className="flex items-center gap-3 text-white/60 hover:text-terracotta-400 transition-colors"
                >
                  <Mail size={15} />
                  villascandita@yahoo.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+528182533561"
                  className="flex items-center gap-3 text-white/60 hover:text-terracotta-400 transition-colors"
                >
                  <Phone size={15} />
                  +52 818 253 3561
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <p>
                    Calle 52 #427 interior b<br />
                    C.P. 97000<br />
                    Merida, Yucatan, Mexico
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Villas Candita. {t.footer.rights}</p>
          <div className="flex gap-6">
            <Link href="/aviso-de-privacidad" className="hover:text-white/70 transition-colors">{t.footer.privacy}</Link>
            <Link href="/terminos-y-condiciones" className="hover:text-white/70 transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
