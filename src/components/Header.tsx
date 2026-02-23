"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "La Villa", href: "#villa" },
    { label: "Comodidades", href: "#amenities" },
    { label: "Galería", href: "#gallery" },
    { label: "Ubicación", href: "#location" },
    { label: "Reservar", href: "#booking" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
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
                scrolled ? "text-stone-600" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#booking"
          className="hidden md:inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md"
        >
          Reservar ahora
        </a>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? "text-stone-800" : "text-white"
          }`}
          aria-label="Menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
              Reservar ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
