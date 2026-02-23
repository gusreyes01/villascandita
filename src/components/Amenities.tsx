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

const amenities = [
  { icon: Waves, label: "Piscina privada", description: "Alberca climatizada con área de relax" },
  { icon: Wind, label: "Aire acondicionado", description: "En todas las habitaciones" },
  { icon: Wifi, label: "WiFi de alta velocidad", description: "Fibra óptica 300 Mbps" },
  { icon: UtensilsCrossed, label: "Cocina equipada", description: "Electrodomésticos de primera" },
  { icon: Car, label: "Estacionamiento", description: "Cochera para 2 autos" },
  { icon: Tv, label: "Smart TV", description: "55\" con Netflix, Prime y más" },
  { icon: ShowerHead, label: "Baños de lujo", description: "Con regadera tipo lluvia" },
  { icon: Sun, label: "Terraza y jardín", description: "Con palmeras y buganvilias" },
  { icon: Coffee, label: "Cafetera profesional", description: "Nespresso y café de altura" },
  { icon: Dumbbell, label: "Área de descanso", description: "Hamacas y tumbonas" },
  { icon: Lock, label: "Seguridad 24/7", description: "Acceso con código privado" },
  { icon: MapPin, label: "Ubicación privilegiada", description: "A 10 min del centro histórico" },
];

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Lo que incluye
          </p>
          <h2 className="section-title">Comodidades de primer nivel</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Todo lo que necesitas para una estancia perfecta, pensado hasta el
            último detalle.
          </p>
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
