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

**Example body:**

```json
{
  "phone_number": "01700000000",
  "password": "newpass123"
}
```

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Your password has been reset successfully. Please login to your account",
  "data": null
}
```

**400 example:**

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

**Errors:** 400 validation, 404 user not found.

**Note:** `PATCH /user/change-password` (logged-in, `old_password` + `new_password`) is not used on the login card; add later under account settings.

---

### POST `/user/refresh-token`

Issues new access and refresh tokens from a valid refresh token. Used when the access JWT `exp` has passed (or a protected call returns 401). Body is `{ refresh_token }` (not `x-refresh-token`).

**Auth:** Public

**Body:**

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| `refresh_token` | string | yes      |

**Example body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Token refreshed",
  "data": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

**400 example:**

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation Error",
  "errorMessages": [
    { "path": "refresh_token", "message": "Refresh token must be provided" }
  ]
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

**Client behavior:** Decode the access JWT `exp`. If expired (or a `*Auth` request returns 401), call this endpoint, replace both cookies, and retry once. On 400/401, clear cookies and send the user to `/login`.

---

### GET `/user/auth`

Current authenticated user (profile read for dashboard header/sidebar).

**Auth:** Required (`Authorization`)

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User retrieved",
  "data": {
    "_id": "string",
    "name": "Jane Student",
    "phone_number": "01800000000",
    "fcmToken": "",
    "image": "",
    "is_Deleted": false,
    "email": "jane@example.com",
    "role": "student",
    "status": "active",
    "last_login_at": "2026-10-01T15:01:35.036Z",
    "createdAt": "2026-10-01T15:01:35.036Z",
    "updatedAt": "2026-10-01T15:01:35.036Z"
  }
}
```

**Errors:** 401 unauthenticated.

---

### PATCH `/user/self`

Update the authenticated user's own profile (Settings page).

**Auth:** Required (`Authorization`)

**Body (all optional):**

| Field          | Type   |
| -------------- | ------ |
| `name`         | string |
| `image`        | string |
| `phone_number` | string |
| `email`        | string |

**Example body:**

```json
{
  "name": "Jane Student",
  "email": "jane@example.com",
  "phone_number": "01800000000",
  "image": "https://example.com/avatar.png"
}
```

**Success (200):** `data` is the updated user object (same shape as GET `/user/auth`).

**400 example:**

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

**401 example:** Same unauthenticated envelope as login.

---

## Exams (student dashboard)

### GET `/exam/upcoming`

Upcoming published exams that have not started.

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes        |
| ------------ | ------- | ------- | ------------ |
| `page`       | integer | 1       |              |
| `limit`      | integer | 5       | Use up to 10 |
| `searchTerm` | string  | —       | Optional     |

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Upcoming exam entries retrieved successfully",
  "data": {
    "meta": { "page": 1, "limit": 10, "total": 5, "totalPage": 1 },
    "data": [
      {
        "_id": "string",
        "exam_number": 10,
        "exam_name": "Model Test",
        "subject": "Model Test",
        "exam_date_time": "2026-10-12T22:00:00.000+06:00",
        "duration_minutes": 60,
        "total_marks": 100,
        "is_started": false,
        "is_completed": false,
        "is_published": true
      }
    ]
  }
}
```

**Errors:** 401 unauthenticated.

**Client:** Dashboard “Upcoming” card uses `limit=10`; display times in `Asia/Dhaka` 12-hour format; **Start** disabled when `is_started` is `false`.

---

### GET `/exam/user`

Published exams for the signed-in user. Live exams (`is_started` and not completed) are ordered first. Each item includes `isSubmitted`, `isLive`, `is_completed`, and `exam_date_time` in Bangladesh time (`+06:00`).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                                      |
| ------------ | ------- | ------- | ------------------------------------------ |
| `page`       | integer | 1       |                                            |
| `limit`      | integer | 10      | Dashboard Previous card fetches 10, shows 5 |
| `searchTerm` | string  | —       | Optional                                   |
| `isLive`     | boolean | —       | When `true`, only currently live exams     |
| `subject`        | string  | —       | Optional subject filter (e.g. `Model Test`) |
| `excludeSubject` | string  | —       | Optional; omit exams with this exact subject (e.g. `Model Test`) |

**Success (200):** Same paginated envelope as `/exam/upcoming`, with extra fields per item: `isSubmitted`, `isLive`.

**Errors:** 401 unauthenticated.

**Client:** Dashboard “Live” card uses `limit=20`, `isLive=true` (no subject filter); carousel UX; empty copy “No live exam is currently available.”; **Start** placeholder until exam route exists. Dashboard “Previous” card omits `isLive=true`, filters out live rows client-side, keeps completed or past `exam_date_time`, sorts newest first, max **5**; **Practice** button (placeholder until practice route exists). Dashboard “Subjective Model Test” card uses `page=1`, `limit=100`, empty `searchTerm`, `excludeSubject=Model Test`; client filters to previous-style rows (`filterPreviousExams`), carousel max **5**; empty copy “No subjective model tests.”; **Practice** slide (same as Previous).

---

### GET `/exam/user/{exam_number}`

Single exam entry for the signed-in user, including full **`questions[]`** (MCQ options under each question’s `answer.options`). Times use Bangladesh offset (`+06:00`) where applicable.

**Auth:** Required (`Authorization`)

**Path:** `exam_number` — numeric public exam id (e.g. `9008190402216`), not Mongo `_id`.

**Success (200):** `data` is one exam object: metadata (`exam_name`, `subject`, `exam_date_time`, `duration_minutes`, `total_marks`, flags) plus `questions[]` with `title`, optional `mathFormula` (LaTeX), `answerType`, `marks`, `image_url`, and `answer.options`. **`answer.correctAnswer` must not be sent to the browser** — strip server-side before rendering.

**Errors:** 401 unauthenticated; 404 when exam not found for user.

**Client:** Server Component on `/exam/[exam_number]` fetches via `getExamByNumberServer`; exam UI shuffles questions client-side; countdown from `exam_date_time` + `duration_minutes` unless practice (`is_started` and `is_completed` both true).

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

---

## Contract gap (register role)

- Model default role: `student` ([user.model.ts](../../server/src/modules/user/user.model.ts)).
- Create validation enum: vendor/customer roles in [user.enum.ts](../../server/src/modules/user/user.enum.ts) / [user.validate.ts](../../server/src/modules/user/user.validate.ts).

**Action:** Add `student` to server `USER_ROLES` (or accept default without sending `role`) before production register. Client must not send vendor roles.
