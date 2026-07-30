# Villas Candita

Bilingual vacation-rental site for Villas Candita in Merida, Yucatan. It uses
Next.js 16, TypeScript, Tailwind CSS, and Openpay card, SPEI, and Paynet flows.

## Requirements

- Node.js 20.9 or newer
- npm
- Openpay sandbox credentials for payment testing

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Configure all values documented in `.env.example`. `APP_BASE_URL` may use
`http://localhost` locally; production must use HTTPS. Generate
`PAYMENT_SIGNING_SECRET` with at least 32 random characters.

Open <http://localhost:3000> after the development server starts.

## Quality checks

```bash
npm run check
npm run build
npm audit --omit=dev
```

`npm run check` runs ESLint, the TypeScript compiler, and the Vitest suite. The
same checks and a production build run for every pull request and push to
`main`.

## Payment security model

The browser sends only a payment token, customer details, and the requested room
and stay. The API validates a strict schema and independently derives:

- room rate, number of nights, cleaning fee, and total amount;
- availability and room-capacity constraints;
- Openpay description, order identifier, due date, and redirect URL.

Client-supplied amount, description, and due-date fields are rejected. Pending
3D Secure verification is bound to the provider charge with a short-lived,
HttpOnly, HMAC-signed cookie before the server retrieves charge status.

Openpay card data is tokenized in the browser and must never be logged or sent
directly to this application.

## Project layout

```text
src/
  app/
    api/charge/          Openpay charge and verification routes
    booking/             Guest and payment workflow
    confirmation/        Successful booking summary
  components/            Landing page and booking UI
  lib/
    booking.ts           Authoritative rooms, availability, and quotes
    payment.ts           Strict request validation and provider payloads
    payment-verification.ts
tests/                   Pricing, validation, and signature tests
```

Update room rates, capacity, and blocked dates in `src/lib/booking.ts`; both the
browser and API consume that single source of truth.

## Deployment

Set every variable in `.env.example` in the deployment environment. Use live
Openpay keys, `NEXT_PUBLIC_OPENPAY_SANDBOX=false`, a strong independent signing
secret, and an HTTPS `APP_BASE_URL`. Vercel can deploy the application from
`main` after CI passes.

See `SECURITY.md` for private vulnerability reporting and `CONTRIBUTING.md` for
the contribution workflow.
