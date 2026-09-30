# API endpoint registry — auth (student web)

Source of truth: Express server mounted at `/api/v1` ([server/src/routes/index.ts](../../server/src/routes/index.ts), [server/src/modules/user/user.routes.ts](../../server/src/modules/user/user.routes.ts)).

**Base URL:** `{NEXT_PUBLIC_API_BASE_URL}` (must include `/api/v1`).

**Envelope (all JSON responses):**

```json
{
  "success": true,
  "message": "Human-readable message",
  "statusCode": 200,
  "data": {}
}
```

Errors use the same shape with `success: false` and an appropriate HTTP status.

**Validation error example (400):**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation Error",
  "errorMessages": [
    { "path": "phone_number", "message": "Phone number must be provided" }
  ]
}
```

**Conflict example (409):**

```json
{
  "statusCode": 409,
  "success": false,
  "message": "Duplicate field value",
  "errorMessages": [
    { "path": "phone_number", "message": "phone_number already exists" }
  ]
}
```

---

## Authentication headers

| Header            | When                   | Value                                                        |
| ----------------- | ---------------------- | ------------------------------------------------------------ |
| `Authorization`   | Protected routes       | Raw access token JWT (no `Bearer` prefix required by server) |
| `x-refresh-token` | Optional refresh flows | Refresh token JWT                                            |
| `Content-Type`    | POST/PATCH bodies      | `application/json`                                           |

---

## Endpoints

### POST `/user/login`

Sign in with phone and password.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `phone_number` | string | yes      |
| `password`     | string | yes      |

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "You've logged in successfully",
  "data": {
    "_id": "string",
    "name": "Jane Student",
    "phone_number": "01800000000",
    "role": "student",
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

**401 example:**

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Unauthenticated access. Please login to access resource(s)",
  "errorMessages": [
    {
      "path": "",
      "message": "Unauthenticated access. Please login to access resource(s)"
    }
  ]
}
```

**Errors:** 400 validation, 401 invalid credentials or unverified account (may trigger OTP resend server-side).

---

### POST `/user`

Register a new user; sends SMS verification OTP.

**Auth:** Public

**Body:**

| Field          | Type   | Required | Notes                                                                              |
| -------------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| `name`         | string | yes      | min 3                                                                              |
| `phone_number` | string | yes      |                                                                                    |
| `password`     | string | yes      | 6–15 chars                                                                         |
| `role`         | string | yes      | Student web sends `"customer"` |
| `email`        | string | no       | valid email or empty           |

**Example body:**

```json
{
  "name": "Jane Student",
  "phone_number": "01800000000",
  "email": "jane@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Success (201):** `success: true`; `data` may be null; message indicates SMS OTP sent.

**Errors:** 400 validation, 409 conflict (phone already registered).

---

### POST `/user/verify`

Verify registration OTP and log the user in.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- | ------- |
| `phone_number` | string | yes      |
| `otp`          | number | yes      | 6-digit |

**Success (200):** `data` includes user and tokens (same as login).

**Errors:** 400 wrong/expired OTP.

---

### POST `/user/resend-otp`

Resend registration verification OTP.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `phone_number` | string | yes      |

**Success (200):** OTP resent (rate limits may apply).

---

### POST `/forget-password/user`

Start forgot-password flow; sends SMS verification code.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `phone_number` | string | yes      |

**Success (200):** Message confirms code sent; `data` may include rate-limit metadata.

---

### POST `/otp/validate/verify`

Verify OTP for forgot-password (standalone OTP module). Deletes OTP record on success.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- |
| `phone_number` | string | yes      |
| `otp`          | number | yes      |

**Success (200):** OTP valid.

**Errors:** 400 wrong OTP, 404 expired/missing OTP.

**Note:** `PATCH /user/reset-password` does not re-check OTP on the server. The UI must call this verify step before reset.

---

### PATCH `/user/reset-password`

Set a new password after forgot-password OTP was verified in the UI.

**Auth:** Public

**Body:**

| Field          | Type   | Required |
| -------------- | ------ | -------- | ---------- |
| `phone_number` | string | yes      |
| `password`     | string | yes      | 6–15 chars |

**Success (200):** Password updated; user should log in again.

**Errors:** 404 user not found.

---

### POST `/user/refresh-token`

Issue new access and refresh tokens.

**Auth:** Public

**Body:**

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| `refresh_token` | string | yes      |

**Success (200):** `data` with `access_token` and `refresh_token`.

---

### GET `/user/auth`

Current authenticated user.

**Auth:** Required (`Authorization`)

**Success (200):** `data` user object (password omitted).

**Errors:** 401 unauthenticated.

---

### DELETE `/user/logout`

Log out (server-side session/cookie cleanup as implemented).

**Auth:** Public (per route definition)

**Success (200):** Logged out.

---

## Deferred (not used in student auth v1)

| Method | Path                         | Notes                        |
| ------ | ---------------------------- | ---------------------------- |
| POST   | `/user/auth/google`          | Google sign-in               |
| POST   | `/user/auth/google/register` | Complete Google registration |
| GET    | `/user/auth/google-config`   | OAuth client IDs             |
| PATCH  | `/user/change-password`      | Logged-in password change    |
| PATCH  | `/user/self`                 | Profile update               |

---

## Contract gap (register role)

- Model default role: `student` ([user.model.ts](../../server/src/modules/user/user.model.ts)).
- Create validation enum: vendor/customer roles in [user.enum.ts](../../server/src/modules/user/user.enum.ts) / [user.validate.ts](../../server/src/modules/user/user.validate.ts).

**Action:** Add `student` to server `USER_ROLES` (or accept default without sending `role`) before production register. Client must not send vendor roles.
