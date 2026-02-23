import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">VC</span>
              </div>
              <span className="font-serif text-xl font-semibold">Villas Candita</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Tu refugio privado en Mérida, Yucatán. Elegancia colonial,
              naturaleza tropical y comodidades de lujo en un solo lugar.
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
            <h4 className="font-semibold text-white mb-6">Navegación</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["La Villa", "#villa"],
                ["Comodidades", "#amenities"],
                ["Galería", "#gallery"],
                ["Ubicación", "#location"],
                ["Reservar", "#booking"],
              ].map(([label, href]) => (
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
            <h4 className="font-semibold text-white mb-6">Contacto</h4>
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
          <p>© {new Date().getFullYear()} Villas Candita. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Aviso de privacidad</a>
            <a href="#" className="hover:text-white/70 transition-colors">Términos y condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
