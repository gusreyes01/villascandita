"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { t, toggleLang, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.villa, href: "#villa" },
    { label: t.nav.amenities, href: "#amenities" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.location, href: "#location" },
    { label: t.nav.book, href: "#booking" },
  ];

  const isLight = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/candita_logo.JPG"
            alt="Villas Candita"
            width={72}
            height={72}
            className="rounded-full object-cover"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-terracotta-500 ${
                isLight ? "text-stone-600" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1.5 text-xs font-bold tracking-widest px-3 py-2 rounded-lg border transition-all duration-200 ${
              isLight
                ? "border-stone-200 text-stone-600 hover:border-terracotta-400 hover:text-terracotta-600"
                : "border-white/30 text-white/80 hover:border-white hover:text-white"
            }`}
            aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Globe size={13} />
            {t.langToggle}
          </button>

          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md"
          >
            {t.nav.bookNow}
          </a>
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleLang}
            className={`flex items-center gap-1 text-xs font-bold tracking-widest px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
              isLight
                ? "border-stone-200 text-stone-600"
                : "border-white/30 text-white/80"
            }`}
            aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Globe size={12} />
            {t.langToggle}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "text-stone-800" : "text-white"
            }`}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-stone-700 font-medium py-2 border-b border-stone-100 hover:text-terracotta-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center mt-2"
            >
              {t.nav.bookNow}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
