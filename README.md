# Mavericks Timesheet (Next.js + Prisma)

A domain-restricted timesheet system for **@themavericksindia.com** with user/admin roles, multi-line entry, charts, and admin dashboards.

## Features

- Email+password auth (No OAuth), restricted to a single domain (`ALLOWED_EMAIL_DOMAIN`).
- Password reset via token link (SMTP optional; admin can reset via DB if needed).
- Users:
  - Add **multiple line items** at once.
  - Fields: client (dropdown), details, month (YYYY-MM), actual hours, next month's projected hours.
  - Auto totals and % utilization (160h baseline).
  - See their own entries and a chart (hours by client).
- Admin:
  - Global settings: enable/disable frontend.
  - Manage clients (add/activate/deactivate/delete).
  - See all entries; delete entries; view by month/user/client (via table with sort/export handled by browser or future enhancement).
- Backend API with Prisma models.
- Ready for **Vercel** deploy (use Vercel Postgres).

## Quick Start (Local)

1. `cp .env.example .env`
2. Keep default `DATABASE_URL="file:./dev.db"` (SQLite) for local testing.
3. `npm install`
4. `npx prisma migrate dev --name init`
5. (Optional) Seed settings: `npx prisma db execute --file=prisma/seed.sql`
6. `npm run dev` and open http://localhost:3000

## Admin Setup

- Create your first user via **Sign up** (must be `@themavericksindia.com`).
- To promote to admin, run in your DB:
  - SQLite: `UPDATE User SET role='ADMIN' WHERE email='you@themavericksindia.com';`
  - Postgres: `UPDATE "User" SET role='ADMIN' WHERE email='you@themavericksindia.com';`
- Then visit **/admin** to manage clients and settings.

## Vercel Deployment

1. **Create project** on Vercel, import this repo.
2. **Add Vercel Postgres** and set `DATABASE_URL` in Project → Settings → Environment Variables.
   - Also set `DATABASE_PROVIDER=postgresql`
3. Set additional env vars:
   - `JWT_SECRET` (strong random string)
   - `ALLOWED_EMAIL_DOMAIN` = `themavericksindia.com`
   - `APP_BASE_URL` (your Vercel URL, e.g., `https://timesheet.vercel.app`)
   - (Optional SMTP) `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
4. In Vercel, add a **Build Command**: `prisma generate && next build`
5. In Vercel, add a **Install Command**: `npm install`
6. After first deploy, run migrations:
   - Vercel CLI (or deploy hook): `npx prisma migrate deploy`
7. Create first admin:
   - Temporarily sign up, then set role to ADMIN in the DB (Vercel Postgres: use the Vercel dashboard SQL editor).

## Notes / Decisions vs. Your Requirements

- **No Google OAuth**: Auth is username+password, restricted to `@themavericksindia.com`.
- **Remove planned hours** field: implemented.
- **Multiple line items**: implemented (bulk save).
- **Users see their data + visuals**: table + bar chart.
- **Admin can delete entries**: implemented.
- **Admin month & user-wise views**: table sortable by headers; filtering/export can be added quickly if desired.
- **Reset password on sign-in**: implemented via token link; requires SMTP for sending.
- **Frontend enable/disable**: toggle under Admin → Settings.
- **Client dropdown list lives in Admin**: add/activate/deactivate/delete clients there; users see active clients automatically.
- **Auto-update of months, employee names, client names**: month chosen via input; names & clients come from DB and reflect updates immediately on reload.

## Roadmap (Optional Enhancements)

- Filters (by user, client, month) + CSV export on Admin.
- Visualization on Admin (aggregate charts).
- Strict rate limiting, CSRF tokens.
- Soft-deletes & audit logs.
- Granular permissions for approvers.
- Project budgets and utilization alerts.

## Security

- HttpOnly cookie with signed JWT.
- Domain-allowlist at signup & login.
- Bcrypt password hashing.

Enjoy!
