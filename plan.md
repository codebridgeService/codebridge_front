# Restructure: Next.js Monolith → Frontend + Backend Split

## Overview

The current project is a **Next.js fullstack monolith** where both the UI and API live inside `app/`. The goal is to split it into two independent folders:

- `frontend/` — Next.js (UI only, no more `app/api/`) Motion ( for animation)
- `backend/` — Node.js + Express + TypeScript + Prisma + MongoDB (REST API only)

---

## ⚠️ Important Notes

- The `app/api/` folder (Next.js Route Handlers) will be **deleted** after migrating all logic to the Express backend. All 7 API groups will be recreated as Express routes.
- The `NEXT_PUBLIC_API_URL` in the frontend must change from `/api` (relative, same-origin) to a full URL like `http://localhost:5000/api` for local dev. This means **CORS** must be enabled on the Express backend.
- The `lib/` folder at the root currently serves the Next.js API routes. It will be **moved into** `backend/src/lib/` and removed from the frontend entirely.

---

## Open Questions (Answered)

1. **Backend port**: What port should the Express backend run on? Default suggestion: `5000` (frontend stays on `3000`).
   - *Answer*: Yes, `5000` is standard and perfectly fine.
2. **Image uploads**: Are image uploads done via the backend (frontend → backend → ImageKit), or directly from the browser to ImageKit?
   - *Answer*: In the current implementation (e.g. team-members and projects), the frontend sends base64 image data to the backend, and the backend uses `lib/imagekit.js` to upload to ImageKit. This logic will be migrated to the backend `src/lib/imagekit.js`.
3. **Google OAuth redirect URL**: Currently `http://localhost:3000/api/auth/google/callback`. After splitting, this will move to `http://localhost:5000/api/auth/google/callback`. Keep or remove?
   - *Answer*: Keep the OAuth callback on the backend (`5000`). After processing the Google profile and generating a JWT, the backend callback should redirect the user back to the frontend (`http://localhost:3000`) with the token (e.g., via a query parameter or a secure cookie).

---

## Proposed New Structure

```
my-company/
├── frontend/                   ← Next.js (UI only)
│   ├── app/
│   │   ├── (user)/             ← public pages (about, contact, etc.)
│   │   ├── admin/              ← admin dashboard pages
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── components/         ← all UI components
│   │   ├── context/            ← LanguageContext
│   │   ├── store/              ← API fetch wrappers (updated URLs)
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── public/                 ← images, logos, lang flags
│   ├── .env.local              ← NEXT_PUBLIC_API_URL=http://localhost:5000/api
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   ├── jsconfig.json
│   ├── eslint.config.mjs
│   └── package.json
│
└── backend/                    ← Express REST API
    ├── src/
    │   ├── routes/
    │   │   ├── auth.routes.ts
    │   │   ├── packages.routes.ts
    │   │   ├── services.routes.ts
    │   │   ├── teamMembers.routes.ts
    │   │   ├── users.routes.ts
    │   │   ├── contact.routes.ts
    │   │   ├── admin.routes.ts
    │   │   ├── projects.routes.ts
    │   │   └── projectRequests.routes.ts
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   ├── packages.controller.ts
    │   │   ├── services.controller.ts
    │   │   ├── teamMembers.controller.ts
    │   │   ├── users.controller.ts
    │   │   ├── contact.controller.ts
    │   │   ├── admin.controller.ts
    │   │   ├── projects.controller.ts
    │   │   └── projectRequests.controller.ts
    │   ├── middleware/
    │   │   └── auth.middleware.ts   ← JWT verifyToken (from lib/auth.ts)
    │   ├── lib/
    │   │   ├── prisma.ts            ← moved from root lib/
    │   │   ├── mail.ts              ← moved from root lib/
    │   │   └── imagekit.ts          ← moved from root lib/
    │   └── index.ts                 ← Express app entry point
    ├── prisma/
    │   ├── schema.prisma            ← moved from root prisma/
    │   └── seed.ts
    ├── .env                         ← all server-side secrets
    └── package.json
```

---

## API Routes Migration Table

| Next.js Route                              | Express Route                                                 |
| ------------------------------------------ | ------------------------------------------------------------- |
| `app/api/auth/login/route.js`            | `POST /api/auth/login`                                      |
| `app/api/auth/register/route.js`         | `POST /api/auth/register`                                   |
| `app/api/auth/profile/route.js`          | `GET /api/auth/profile`, `PUT /api/auth/profile`          |
| `app/api/auth/password/route.js`         | `PUT /api/auth/password`                                    |
| `app/api/auth/forgot-password/route.js`  | `POST /api/auth/forgot-password`                            |
| `app/api/auth/reset-password/route.js`   | `POST /api/auth/reset-password`                             |
| `app/api/auth/google/route.js`           | `GET /api/auth/google` + callback                           |
| `app/api/packages/route.js`              | `GET /api/packages`, `POST /api/packages`                 |
| `app/api/packages/[id]/route.js`         | `GET/PUT/DELETE /api/packages/:id`                          |
| `app/api/services/route.js`              | `GET /api/services`, `POST /api/services`                 |
| `app/api/services/[id]/route.js`         | `GET/PUT/DELETE /api/services/:id`                          |
| `app/api/team-members/route.js`          | `GET /api/team-members`, `POST /api/team-members`         |
| `app/api/team-members/[id]/route.js`     | `GET/PUT/DELETE /api/team-members/:id`                      |
| `app/api/users/route.js`                 | `GET /api/users`                                            |
| `app/api/users/[id]/route.js`            | `GET/PUT/DELETE /api/users/:id`                             |
| `app/api/projects/route.js`              | `GET /api/projects`, `POST /api/projects`                 |
| `app/api/projects/[id]/route.js`         | `GET/PUT/DELETE /api/projects/:id`                          |
| `app/api/project-requests/route.js`      | `GET /api/project-requests`, `POST /api/project-requests` |
| `app/api/project-requests/[id]/route.js` | `GET/PUT/DELETE /api/project-requests/:id`                  |
| `app/api/contact/route.js`               | `POST /api/contact`                                         |
| `app/api/admin/stats/route.js`           | `GET /api/admin/stats`                                      |

---

## Frontend Changes

- **Remove**: `app/api/` entire folder
- **Remove**: root `lib/` folder (server-only, moves to backend)
- **Update**: `app/store/*.js` — change `NEXT_PUBLIC_API_URL` from `/api` to `http://localhost:5000/api`
- **Trim** `package.json` — remove server-only deps (Prisma, bcryptjs, nodemailer, imagekit, jsonwebtoken, google-auth-library)
- **Add** `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

---

## Backend Setup

- **Port**: `5000` (configurable via `PORT` env)
- **CORS**: Allow `http://localhost:3000` + production frontend URL
- **Auth**: JWT via `Authorization: Bearer <token>` header
- **Database**: MongoDB via Prisma ORM (mongodb+srv://codebridge2026_db_user:1B4enSmuyuXpBL2l@codebridgeadmin.hzvfonj.mongodb.net/?appName=CodebridgeAdmin)
- **Email**: Nodemailer via Gmail SMTP
- **Images**: ImageKit SDK

### Backend `.env`

```
PORT=5000
DATABASE_URL=...
JWT_SECRET=...
APP_NAME=codebridge
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=...
MAIL_FROM_NAME=Codebridge
CLOUDINARY_CLOUD_NAME=de7fvgwhu
CLOUDINARY_API_SECRET=8tK2mACJZIMNYdP7p-TEaPR4fkg
CLOUDINARY_API_KEY=...
# (If keeping ImageKit instead of Cloudinary, update accordingly:
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=8tK2mACJZIMNYdP7p-TEaPR4fkg
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/de7fvgwhu)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=codebridge2026@gmail.com
ADMIN_PASSWORD=Code2020@
# TELEGRAM_BOT_TOKEN=...
# TELEGRAM_CHAT_ID=...
```

---

## Migration Order (Step by Step)

1. **Create `backend/`** — Express skeleton, move `lib/` and `prisma/`, install deps
2. **Migrate API routes** — one group at a time:
   - Auth (login, register, profile, password, forgot/reset, google)
   - Packages (CRUD)
   - Services (CRUD)
   - Team Members (CRUD)
   - Users (CRUD)
   - Projects (CRUD)
   - Project Requests (CRUD)
   - Contact
   - Admin stats
3. **Test backend standalone** — verify all endpoints work
4. **Create `frontend/`** — copy frontend files, update store URLs, create `.env.local`, trim `package.json`
5. **Delete** old `app/api/` and root `lib/`
6. **End-to-end test** — frontend ↔ backend communication

---

## Verification Checklist

- [ ] Backend Express server starts on port 5000
- [ ] Frontend Next.js starts on port 3000
- [ ] Home page loads packages & services from backend
- [ ] Login / Register works
- [ ] Forgot password email sends
- [ ] Admin dashboard CRUD works (packages, services, team, users)
- [ ] Contact form submits successfully
- [ ] No CORS errors in browser console
- [ ] JWT auth token accepted by Express middleware
- [ ] Google OAuth callback redirects correctly
