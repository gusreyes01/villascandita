# Villas Candita

Sitio web de renta vacacional para Villas Candita en Merida, Yucatan, Mexico.

## Tecnologias

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- react-date-range (selector de fechas)
- Openpay (procesador de pagos mexicano)
- Vercel (hosting)

## Estructura del proyecto

```
src/
  app/
    page.tsx              - Pagina principal (landing)
    booking/
      page.tsx            - Wrapper con Suspense
      BookingForm.tsx     - Formulario de reserva + pago con Openpay
    confirmation/
      page.tsx            - Wrapper con Suspense
      ConfirmationContent.tsx  - Pagina de confirmacion exitosa
    api/
      charge/
        route.ts          - API endpoint para cobros con Openpay
  components/
    Header.tsx            - Navegacion con scroll behavior
    Hero.tsx              - Seccion hero con fondo y CTA
    AboutSection.tsx      - Historia y descripcion de la villa
    Amenities.tsx         - Grid de comodidades
    Gallery.tsx           - Galeria con lightbox
    BookingWidget.tsx     - Selector de fechas + calculo de precio
    Testimonials.tsx      - Resenas de huespedes
    Location.tsx          - Ubicacion y mapa
    Footer.tsx            - Pie de pagina
```

## Configuracion local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env.local
   ```

3. Configurar tus credenciales de Openpay en `.env.local`:
   - Obtener credenciales en https://dashboard.openpay.mx
   - Llenar `NEXT_PUBLIC_OPENPAY_MERCHANT_ID`, `NEXT_PUBLIC_OPENPAY_PUBLIC_KEY` y `OPENPAY_PRIVATE_KEY`

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir http://localhost:3000

## Configuracion de Openpay

El flujo de pago funciona asi:

1. El usuario selecciona fechas en el `BookingWidget` y el precio se calcula automaticamente
2. Al hacer clic en "Reservar", va a `/booking` con los parametros en la URL
3. El usuario llena sus datos y la informacion de su tarjeta
4. El frontend tokeniza la tarjeta con `OpenPay.token.create()` (sin datos sensibles en el servidor)
5. El token se envia al API route `/api/charge` que hace el cobro via la API REST de Openpay
6. En caso de exito, el usuario es redirigido a `/confirmation`

### Credenciales de prueba (sandbox)

Tarjeta de prueba aprobada: `4111 1111 1111 1111`
Fecha: cualquier fecha futura
CVV: cualquier numero de 3 digitos

## Imagenes de la propiedad

Actualmente el sitio usa imagenes de Unsplash como placeholders. Para usar las fotos reales:

1. Agregar las imagenes en `public/images/`
2. Actualizar las rutas en:
   - `src/components/Hero.tsx` (imagen de fondo del hero)
   - `src/components/AboutSection.tsx` (grid de imagenes)
   - `src/components/Gallery.tsx` (array `galleryImages`)
   - `src/app/booking/BookingForm.tsx` (imagen del summary)

## Precios y disponibilidad

Editar en `src/components/BookingWidget.tsx`:

```typescript
const NIGHTLY_RATE = 2500; // MXN por noche
const CLEANING_FEE = 800;  // Tarifa de limpieza fija
const MIN_NIGHTS = 2;      // Minimo de noches

// Fechas bloqueadas (no disponibles)
const blockedDates: Date[] = [
  new Date("2026-03-15"),
  // ...
];
```

## Despliegue en Vercel

1. Conectar el repositorio en https://vercel.com
2. Configurar las variables de entorno en Vercel:
   - `NEXT_PUBLIC_OPENPAY_MERCHANT_ID`
   - `NEXT_PUBLIC_OPENPAY_PUBLIC_KEY`
   - `OPENPAY_PRIVATE_KEY`
   - `NEXT_PUBLIC_OPENPAY_SANDBOX` (cambiar a `"false"` en produccion)
3. Vercel desplegara automaticamente en cada push a `main`
