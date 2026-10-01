# Coding plan — student web (auth phase)

How we build auth and later features in this repo. Follow this before adding routes or API calls.

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4, design tokens in `app/globals.css` |
| Components | [shadcn/ui](https://ui.shadcn.com) (`components/ui`, configured in `components.json`) |
| Package manager | pnpm |
| Backend | Existing Express API in sibling `server` repo folder |
| HTTP | Native `fetch` via a thin typed client (to be added under `lib/api`) |

**Theme:** light only (`color-scheme: light`, no `.dark` palette). Brand primary `#1F4F43` maps to shadcn `--primary`. Use `pnpm dlx shadcn@latest add <component>` to add primitives; extend in `components/auth` for forms.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Dev/production listen port (default `3002` via `scripts/next.mjs`) |
| `NEXT_PUBLIC_BASE_URL` | **This app’s** public origin (e.g. `http://localhost:3002`) for metadata and site URLs |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API root **including** `/api/v1` (e.g. `https://api.mcqanalysis.com/api/v1`) |

Do not point `NEXT_PUBLIC_BASE_URL` at the API. The admin frontend reused one name for the API; this student app splits them on purpose.

Local API example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9001/api/v1
```

## API client conventions (next implementation)

- Base URL from `NEXT_PUBLIC_API_BASE_URL`, normalized (no trailing slash duplication).
- Every response matches server envelope: `{ success, message, statusCode, data }`.
- On `success === false`, throw an error carrying `message` for UI `Alert`.
- **Authorization:** send the raw JWT in the `Authorization` header (server does not strip a `Bearer` prefix).
- **Refresh:** `POST /user/refresh-token` with `{ refresh_token }` when the access JWT is expired or a protected call returns 401. Persist the new token pair in cookies. Use `apiGetAuth` / `apiPostAuth` / `apiPatchAuth` for authenticated calls.
- Store tokens in httpOnly cookies or secure client storage in a dedicated auth module—decide in the auth implementation task; document the choice in code comments there.

## Folder structure (auth)

```
app/
  (auth)/
    login/page.tsx
    register/page.tsx
    verify/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
  layout.tsx
components/
  ui/          # Button, TextField, Alert, AuthShell, …
  auth/        # LoginForm, RegisterForm, …
lib/
  api/         # client, endpoints, types
  site.ts      # app origin helpers
docs/          # design book, registry, this file
```

## Page vs form rules

- **Pages:** Server components when possible; only import client forms and pass static copy.
- **Forms:** Client components (`"use client"`) with local state and submit handlers calling `lib/api`.
- **Validation:** Mirror server rules client-side for UX; server remains source of truth.

## Auth domain rules

- Login identifier is **phone number** (`phone_number`), not email.
- Password length for register/reset: **6–15** characters (server validators).
- Register payload includes `role`. Student app intends **`student`**. Server Zod enum in `user.validate.ts` currently lists vendor/customer roles only while the user model defaults to `student`—coordinate a server enum fix before shipping register, or registration will 400 until aligned.
- OTP is a **number** (six digits) in verify payloads.
- Forgot password flow: request OTP → verify via OTP validate → `PATCH /user/reset-password`.

## Out of scope (auth phase)

- Google sign-in (`/user/auth/google*`)
- Admin routes
- Change password while logged in
- Profile and dashboard

## Code quality

- Match existing import style (`@/` paths).
- Keep diffs small; no unrelated refactors.
- Reference [design-book.md](./design-book.md) for visual classes and [api-registry.md](./api-registry.md) for endpoints.
