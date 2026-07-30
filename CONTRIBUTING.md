# Contributing

1. Use Node.js 20.9 or newer.
2. Install the exact dependency tree with `npm ci`.
3. Copy `.env.example` to `.env.local` and use sandbox credentials.
4. Create a focused branch and add tests for behavior changes.
5. Run `npm run check` and `npm run build` before opening a pull request.

Never commit Openpay credentials or real customer and payment data. Tests must
use synthetic values.
