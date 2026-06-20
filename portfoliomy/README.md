# portfoliomy

Unified Next.js app: public portfolio, admin panel, and API routes.

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string (same database as the old backend)
- Copy env values from `backend/.env` into `portfoliomy/.env.local`

## Setup

```bash
cd portfoliomy
npm install
```

Create `.env.local` from the example:

```bash
copy .env.local.example .env.local
```

Fill in at minimum:

| Variable | Required for |
|----------|----------------|
| `MONGO_URI` | Portfolio page + all APIs |
| `JWT_SECRET` | Admin login |
| `CLOUDINARY_*` | Image uploads in admin |
| `EMAIL_USER` / `EMAIL_PASS` | Message notifications & replies |

## Run locally

```bash
npm run dev
```

**Important:** Watch the terminal output for the actual URL. If port 3000 is already in use (e.g. old website or backend), Next.js will use **3001, 3004, etc.** instead.

Example terminal output:

```
▲ Next.js 16.2.9
- Local: http://localhost:3005
- Environments: .env.local
✓ Ready in 3.0s
```

Open the **Local** URL shown in your terminal.

## URLs

| Page | Path |
|------|------|
| Public portfolio | `http://localhost:3000/` (or the port shown in terminal) |
| Admin login | `/admin/login` |
| Admin dashboard | `/admin` |

Default admin (create with `npm run create-admin`):

- Email: `admin@anas.dev`
- Password: `AdminPassword123`

## Verify it works

1. **API health** — in browser or terminal:
   ```
   http://localhost:3000/api/portfolio/data
   ```
   Should return JSON with `bio`, `skills`, `projects`, etc.

2. **Home page** — open `/` — portfolio sections should render.

3. **Admin** — go to `/admin/login`, sign in, open `/admin`.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Run production build
npm run create-admin # Create admin user in MongoDB
npm run seed         # Seed data via backend/scripts/seed.js
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page or "Portfolio failed to load" | Check `MONGO_URI` in `.env.local` and internet access to MongoDB Atlas |
| Wrong site opens | You may be on port 3000 with an old app running — use the port from `npm run dev` output |
| Running from wrong folder | Must run commands inside `portfoliomy/`, not the repo root |
| Admin login fails | Run `npm run create-admin` and ensure `JWT_SECRET` is set |
| Port already in use | Stop other Node apps or run `npm run dev -- -p 3005` |

## Project structure

- `src/app/` — pages and API routes
- `src/components/portfolio/` — public site UI
- `src/components/admin/` — admin UI
- `src/lib/` — database, auth, services
