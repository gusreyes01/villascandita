import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="villa" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
              Nuestra historia
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 leading-snug mb-6">
              Una joya colonial en el corazón de Mérida
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              Villas Candita es una propiedad restaurada con amor, que combina
              la arquitectura colonial yucateca con comodidades modernas. Cada
              rincón cuenta la historia de una ciudad vibrante y llena de cultura.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Desde el momento en que cruzas la gran puerta de madera, el
              bullicio de la ciudad queda atrás. Te recibirá un jardín tropical
              perfumado con gardenias y buganvilias, y una piscina de aguas
              cristalinas rodeada de palmas. Es tu oasis privado en Mérida.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "350m²", label: "Superficie" },
                { num: "2023", label: "Renovada" },
                { num: "100%", label: "Privada" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-sand-50 rounded-xl p-4 text-center border border-sand-100"
                >
                  <div className="text-2xl font-serif font-bold text-terracotta-600">
                    {stat.num}
                  </div>
                  <div className="text-stone-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <Image
                src="/images/Candita/P1012870.JPG"
                alt="Interior de la villa"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <Image
                  src="/images/Candita/PATIO6.JPG"
                  alt="Patio de la villa"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <Image
                  src="/images/Candita/IMG_3193.jpeg"
                  alt="Jardín tropical"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
