# Taste Hunter Bistro — Next.js KA/EN site with BOG payments (stub)

## Quick start
```bash
cp .env.example .env
npm install
npm run dev
# visit http://localhost:3000
```

## Docker
```bash
docker compose up --build -d
# visit http://localhost
```

## Notes
- Update `src/lib/menu.ts` with real Wolt images and prices as needed.
- Implement BOG at `src/pages/api/bog/create-payment.ts` with your credentials.
- Colors from logo: red #FF3B2E, mint #E9FBF6.
