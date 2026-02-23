"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Users, BedDouble } from "lucide-react";

interface Room {
  id: string;
  name: string;
  color: string;
  description: string;
  rate: number;
  rateUSD: number | null;
  capacity: number;
  images: string[];
}

const rooms: Room[] = [
  {
    id: "canario",
    name: "Canario",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description:
      "Luminosa y acogedora, con detalles en tonos dorados que evocan el calor del sol yucateco. Ideal para parejas o viajeros que buscan confort y tranquilidad.",
    rate: 1500,
    rateUSD: 80,
    capacity: 2,
    images: [
      "/images/Candita/Canario/CANARIOB1.JPG",
      "/images/Candita/Canario/CANARIOC2.JPG",
      "/images/Candita/Canario/IMG_3212.jpeg",
      "/images/Candita/Canario/RQKF0722.JPG",
      "/images/Candita/Canario/FXWC7744.JPG",
    ],
  },
  {
    id: "azul",
    name: "Azul",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description:
      "Fresca y espaciosa, diseñada para grupos y familias. Sus tonos azules crean un ambiente sereno y refrescante, con capacidad para acomodar a todos con comodidad.",
    rate: 2400,
    rateUSD: null,
    capacity: 5,
    images: [
      "/images/Candita/Azul/AZULR1.JPG",
      "/images/Candita/Azul/AZULR2.JPG",
      "/images/Candita/Azul/AZULR3.JPG",
      "/images/Candita/Azul/AZULB1.JPG",
      "/images/Candita/Azul/AZULP4.JPG",
    ],
  },
  {
    id: "rosa",
    name: "Rosa",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    description:
      "Encantadora y romántica, con una atmósfera cálida y acogedora. Sus acabados en tonos rosados añaden un toque de elegancia a esta espaciosa habitación.",
    rate: 2600,
    rateUSD: null,
    capacity: 4,
    images: [
      "/images/Candita/Rosa/ROSAP1.JPG",
      "/images/Candita/Rosa/ROSAR1.JPG",
      "/images/Candita/Rosa/ROSAR2.JPG",
      "/images/Candita/Rosa/ROSAB3.JPG",
      "/images/Candita/Rosa/ROSAC2.JPG",
    ],
  },
];

function RoomCard({ room }: { room: Room }) {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + room.images.length) % room.images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % room.images.length);
  };

  const handleBook = () => {
    const params = new URLSearchParams({ room: room.id });
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Store selection in sessionStorage for the BookingWidget to pick up
      sessionStorage.setItem("selectedRoom", room.id);
      window.dispatchEvent(new CustomEvent("roomSelected", { detail: room.id }));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Image carousel */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden group">
        <Image
          src={room.images[current]}
          alt={`Habitación ${room.name}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Siguiente foto"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {room.images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current ? "bg-white w-4" : "bg-white/60"
              }`}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>

        {/* Room badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${room.color}`}>
            Habitación {room.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-serif text-2xl text-stone-800">Habitación {room.name}</h3>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-terracotta-600 font-bold text-xl">
              ${room.rate.toLocaleString("es-MX")}
              <span className="text-stone-400 font-normal text-sm"> MXN</span>
            </div>
            {room.rateUSD && (
              <div className="text-stone-400 text-xs">${room.rateUSD} USD / noche</div>
            )}
            {!room.rateUSD && (
              <div className="text-stone-400 text-xs">por noche</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} className="text-terracotta-400" />
            Habitación privada
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-terracotta-400" />
            Hasta {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
          </span>
        </div>

        <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-6">
          {room.description}
        </p>

        <button
          onClick={handleBook}
          className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          Reservar esta habitación
        </button>
      </div>
    </div>
  );
}

export default function Rooms() {
  return (
    <section id="rooms" className="py-24 bg-sand-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Habitaciones
          </p>
          <h2 className="section-title">Elige tu espacio ideal</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Tres habitaciones privadas, cada una con su propio encanto y carácter.
            Todas incluyen acceso a las áreas comunes, piscina y jardín.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        <p className="text-center text-stone-400 text-sm mt-10">
          Todas las habitaciones incluyen acceso a piscina, jardín y áreas comunes · Check-in 3:00 PM · Check-out 12:00 PM
        </p>
      </div>
    </section>
  );
}
