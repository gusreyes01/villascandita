export type Lang = "es" | "en";

export type Translations = typeof esTranslations;

export const esTranslations = {
  langToggle: "EN",

  nav: {
    villa: "La Villa",
    amenities: "Comodidades",
    gallery: "Galería",
    location: "Ubicación",
    book: "Reservar",
    bookNow: "Reservar ahora",
  },

  hero: {
    location: "Mérida, Yucatán · México",
    description:
      "Un refugio privado donde la elegancia colonial se fusiona con el encanto tropical de la Península de Yucatán. Piscina, jardín y lujo auténtico.",
    bookDates: "Reservar fechas",
    discoverVilla: "Conocer la villa",
    guests: "Huéspedes",
    rooms: "Habitaciones",
    bathrooms: "Baños",
    rating: "Calificación",
  },

  about: {
    tag: "Nuestra historia",
    title: "Una joya colonial en el corazón de Mérida",
    p1: "Villas Candita es una propiedad restaurada con amor, que combina la arquitectura colonial yucateca con comodidades modernas. Cada rincón cuenta la historia de una ciudad vibrante y llena de cultura.",
    p2: "Desde el momento en que cruzas la gran puerta de madera, el bullicio de la ciudad queda atrás. Te recibirá un jardín tropical perfumado con gardenias y buganvilias, y una piscina de aguas cristalinas rodeada de palmas. Es tu oasis privado en Mérida.",
    surface: "Superficie",
    renovated: "Renovada",
    private: "Privada",
  },

  amenities: {
    tag: "Lo que incluye",
    title: "Comodidades de primer nivel",
    subtitle: "Todo lo que necesitas para una estancia perfecta, pensado hasta el último detalle.",
    pool: { label: "Piscina privada", desc: "Alberca climatizada con área de relax" },
    ac: { label: "Aire acondicionado", desc: "En todas las habitaciones" },
    wifi: { label: "WiFi de alta velocidad", desc: "Fibra óptica 300 Mbps" },
    kitchen: { label: "Cocina equipada", desc: "Electrodomésticos de primera" },
    parking: { label: "Estacionamiento", desc: "Cochera para 2 autos" },
    tv: { label: "Smart TV", desc: '55" con Netflix, Prime y más' },
    shower: { label: "Baños de lujo", desc: "Con regadera tipo lluvia" },
    terrace: { label: "Terraza y jardín", desc: "Con palmeras y buganvilias" },
    coffee: { label: "Cafetera profesional", desc: "Nespresso y café de altura" },
    relax: { label: "Área de descanso", desc: "Hamacas y tumbonas" },
    security: { label: "Seguridad 24/7", desc: "Acceso con código privado" },
    location: { label: "Ubicación privilegiada", desc: "A 10 min del centro histórico" },
  },

  gallery: {
    tag: "Galería",
    title: "Cada espacio, una experiencia",
    subtitle: "Descubre los rincones que harán de tu estancia un recuerdo imborrable.",
    alts: [
      "Patio colonial",
      "Áreas comunes",
      "Jardín tropical",
      "Espacios interiores",
      "Fachada colonial",
      "Terraza y jardín",
      "Detalles arquitectónicos",
      "Rincones de la villa",
    ],
    close: "Cerrar",
    prev: "Anterior",
    next: "Siguiente",
  },

  rooms: {
    tag: "Habitaciones",
    title: "Elige tu espacio ideal",
    subtitle:
      "Tres habitaciones privadas, cada una con su propio encanto y carácter. Todas incluyen acceso a las áreas comunes, piscina y jardín.",
    footer:
      "Todas las habitaciones incluyen acceso a piscina, jardín y áreas comunes · Check-in 3:00 PM · Check-out 12:00 PM",
    room: "Habitación",
    privateRoom: "Habitación privada",
    upTo: "Hasta",
    person: "persona",
    persons: "personas",
    perNight: "por noche",
    book: "Reservar esta habitación",
    prevPhoto: "Foto anterior",
    nextPhoto: "Siguiente foto",
    photo: "Foto",
    descriptions: {
      canario:
        "Luminosa y acogedora, con detalles en tonos dorados que evocan el calor del sol yucateco. Ideal para parejas o viajeros que buscan confort y tranquilidad.",
      azul: "Fresca y espaciosa, diseñada para grupos y familias. Sus tonos azules crean un ambiente sereno y refrescante, con capacidad para acomodar a todos con comodidad.",
      rosa: "Encantadora y romántica, con una atmósfera cálida y acogedora. Sus acabados en tonos rosados añaden un toque de elegancia a esta espaciosa habitación.",
    },
  },

  testimonials: {
    tag: "Opiniones",
    title: "Lo que dicen nuestros huéspedes",
    reviews: "reseñas",
    items: [
      {
        name: "Ana González",
        origin: "Ciudad de México",
        date: "Enero 2026",
        text: "Una experiencia mágica. La villa es exactamente como en las fotos, o incluso mejor. La piscina es espectacular y el jardín es un paraíso. Definitivamente volveremos.",
        avatar: "AG",
      },
      {
        name: "Carlos Rodríguez",
        origin: "Guadalajara",
        date: "Diciembre 2025",
        text: "Celebramos el fin de año aquí y fue perfecto. La ubicación es ideal, a pocos minutos de Paseo de Montejo. El anfitrión estuvo disponible en todo momento. 100% recomendado.",
        avatar: "CR",
      },
      {
        name: "Patricia & Familia",
        origin: "Monterrey",
        date: "Noviembre 2025",
        text: "Llevamos a los niños y fue una semana increíble. El espacio es amplio, limpio y muy seguro. La cocina tiene todo lo que necesitas. Ya reservamos para las vacaciones de verano.",
        avatar: "PF",
      },
    ],
  },

  booking: {
    tag: "Disponibilidad",
    title: "Reserva tu estancia",
    subtitle: "Selecciona tus fechas y te calcularemos el precio total al instante.",
    selectDatesTitle: "Selecciona tus fechas",
    roomLabel: "Habitación",
    guestsLabel: "Huéspedes",
    guest: "huésped",
    guests: "huéspedes",
    adultsAndKids: "Adultos y niños",
    maxCapacity: "Capacidad máxima",
    persons: "personas",
    confirm: "Confirmar",
    yourDates: "Tus fechas",
    selectDatesPrompt: "Selecciona tus fechas",
    night: "noche",
    nights: "noches",
    priceSummaryTitle: "Resumen del precio",
    cleaningFee: "Tarifa de limpieza",
    total: "Total",
    minStay: "La estadía mínima es de",
    minStayNights: "noches.",
    reserveButton: "Reservar",
    noChargeUntilConfirm: "No se te cobrará nada hasta confirmar el pago",
    cancellationPolicy: "Cancelación gratuita hasta 7 días antes de la llegada",
    checkInOut: "Check-in a partir de las 3:00 PM · Check-out antes de las 12:00 PM",
    securePayment: "Pago 100% seguro con Openpay",
    blockedDatesError:
      "El rango seleccionado incluye fechas no disponibles. Por favor elige otras fechas.",
    selectDatesToSeePrice: "Selecciona tus fechas de llegada y salida para ver el precio.",
    perNight: "MXN/noche",
    upTo: "Hasta",
  },

  location: {
    tag: "Cómo llegar",
    title: "Ubicación privilegiada",
    subtitle:
      "Villas Candita se encuentra en una zona residencial tranquila de Mérida, a pocos minutos de los principales atractivos de la ciudad. Perfecta para explorar la Península de Yucatán desde un hogar confortable.",
    exactAddress: "Dirección exacta:",
    addressNote:
      "La dirección completa se comparte únicamente con los huéspedes confirmados, garantizando tu privacidad y seguridad.",
    mapTitle: "Ubicación Villas Candita - Mérida, Yucatán",
    places: [
      { label: "Plaza Grande (Centro Histórico)", distance: "10 min en auto" },
      { label: "Paseo de Montejo", distance: "8 min en auto" },
      { label: "Mercado de Santa Ana", distance: "5 min en auto" },
      { label: "Gran Museo del Mundo Maya", distance: "15 min en auto" },
      { label: "Aeropuerto de Mérida (MID)", distance: "20 min en auto" },
      { label: "Chichén Itzá", distance: "2 hrs en auto" },
    ],
  },

  footer: {
    description:
      "Tu refugio privado en Mérida, Yucatán. Elegancia colonial, naturaleza tropical y comodidades de lujo en un solo lugar.",
    navigation: "Navegación",
    contact: "Contacto",
    privacy: "Aviso de privacidad",
    terms: "Términos y condiciones",
    rights: "Todos los derechos reservados.",
  },

  privacyPage: {
    title: "Aviso de privacidad",
    lastUpdated: "Última actualización: mayo 2026",
    backHome: "Volver al inicio",
    intro:
      "En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, Villas Candita pone a su disposición el presente Aviso de Privacidad.",
    responsibleTitle: "1. Identidad del responsable",
    responsibleText:
      "Villas Candita, con domicilio en Calle 52 #427 interior b, C.P. 97000, Mérida, Yucatán, México, es responsable del tratamiento de sus datos personales. Para cualquier asunto relacionado con el presente aviso de privacidad, puede contactarnos a través del correo electrónico: villascandita@yahoo.com o al teléfono +52 818 253 3561.",
    dataCollectedTitle: "2. Datos personales que se recaban",
    dataCollectedText:
      "Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar los siguientes datos personales:",
    dataCollectedItems: [
      "Nombre completo",
      "Correo electrónico",
      "Número de teléfono",
      "Datos de pago (número de tarjeta, nombre del titular, fecha de vencimiento y CVV), procesados de forma segura a través de Openpay",
      "Solicitudes especiales relacionadas con su estancia",
    ],
    purposeTitle: "3. Finalidades del tratamiento",
    purposeText:
      "Sus datos personales serán utilizados para las siguientes finalidades:",
    purposePrimary: "Finalidades primarias (necesarias):",
    purposePrimaryItems: [
      "Procesar y confirmar su reservación",
      "Gestionar el cobro de los servicios contratados",
      "Proporcionarle información sobre su estancia (instrucciones de acceso, check-in, check-out)",
      "Atender sus solicitudes, dudas o comentarios",
      "Cumplir con obligaciones fiscales y legales aplicables",
    ],
    purposeSecondary: "Finalidades secundarias (no necesarias):",
    purposeSecondaryItems: [
      "Enviarle información promocional sobre nuestros servicios",
      "Realizar encuestas de satisfacción",
    ],
    purposeSecondaryNote:
      "Si usted no desea que sus datos sean tratados para finalidades secundarias, puede comunicarlo al correo electrónico: villascandita@yahoo.com.",
    transferTitle: "4. Transferencias de datos",
    transferText:
      "Sus datos personales pueden ser transferidos a los siguientes terceros:",
    transferItems: [
      "Openpay: para el procesamiento seguro de pagos con tarjeta de crédito o débito",
      "Autoridades competentes: cuando sea requerido por ley o por orden de autoridad",
    ],
    arcoTitle: "5. Derechos ARCO",
    arcoText:
      "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (derechos ARCO) al tratamiento de sus datos personales. Para ejercer cualquiera de estos derechos, envíe su solicitud al correo electrónico: villascandita@yahoo.com, indicando:",
    arcoItems: [
      "Nombre completo del titular",
      "Descripción clara de los datos sobre los que desea ejercer algún derecho",
      "Cualquier documento que facilite la localización de sus datos",
    ],
    arcoResponse:
      "Responderemos su solicitud en un plazo máximo de 20 días hábiles contados a partir de la fecha de recepción.",
    cookiesTitle: "6. Uso de cookies y tecnologías de rastreo",
    cookiesText:
      "Nuestro sitio web puede utilizar cookies y otras tecnologías de rastreo para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Usted puede deshabilitar las cookies a través de la configuración de su navegador.",
    changesTitle: "7. Cambios al aviso de privacidad",
    changesText:
      "Nos reservamos el derecho de modificar el presente aviso de privacidad en cualquier momento. Las modificaciones estarán disponibles en esta misma página web. Le recomendamos revisarla periódicamente.",
    consentTitle: "8. Consentimiento",
    consentText:
      "Al proporcionar sus datos personales a través de nuestro sitio web o al realizar una reservación, usted manifiesta su consentimiento para el tratamiento de sus datos conforme a lo establecido en el presente aviso de privacidad.",
    contactTitle: "Contacto",
    contactText:
      "Si tiene alguna duda o comentario sobre este aviso de privacidad, puede contactarnos en:",
    contactEmail: "villascandita@yahoo.com",
    contactPhone: "+52 818 253 3561",
    contactAddress: "Calle 52 #427 interior b, C.P. 97000",
    contactLocation: "Mérida, Yucatán, México",
  },

  termsPage: {
    title: "Términos y condiciones",
    lastUpdated: "Última actualización: mayo 2026",
    backHome: "Volver al inicio",
    intro:
      "Al realizar una reservación o utilizar los servicios de Villas Candita, usted acepta los presentes términos y condiciones. Le recomendamos leerlos detenidamente antes de proceder con su reserva.",

    reservationsTitle: "1. Reservaciones",
    reservationsText:
      "Las reservaciones se consideran confirmadas únicamente cuando se ha realizado el pago completo a través de nuestra plataforma de pagos (Openpay). Al completar una reservación, usted recibirá un correo electrónico de confirmación con los detalles de su estancia.",
    reservationsItems: [
      "La estadía mínima es de 2 noches",
      "El check-in es a partir de las 3:00 PM",
      "El check-out es antes de las 12:00 PM",
      "La capacidad máxima de la propiedad debe respetarse en todo momento",
    ],

    paymentsTitle: "2. Pagos y precios",
    paymentsText:
      "Todos los precios publicados en nuestro sitio web están expresados en pesos mexicanos (MXN) e incluyen los impuestos aplicables.",
    paymentsItems: [
      "El pago total de la reservación se cobra al momento de confirmar",
      "Los pagos se procesan de forma segura a través de Openpay",
      "La tarifa de limpieza se incluye en el desglose del precio",
      "Se aceptan pagos con tarjeta, transferencia SPEI y pago en efectivo en tiendas (Paynet)",
    ],

    cancellationTitle: "3. Política de cancelación",
    cancellationText:
      "Entendemos que los planes pueden cambiar. Nuestra política de cancelación es la siguiente:",
    cancellationItems: [
      "Cancelación gratuita hasta 7 días antes de la fecha de llegada, con reembolso completo",
      "Cancelaciones realizadas entre 3 y 6 días antes de la llegada: reembolso del 50%",
      "Cancelaciones realizadas con menos de 3 días de anticipación o no-show: sin reembolso",
      "Las solicitudes de cancelación deben enviarse por correo electrónico a villascandita@yahoo.com",
    ],

    houseRulesTitle: "4. Reglas de la casa",
    houseRulesText:
      "Para garantizar una estancia agradable para todos, le pedimos respetar las siguientes reglas:",
    houseRulesItems: [
      "No se permiten fiestas ni eventos sin autorización previa",
      "No se permite fumar dentro de la propiedad",
      "Se permite el ingreso de mascotas únicamente con autorización previa y sujeto a un depósito adicional",
      "El horario de silencio es de 10:00 PM a 8:00 AM",
      "Respetar la capacidad máxima de huéspedes indicada en la reservación",
      "No se permite el uso de la piscina bajo efectos del alcohol o sustancias",
    ],

    liabilityTitle: "5. Responsabilidad",
    liabilityText:
      "Villas Candita no se hace responsable por:",
    liabilityItems: [
      "Objetos personales perdidos, dañados o robados durante la estancia",
      "Lesiones o accidentes ocurridos dentro de la propiedad",
      "Interrupciones en servicios públicos (agua, electricidad, internet) causadas por terceros",
      "Cambios climáticos o eventos de fuerza mayor que afecten la estancia",
    ],
    liabilityNote:
      "El huésped es responsable de cualquier daño causado a la propiedad, mobiliario o equipamiento durante su estancia. Los costos de reparación o reposición serán cobrados al huésped.",

    intellectualPropertyTitle: "6. Propiedad intelectual",
    intellectualPropertyText:
      "Todo el contenido de este sitio web, incluyendo textos, fotografías, diseños, logotipos y elementos gráficos, es propiedad de Villas Candita y está protegido por las leyes de propiedad intelectual de México. Queda prohibida su reproducción, distribución o uso sin autorización previa por escrito.",

    modificationsTitle: "7. Modificaciones a los términos",
    modificationsText:
      "Villas Candita se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en esta página. Las reservaciones existentes se regirán por los términos vigentes al momento de su confirmación.",

    governingLawTitle: "8. Legislación aplicable",
    governingLawText:
      "Los presentes términos y condiciones se rigen por la legislación vigente en los Estados Unidos Mexicanos. Para la resolución de cualquier controversia derivada de los presentes términos, las partes se someten a la jurisdicción de los tribunales competentes de la ciudad de Mérida, Yucatán.",

    contactTitle: "Contacto",
    contactText:
      "Si tiene alguna duda sobre estos términos y condiciones, puede contactarnos en:",
    contactEmail: "villascandita@yahoo.com",
    contactPhone: "+52 818 253 3561",
    contactAddress: "Calle 52 #427 interior b, C.P. 97000",
    contactLocation: "Mérida, Yucatán, México",
  },

  bookingPage: {
    loading: "Cargando reserva...",
    back: "Volver",
    step1: "Tus datos",
    step2: "Pago",
    guestInfoTitle: "Información del huésped",
    firstName: "Nombre",
    firstNamePlaceholder: "María",
    lastName: "Apellido",
    lastNamePlaceholder: "García",
    email: "Correo electrónico",
    emailPlaceholder: "maria@email.com",
    phone: "Teléfono",
    phonePlaceholder: "9991234567",
    specialRequests: "Solicitudes especiales",
    specialRequestsOpt: "(opcional)",
    specialRequestsPlaceholder: "Alergias, necesidades especiales, hora estimada de llegada...",
    continue: "Continuar al pago",
    paymentTitle: "Información de pago",
    editData: "Editar datos",
    securePaymentNote: "Tu pago está protegido con cifrado SSL de 256 bits. Procesado por",
    cardNumber: "Número de tarjeta",
    cardHolder: "Nombre del titular",
    month: "Mes",
    year: "Año",
    mm: "MM",
    yy: "AA",
    cvv: "CVV",
    payButton: "Pagar",
    processing: "Procesando pago...",
    summaryTitle: "Resumen de tu reserva",
    datesLabel: "Fechas",
    night: "noche",
    nights: "noches",
    guestLabel: "Huéspedes",
    guestSingle: "huésped",
    guestsPlural: "huéspedes",
    cleaningFee: "Tarifa de limpieza",
    total: "Total",
    cancellation: "Cancelación gratuita hasta 7 días antes",
    securePaymentSmall: "Pago seguro con Openpay",
    firstNameRequired: "El nombre es requerido.",
    lastNameRequired: "El apellido es requerido.",
    emailInvalid: "Ingresa un correo electrónico válido.",
    phoneInvalid: "Ingresa un número de teléfono válido (10 dígitos).",
    openpayNotReady:
      "El procesador de pagos no está disponible. Intenta recargar la página.",
    errorGeneric: "Error inesperado. Intenta de nuevo.",
    noBookingInfo: "No hay información de reserva. Por favor selecciona tus fechas.",
    selectDates: "Seleccionar fechas",
    perNight: "MXN/noche",
    dateArrow: "→",
    paymentMethodTitle: "Elige tu metodo de pago",
    methodCard: "Tarjeta de credito/debito",
    methodCardDesc: "Pago inmediato con Visa, Mastercard o Amex",
    methodSpei: "Transferencia SPEI",
    methodSpeiDesc: "Transferencia bancaria electronica (1-24 hrs)",
    methodPaynet: "Pago en efectivo (Paynet)",
    methodPaynetDesc: "Paga en tiendas de conveniencia con tu referencia",
    speiInstructions: "Realiza una transferencia SPEI con los siguientes datos:",
    speiBank: "Banco destino",
    speiClabe: "CLABE interbancaria",
    speiReference: "Referencia",
    speiAgreement: "Convenio CIE",
    speiAmount: "Monto exacto",
    speiDueDate: "Fecha limite de pago",
    speiNote: "Tu reserva se confirmara automaticamente al recibir el pago. Usa exactamente el monto indicado para que se pueda identificar.",
    paynetInstructions: "Presenta esta referencia en cualquier tienda de conveniencia afiliada a Paynet:",
    paynetReference: "Referencia de pago",
    paynetBarcode: "Codigo de barras",
    paynetAmount: "Monto a pagar",
    paynetDueDate: "Fecha limite de pago",
    paynetStores: "Tiendas afiliadas: 7-Eleven, Farmacias del Ahorro, Walmart, Bodega Aurrera, Sam's Club, Soriana, entre otras.",
    paynetNote: "Tu reserva se confirmara automaticamente al recibir el pago.",
    pendingPaymentTitle: "Pago pendiente",
    pendingPaymentSubtitle: "Completa tu pago para confirmar tu reserva",
    copiedToClipboard: "Copiado al portapapeles",
    copy: "Copiar",
    payBefore: "Paga antes de",
    generatePayment: "Generar datos de pago",
    generatingPayment: "Generando...",
  },

  confirmationPage: {
    loading: "Verificando tu reserva...",
    confirmed: "¡Reserva confirmada!",
    thanks: "Gracias",
    bookingProcessed: "Tu reserva en Villas Candita ha sido procesada exitosamente.",
    bookingNumber: "Número de reserva:",
    stayDetails: "Detalles de tu estancia",
    checkIn: "Check-in",
    checkOut: "Check-out",
    fromTime: "A partir de las 3:00 PM",
    beforeTime: "Antes de las 12:00 PM",
    guestsLabel: "Huéspedes",
    person: "persona",
    persons: "personas",
    night: "noche",
    nights: "noches",
    property: "Propiedad",
    paymentDone: "Pago realizado",
    totalPaid: "Total pagado",
    securePayment: "Procesado de forma segura con Openpay",
    checkEmail: "Revisa tu correo electrónico",
    emailSent: "Hemos enviado la confirmación de tu reserva y los detalles de acceso a",
    needHelp: "¿Necesitas ayuda?",
    whatNext: "¿Qué sigue?",
    nextSteps: [
      {
        step: "01",
        title: "Confirmación por correo",
        desc: "Recibirás un correo con todos los detalles de tu reserva y las instrucciones de acceso.",
      },
      {
        step: "02",
        title: "Coordina tu llegada",
        desc: "48 horas antes de tu llegada, te contactaremos para coordinar el check-in y entregarte el código de acceso.",
      },
      {
        step: "03",
        title: "¡Disfruta Mérida!",
        desc: "Llega a partir de las 3 PM, relájate en tu villa privada y descubre la magia de Yucatán.",
      },
    ],
    backHome: "Volver al inicio",
    print: "Imprimir confirmación",
    rights: "Mérida, Yucatán, México",
  },
};

export const enTranslations: Translations = {
  langToggle: "ES",

  nav: {
    villa: "The Villa",
    amenities: "Amenities",
    gallery: "Gallery",
    location: "Location",
    book: "Book",
    bookNow: "Book now",
  },

  hero: {
    location: "Mérida, Yucatán · Mexico",
    description:
      "A private retreat where colonial elegance meets the tropical charm of the Yucatán Peninsula. Pool, lush garden, and authentic luxury.",
    bookDates: "Book your dates",
    discoverVilla: "Discover the villa",
    guests: "Guests",
    rooms: "Bedrooms",
    bathrooms: "Bathrooms",
    rating: "Rating",
  },

  about: {
    tag: "Our story",
    title: "A colonial gem in the heart of Mérida",
    p1: "Villas Candita is a lovingly restored property that blends Yucatecan colonial architecture with modern comforts. Every corner tells the story of a vibrant, culture-rich city.",
    p2: "The moment you step through the grand wooden door, the city's bustle fades away. You'll be welcomed by a tropical garden fragrant with gardenias and bougainvillea, and a crystal-clear pool surrounded by palms. Your private oasis in Mérida.",
    surface: "Area",
    renovated: "Renovated",
    private: "Private",
  },

  amenities: {
    tag: "What's included",
    title: "World-class amenities",
    subtitle: "Everything you need for a perfect stay, thoughtfully curated down to the last detail.",
    pool: { label: "Private pool", desc: "Heated pool with relaxation area" },
    ac: { label: "Air conditioning", desc: "In every room" },
    wifi: { label: "High-speed WiFi", desc: "300 Mbps fiber optic" },
    kitchen: { label: "Full kitchen", desc: "Premium appliances" },
    parking: { label: "Parking", desc: "Covered garage for 2 cars" },
    tv: { label: "Smart TV", desc: '55" with Netflix, Prime & more' },
    shower: { label: "Luxury bathrooms", desc: "With rain shower" },
    terrace: { label: "Terrace & garden", desc: "With palms and bougainvillea" },
    coffee: { label: "Coffee station", desc: "Nespresso & specialty coffee" },
    relax: { label: "Rest area", desc: "Hammocks and sun loungers" },
    security: { label: "24/7 security", desc: "Private code access" },
    location: { label: "Prime location", desc: "10 min from historic downtown" },
  },

  gallery: {
    tag: "Gallery",
    title: "Every space, an experience",
    subtitle: "Discover the corners that will make your stay an unforgettable memory.",
    alts: [
      "Colonial courtyard",
      "Common areas",
      "Tropical garden",
      "Interior spaces",
      "Colonial facade",
      "Terrace and garden",
      "Architectural details",
      "Villa corners",
    ],
    close: "Close",
    prev: "Previous",
    next: "Next",
  },

  rooms: {
    tag: "Rooms",
    title: "Choose your ideal space",
    subtitle:
      "Three private rooms, each with its own charm and character. All include access to common areas, pool, and garden.",
    footer:
      "All rooms include pool, garden & common area access · Check-in 3:00 PM · Check-out 12:00 PM",
    room: "Room",
    privateRoom: "Private room",
    upTo: "Up to",
    person: "person",
    persons: "people",
    perNight: "per night",
    book: "Book this room",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    photo: "Photo",
    descriptions: {
      canario:
        "Bright and cozy, with golden-toned details that evoke the warmth of the Yucatecan sun. Ideal for couples or travelers seeking comfort and tranquility.",
      azul: "Fresh and spacious, designed for groups and families. Its blue tones create a serene and refreshing atmosphere, with room for everyone to stay comfortably.",
      rosa: "Charming and romantic, with a warm and welcoming atmosphere. Its rose-toned finishes add a touch of elegance to this spacious room.",
    },
  },

  testimonials: {
    tag: "Reviews",
    title: "What our guests say",
    reviews: "reviews",
    items: [
      {
        name: "Ana González",
        origin: "Mexico City",
        date: "January 2026",
        text: "A magical experience. The villa is exactly as pictured, or even better. The pool is spectacular and the garden is paradise. We'll definitely be back.",
        avatar: "AG",
      },
      {
        name: "Carlos Rodríguez",
        origin: "Guadalajara",
        date: "December 2025",
        text: "We celebrated New Year's Eve here and it was perfect. The location is ideal, just minutes from Paseo de Montejo. The host was available at all times. 100% recommended.",
        avatar: "CR",
      },
      {
        name: "Patricia & Family",
        origin: "Monterrey",
        date: "November 2025",
        text: "We brought the kids and had an incredible week. The space is large, clean, and very safe. The kitchen has everything you need. We've already booked for summer vacation.",
        avatar: "PF",
      },
    ],
  },

  booking: {
    tag: "Availability",
    title: "Book your stay",
    subtitle: "Select your dates and we'll instantly calculate your total price.",
    selectDatesTitle: "Select your dates",
    roomLabel: "Room",
    guestsLabel: "Guests",
    guest: "guest",
    guests: "guests",
    adultsAndKids: "Adults and children",
    maxCapacity: "Maximum capacity",
    persons: "people",
    confirm: "Confirm",
    yourDates: "Your dates",
    selectDatesPrompt: "Select your dates",
    night: "night",
    nights: "nights",
    priceSummaryTitle: "Price summary",
    cleaningFee: "Cleaning fee",
    total: "Total",
    minStay: "Minimum stay is",
    minStayNights: "nights.",
    reserveButton: "Book",
    noChargeUntilConfirm: "You won't be charged until you confirm payment",
    cancellationPolicy: "Free cancellation up to 7 days before check-in",
    checkInOut: "Check-in from 3:00 PM · Check-out before 12:00 PM",
    securePayment: "100% secure payment with Openpay",
    blockedDatesError:
      "The selected range includes unavailable dates. Please choose different dates.",
    selectDatesToSeePrice: "Select your check-in and check-out dates to see the price.",
    perNight: "MXN/night",
    upTo: "Up to",
  },

  location: {
    tag: "Getting here",
    title: "Prime location",
    subtitle:
      "Villas Candita is nestled in a quiet residential area of Mérida, just minutes from the city's main attractions. The perfect base for exploring the Yucatán Peninsula.",
    exactAddress: "Exact address:",
    addressNote:
      "The full address is shared only with confirmed guests, ensuring your privacy and security.",
    mapTitle: "Villas Candita Location - Mérida, Yucatán",
    places: [
      { label: "Plaza Grande (Historic Downtown)", distance: "10 min by car" },
      { label: "Paseo de Montejo", distance: "8 min by car" },
      { label: "Santa Ana Market", distance: "5 min by car" },
      { label: "Gran Museo del Mundo Maya", distance: "15 min by car" },
      { label: "Mérida Airport (MID)", distance: "20 min by car" },
      { label: "Chichén Itzá", distance: "2 hrs by car" },
    ],
  },

  footer: {
    description:
      "Your private retreat in Mérida, Yucatán. Colonial elegance, tropical nature, and luxury amenities all in one place.",
    navigation: "Navigation",
    contact: "Contact",
    privacy: "Privacy policy",
    terms: "Terms & conditions",
    rights: "All rights reserved.",
  },

  privacyPage: {
    title: "Privacy policy",
    lastUpdated: "Last updated: May 2026",
    backHome: "Back to home",
    intro:
      "In compliance with Mexico's Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP) and its Regulations, Villas Candita provides you with this Privacy Policy.",
    responsibleTitle: "1. Data controller",
    responsibleText:
      "Villas Candita, located at Calle 52 #427 interior b, C.P. 97000, Mérida, Yucatán, Mexico, is responsible for the processing of your personal data. For any matter related to this privacy policy, you may contact us at: villascandita@yahoo.com or by phone at +52 818 253 3561.",
    dataCollectedTitle: "2. Personal data collected",
    dataCollectedText:
      "For the purposes stated in this privacy policy, we may collect the following personal data:",
    dataCollectedItems: [
      "Full name",
      "Email address",
      "Phone number",
      "Payment information (card number, cardholder name, expiration date, and CVV), securely processed through Openpay",
      "Special requests related to your stay",
    ],
    purposeTitle: "3. Purpose of data processing",
    purposeText:
      "Your personal data will be used for the following purposes:",
    purposePrimary: "Primary purposes (necessary):",
    purposePrimaryItems: [
      "Process and confirm your reservation",
      "Manage payment for the contracted services",
      "Provide you with information about your stay (access instructions, check-in, check-out)",
      "Respond to your inquiries, questions, or comments",
      "Comply with applicable tax and legal obligations",
    ],
    purposeSecondary: "Secondary purposes (not necessary):",
    purposeSecondaryItems: [
      "Send you promotional information about our services",
      "Conduct satisfaction surveys",
    ],
    purposeSecondaryNote:
      "If you do not wish your data to be processed for secondary purposes, please notify us at: villascandita@yahoo.com.",
    transferTitle: "4. Data transfers",
    transferText:
      "Your personal data may be transferred to the following third parties:",
    transferItems: [
      "Openpay: for secure credit or debit card payment processing",
      "Competent authorities: when required by law or by order of an authority",
    ],
    arcoTitle: "5. ARCO rights",
    arcoText:
      "You have the right to Access, Rectify, Cancel, or Oppose (ARCO rights) the processing of your personal data. To exercise any of these rights, send your request to: villascandita@yahoo.com, indicating:",
    arcoItems: [
      "Full name of the data subject",
      "Clear description of the data for which you wish to exercise a right",
      "Any document that facilitates the location of your data",
    ],
    arcoResponse:
      "We will respond to your request within a maximum of 20 business days from the date of receipt.",
    cookiesTitle: "6. Cookies and tracking technologies",
    cookiesText:
      "Our website may use cookies and other tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can disable cookies through your browser settings.",
    changesTitle: "7. Changes to this privacy policy",
    changesText:
      "We reserve the right to modify this privacy policy at any time. Changes will be available on this same web page. We recommend reviewing it periodically.",
    consentTitle: "8. Consent",
    consentText:
      "By providing your personal data through our website or by making a reservation, you consent to the processing of your data in accordance with this privacy policy.",
    contactTitle: "Contact",
    contactText:
      "If you have any questions or comments about this privacy policy, you can contact us at:",
    contactEmail: "villascandita@yahoo.com",
    contactPhone: "+52 818 253 3561",
    contactAddress: "Calle 52 #427 interior b, C.P. 97000",
    contactLocation: "Mérida, Yucatán, Mexico",
  },

  termsPage: {
    title: "Terms and conditions",
    lastUpdated: "Last updated: May 2026",
    backHome: "Back to home",
    intro:
      "By making a reservation or using the services of Villas Candita, you accept these terms and conditions. We recommend reading them carefully before proceeding with your booking.",

    reservationsTitle: "1. Reservations",
    reservationsText:
      "Reservations are considered confirmed only when full payment has been made through our payment platform (Openpay). Upon completing a reservation, you will receive a confirmation email with the details of your stay.",
    reservationsItems: [
      "Minimum stay is 2 nights",
      "Check-in is from 3:00 PM",
      "Check-out is before 12:00 PM",
      "The maximum capacity of the property must be respected at all times",
    ],

    paymentsTitle: "2. Payments and pricing",
    paymentsText:
      "All prices listed on our website are expressed in Mexican pesos (MXN) and include applicable taxes.",
    paymentsItems: [
      "Full payment is charged at the time of booking confirmation",
      "Payments are securely processed through Openpay",
      "The cleaning fee is included in the price breakdown",
      "Payments accepted via card, SPEI bank transfer, and cash at stores (Paynet)",
    ],

    cancellationTitle: "3. Cancellation policy",
    cancellationText:
      "We understand plans can change. Our cancellation policy is as follows:",
    cancellationItems: [
      "Free cancellation up to 7 days before the check-in date, with full refund",
      "Cancellations made between 3 and 6 days before arrival: 50% refund",
      "Cancellations made less than 3 days before arrival or no-show: no refund",
      "Cancellation requests must be sent by email to villascandita@yahoo.com",
    ],

    houseRulesTitle: "4. House rules",
    houseRulesText:
      "To ensure a pleasant stay for everyone, we ask you to follow these rules:",
    houseRulesItems: [
      "No parties or events without prior authorization",
      "No smoking inside the property",
      "Pets are allowed only with prior authorization and subject to an additional deposit",
      "Quiet hours are from 10:00 PM to 8:00 AM",
      "Respect the maximum guest capacity specified in the reservation",
      "Pool use under the influence of alcohol or substances is not permitted",
    ],

    liabilityTitle: "5. Liability",
    liabilityText:
      "Villas Candita is not responsible for:",
    liabilityItems: [
      "Personal items lost, damaged, or stolen during the stay",
      "Injuries or accidents occurring within the property",
      "Interruptions to public services (water, electricity, internet) caused by third parties",
      "Weather changes or force majeure events affecting the stay",
    ],
    liabilityNote:
      "The guest is responsible for any damage caused to the property, furniture, or equipment during their stay. Repair or replacement costs will be charged to the guest.",

    intellectualPropertyTitle: "6. Intellectual property",
    intellectualPropertyText:
      "All content on this website, including texts, photographs, designs, logos, and graphic elements, is the property of Villas Candita and is protected by Mexican intellectual property laws. Reproduction, distribution, or use without prior written authorization is prohibited.",

    modificationsTitle: "7. Changes to these terms",
    modificationsText:
      "Villas Candita reserves the right to modify these terms and conditions at any time. Changes will take effect upon publication on this page. Existing reservations will be governed by the terms in effect at the time of their confirmation.",

    governingLawTitle: "8. Governing law",
    governingLawText:
      "These terms and conditions are governed by the laws of the United Mexican States. For the resolution of any dispute arising from these terms, the parties submit to the jurisdiction of the competent courts of the city of Merida, Yucatan.",

    contactTitle: "Contact",
    contactText:
      "If you have any questions about these terms and conditions, you can contact us at:",
    contactEmail: "villascandita@yahoo.com",
    contactPhone: "+52 818 253 3561",
    contactAddress: "Calle 52 #427 interior b, C.P. 97000",
    contactLocation: "Merida, Yucatan, Mexico",
  },

  bookingPage: {
    loading: "Loading reservation...",
    back: "Back",
    step1: "Your info",
    step2: "Payment",
    guestInfoTitle: "Guest information",
    firstName: "First name",
    firstNamePlaceholder: "Maria",
    lastName: "Last name",
    lastNamePlaceholder: "García",
    email: "Email",
    emailPlaceholder: "maria@email.com",
    phone: "Phone",
    phonePlaceholder: "9991234567",
    specialRequests: "Special requests",
    specialRequestsOpt: "(optional)",
    specialRequestsPlaceholder: "Allergies, special needs, estimated arrival time...",
    continue: "Continue to payment",
    paymentTitle: "Payment information",
    editData: "Edit info",
    securePaymentNote: "Your payment is protected with 256-bit SSL encryption. Processed by",
    cardNumber: "Card number",
    cardHolder: "Cardholder name",
    month: "Month",
    year: "Year",
    mm: "MM",
    yy: "YY",
    cvv: "CVV",
    payButton: "Pay",
    processing: "Processing payment...",
    summaryTitle: "Booking summary",
    datesLabel: "Dates",
    night: "night",
    nights: "nights",
    guestLabel: "Guests",
    guestSingle: "guest",
    guestsPlural: "guests",
    cleaningFee: "Cleaning fee",
    total: "Total",
    cancellation: "Free cancellation up to 7 days before",
    securePaymentSmall: "Secure payment with Openpay",
    firstNameRequired: "First name is required.",
    lastNameRequired: "Last name is required.",
    emailInvalid: "Please enter a valid email address.",
    phoneInvalid: "Please enter a valid phone number (10 digits).",
    openpayNotReady:
      "Payment processor not available. Please reload the page.",
    errorGeneric: "Unexpected error. Please try again.",
    noBookingInfo: "No booking information found. Please select your dates.",
    selectDates: "Select dates",
    perNight: "MXN/night",
    dateArrow: "→",
    paymentMethodTitle: "Choose your payment method",
    methodCard: "Credit/debit card",
    methodCardDesc: "Instant payment with Visa, Mastercard or Amex",
    methodSpei: "SPEI bank transfer",
    methodSpeiDesc: "Electronic bank transfer (1-24 hrs)",
    methodPaynet: "Cash payment (Paynet)",
    methodPaynetDesc: "Pay at convenience stores with your reference",
    speiInstructions: "Make a SPEI transfer with the following details:",
    speiBank: "Destination bank",
    speiClabe: "CLABE account",
    speiReference: "Reference",
    speiAgreement: "CIE Agreement",
    speiAmount: "Exact amount",
    speiDueDate: "Payment deadline",
    speiNote: "Your booking will be automatically confirmed upon receiving the payment. Use the exact amount shown so it can be identified.",
    paynetInstructions: "Present this reference at any Paynet-affiliated convenience store:",
    paynetReference: "Payment reference",
    paynetBarcode: "Barcode",
    paynetAmount: "Amount to pay",
    paynetDueDate: "Payment deadline",
    paynetStores: "Affiliated stores: 7-Eleven, Farmacias del Ahorro, Walmart, Bodega Aurrera, Sam's Club, Soriana, and more.",
    paynetNote: "Your booking will be automatically confirmed upon receiving the payment.",
    pendingPaymentTitle: "Payment pending",
    pendingPaymentSubtitle: "Complete your payment to confirm your booking",
    copiedToClipboard: "Copied to clipboard",
    copy: "Copy",
    payBefore: "Pay before",
    generatePayment: "Generate payment details",
    generatingPayment: "Generating...",
  },

  confirmationPage: {
    loading: "Verifying your booking...",
    confirmed: "Booking confirmed!",
    thanks: "Thank you",
    bookingProcessed: "Your booking at Villas Candita has been successfully processed.",
    bookingNumber: "Booking number:",
    stayDetails: "Your stay details",
    checkIn: "Check-in",
    checkOut: "Check-out",
    fromTime: "From 3:00 PM",
    beforeTime: "Before 12:00 PM",
    guestsLabel: "Guests",
    person: "person",
    persons: "people",
    night: "night",
    nights: "nights",
    property: "Property",
    paymentDone: "Payment completed",
    totalPaid: "Total paid",
    securePayment: "Securely processed by Openpay",
    checkEmail: "Check your email",
    emailSent: "We've sent your booking confirmation and access details to",
    needHelp: "Need help?",
    whatNext: "What's next?",
    nextSteps: [
      {
        step: "01",
        title: "Confirmation email",
        desc: "You'll receive an email with all your booking details and access instructions.",
      },
      {
        step: "02",
        title: "Coordinate your arrival",
        desc: "48 hours before your arrival, we'll contact you to coordinate check-in and share the access code.",
      },
      {
        step: "03",
        title: "Enjoy Mérida!",
        desc: "Arrive from 3 PM, relax in your private villa, and discover the magic of Yucatán.",
      },
    ],
    backHome: "Back to home",
    print: "Print confirmation",
    rights: "Mérida, Yucatán, Mexico",
  },
};

export const translations: Record<Lang, Translations> = {
  es: esTranslations,
  en: enTranslations,
};
