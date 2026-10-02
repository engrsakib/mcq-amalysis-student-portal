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

### GET `/search`

Global search across exams, books, YouTube, study plans, and guidelines.

**Auth:** Required (`Authorization`)

**Query:**

| Param   | Type    | Default | Notes        |
| ------- | ------- | ------- | ------------ |
| `q`     | string  | —       | Required     |
| `page`  | integer | 1       | Per group    |
| `limit` | integer | 10      | Per group    |

**Success (200):** `data.query`, `data.results` with `exams`, `books`, `youtube`, `studyPlans`, `guidelines` — each `{ meta, data[] }` (same item shapes as user catalog endpoints where applicable).

**Errors:** 401 unauthenticated.

**Client:** Header search modal via [`getGlobalSearch`](lib/api/search.ts), [`GlobalSearchModal`](components/search/global-search-modal.tsx).

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

**Client ([`/settings`](app/(app)/settings/page.tsx)):** Profile photo is uploaded to Cloudinary (unsigned preset), then `image` is set to the returned `secure_url` and saved via [`updateUserProfile`](lib/api/user.ts).

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

### Client: Cloudinary (unsigned profile upload)

Not an Express route. The student web app uploads directly from the browser.

**Env:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (unsigned preset in Cloudinary dashboard).

**Upload:** `POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` — `FormData` fields `file`, `upload_preset`.

**Response:** Use `secure_url` as `image` on PATCH `/user/self`.

**Client:** [`uploadProfileImage`](lib/cloudinary/upload-image.ts), [`ProfileImageField`](components/settings/profile-image-field.tsx).

---

### GET `/user/personal-growth`

Daily performance time series and summary for the signed-in user.

**Auth:** Required (`Authorization`)

**Query:**

| Param   | Type   | Default | Notes                          |
| ------- | ------ | ------- | ------------------------------ |
| `range` | string | —       | Dashboard uses `last30`        |

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Personal growth retrieved successfully",
  "data": {
    "timeSeries": [
      {
        "date": "2026-09-18",
        "avgScore": 0.44,
        "attempts": 8,
        "avgCorrectRate": 0.0388,
        "avgTotalScore": 77.5
      }
    ],
    "summary": {
      "averageScore": 0.72,
      "totalAttempts": 15,
      "averageCorrectRate": 0.0573,
      "professionalGrade": 1
    }
  }
}
```

**Errors:** 401 unauthenticated.

**Client:** Dashboard **Personal growth** card calls `range=last30`, sorts `timeSeries` by `date`, and charts the **last 3** days (`attempts` bars + `avgTotalScore` line). KPI row uses aggregates from those 3 days; `professionalGrade` comes from API `summary`.

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

**Client:** Dashboard “Live” card uses `limit=20`, `isLive=true` (no subject filter); carousel UX; empty copy “No live exam is currently available.”; **Start** opens exam briefing → `/exam/{exam_number}`. Dashboard “Previous” card omits `isLive=true`, filters out live rows client-side, keeps completed or past `exam_date_time`, sorts newest first, max **5**; **Practice** via briefing. Dashboard “Subjective Model Test” card uses `page=1`, `limit=100`, empty `searchTerm`, `excludeSubject=Model Test`; client filters to previous-style rows (`filterPreviousExams`), carousel max **5**. **`/exam` page:** top **Live** strip uses `isLive=true`, `limit=20`; below, tabbed **Previous** (default) and **Subjective** lists use `page`, `limit=12`, optional `searchTerm`, subjective tab adds `excludeSubject=Model Test`; client filters each page with `isPreviousExam`; mobile-first grid (1 / 2 / 4 columns), search debounced, pagination from `meta.page` / `meta.totalPage`; optional `?tab=subjective` on the exams route.

---

### GET `/exam-routine/user`

Exam routine documents for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                                |
| ------------ | ------- | ------- | ------------------------------------ |
| `page`       | integer | 1       |                                      |
| `limit`      | integer | 10      | Dashboard Exam routine section uses 5 |
| `searchTerm` | string  | —       | Optional; client may send `""`       |

**Success (200):** `data.meta` plus `data.data[]` with `exam_routine_number`, `title`, `description`, `status`, `thumbnail_url`, `exam_routine_url`, `category`, `post_date`, `position`, timestamps.

**Errors:** 401 unauthenticated.

**Client:** Dashboard **Exam routine** card beside **Books** (`lg:grid-cols-2`) — `page=1`, `limit=5`, `searchTerm=`; client keeps `status === "active"`; carousel auto-advance 2s; **Open routine** opens `exam_routine_url` in a new tab.

---

### GET `/books/user`

Published book catalog entries for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                          |
| ------------ | ------- | ------- | ------------------------------ |
| `page`       | integer | 1       |                                |
| `limit`      | integer | 10      | Dashboard Books section uses 5 |
| `searchTerm` | string  | —       | Optional; client may send `""` |

**Success (200):** `data.meta` plus `data.data[]` with `book_number`, `title`, `thumbnail_url`, `description`, `is_published`, `price`, `sold_platform`, `buy_url`, `position`, timestamps.

**Errors:** 401 unauthenticated.

**Client:** Dashboard **Books** carousel above Youtube — `page=1`, `limit=5`, `searchTerm=`; 1 / 2 / 3 cards visible by breakpoint; auto-advance every 3s; **Buy now** opens `buy_url` in a new tab; thumbnail fallback `/exam.avif`.

---

### GET `/study-plan/user`

Study plans for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                             |
| ------------ | ------- | ------- | --------------------------------- |
| `page`       | integer | 1       |                                   |
| `limit`      | integer | 10      | Dashboard Study plan card uses 5  |
| `searchTerm` | string  | —       | Optional; client may send `""`  |

**Success (200):** `data.meta` plus `data.data[]` items with `study_plan_number`, `title`, `description`, `status`, `thumbnail_url`, `study_plan_url`, `category`, `position`, timestamps.

**Errors:** 401 unauthenticated.

**Client:** Dashboard **Study plan** carousel (beside Personal growth) — `page=1`, `limit=5`, client keeps `status === "active"`; swipe carousel without auto-rotate; thumbnail fallback `/exam.avif`; **Open study plan** opens `study_plan_url` in a new tab.

---

### GET `/youtube/user`

Published YouTube entries for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                          |
| ------------ | ------- | ------- | ------------------------------ |
| `page`       | integer | 1       |                                |
| `limit`      | integer | 10      | Dashboard Youtube card uses 5  |
| `searchTerm` | string  | —       | Optional; client may send `""` |

**Success (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "YouTube entries retrieved successfully",
  "data": {
    "meta": { "page": 1, "limit": 5, "total": 8, "totalPage": 2 },
    "data": [
      {
        "_id": "…",
        "video_number": 9003442050863,
        "title": "…",
        "thumbnail_url": "",
        "video_url": "https://youtu.be/…",
        "description": "",
        "is_published": true,
        "position": 0
      }
    ]
  }
}
```

**Errors:** 401 unauthenticated.

**Client:** Dashboard **Youtube** section below “My recent results” — `page=1`, `limit=5`; thumbnails from `thumbnail_url` or YouTube CDN via parsed `video_url`; carousel auto-advances every 4s until user plays a video (iframe embed pauses rotation).

---

### GET `/exam-solution/user`

Exam / model test solution documents for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes                                      |
| ------------ | ------- | ------- | ------------------------------------------ |
| `page`       | integer | 1       |                                            |
| `limit`      | integer | 10      | Learning Materials catalog uses 20         |
| `searchTerm` | string  | —       | Optional; client may send `""`             |

**Success (200):** `data.meta` plus `data.data[]` with `title`, `description`, `status`, `thumbnail_url`, external URL (`exam_solution_url` or `solution_url`), optional `category`, `position`, timestamps.

**Errors:** 401 unauthenticated.

---

### Learning Materials page (`/learning-materials`)

**Client:** Mobile-first **FolderTabs** (study plan → Youtube → model test solution → guideline); optional `?tab=youtube` | `model-test` | `guideline` (default study plan omits `tab`). Each data tab uses the shared **paginated catalog** UX (debounced search, card/list toggle, grid, `PaginationBar`).

| Tab | Source | Catalog `limit` |
| --- | --- | --- |
| Study plan | `GET /study-plan/user` | 20 |
| Youtube | `GET /youtube/user` | 100 |
| Model test solution | `GET /exam-solution/user` | 20 |
| Guideline | — | Placeholder empty state until a guideline API exists |

Dashboard carousels unchanged (`limit=5` on `/`).

---

### GET `/activity/me`

Activity audit log for the signed-in user (paginated).

**Auth:** Required (`Authorization`)

**Query:**

| Param        | Type    | Default | Notes |
| ------------ | ------- | ------- | ----- |
| `page`       | integer | 1       | `/activity` uses 20 |
| `limit`      | integer | 10      | `/activity` uses 20 |
| `searchTerm` | string  | —       | Optional; client may send `""` |
| `dateFrom`   | string  | —       | Optional `YYYY-MM-DD` |
| `dateTo`     | string  | —       | Optional `YYYY-MM-DD` |
| `action`     | string  | —       | Optional: `exam_started`, `exam_submitted`, `offline_submit`, `cheated_submit`, `proctoring`; omit for all |

**Success (200):** `data.data[]` with `action`, `title`, `description`, `severity`, optional `examNumber`, `createdAt`, etc.; `data.meta` includes `page`, `limit`, `total`, and `totalPages` (client maps to `totalPage`).

**Errors:** 401 unauthenticated.

**Client:** [`/activity`](app/(app)/activity/page.tsx) — date range + action filter, timeline list; cheat/proctoring/non-normal severity styled with danger tokens; pagination via `PaginationBar`.

---

### GET `/exam/user/{exam_number}`

Single exam entry for the signed-in user, including full **`questions[]`** (MCQ options under each question’s `answer.options`). Times use Bangladesh offset (`+06:00`) where applicable.

**Auth:** Required (`Authorization`)

**Path:** `exam_number` — numeric public exam id (e.g. `9008190402216`), not Mongo `_id`.

**Success (200):** `data` is one exam object: metadata (`exam_name`, `subject`, `exam_date_time`, `duration_minutes`, `total_marks`, flags) plus `questions[]` with `title`, optional `mathFormula` (LaTeX), `answerType`, `marks`, `image_url`, and `answer.options`. **`answer.correctAnswer` must not appear in question UI during the attempt** — the student web app maps it into a grading-only structure for submit/review ([`gradingByQuestionId`](lib/exam/sanitize-questions.ts)), not rendered on [`ExamQuestionCard`](components/exam/exam-question-card.tsx).

**Errors:** 401 unauthenticated; 404 when exam not found for user.

**Client:** Server Component on `/exam/[exam_number]` fetches via `getExamByNumberServer`; exam UI shuffles questions client-side; countdown from `exam_date_time` + `duration_minutes` unless practice (`is_started` and `is_completed` both true).

---

### POST `/results/proctoring-event`

Record a proctoring violation signal while a **live** exam is in progress (tab switch, minimize, app background, or confirmed leave attempt).

**Auth:** Required (`Authorization`)

**Body (JSON):**

| Field         | Type   | Required | Notes                                      |
| ------------- | ------ | -------- | ------------------------------------------ |
| `eventType`   | string | yes      | e.g. `app_background`                      |
| `exam_number` | number | yes      | Public exam id (same as GET `/exam/user/{exam_number}`) |
| `occurredAt`  | string | yes      | ISO-8601 UTC (e.g. `2026-10-02T03:57:52.891Z`) |

**Success (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Proctoring event recorded",
  "data": {
    "exam_number": 9000821371595,
    "eventType": "app_background",
    "occurredAt": "2026-10-02T03:57:52.891Z",
    "endedAt": null
  }
}
```

**Errors:** 401 unauthenticated; 4xx validation as implemented server-side.

**Client:** [`lib/api/proctoring.ts`](../lib/api/proctoring.ts) via `postProctoringEvent` (uses `fetch` **`keepalive: true`** on tab hide so the request is not cancelled). Wired from [`hooks/use-exam-proctoring.ts`](../hooks/use-exam-proctoring.ts) for every exam session route (`/exam/[exam_number]`). Events with `at` / `endedAt` are also stored in `localStorage` for final submit. Backend applies cheat / violation rules (e.g. away &gt; 15s).

---

### GET `/results/{exam_number}/leaderboard`

Paginated leaderboard for an exam, including the signed-in user’s rank.

**Auth:** Required (`Authorization`)

**Path:** `exam_number` — public exam id.

**Query:**

| Param   | Type    | Default | Notes |
| ------- | ------- | ------- | ----- |
| `page`  | integer | 1       | `/results` uses 10 |
| `limit` | integer | 10      | |

**Success (200):** `data.meta`, `data.current_user` (`rank` as number or `"Cheater"`, `student_name`, `student_phone`, `exam_number`, `score`, `is_cheated`, `is_on_time`, …) or `null` when the signed-in user did not take the exam, `data.data[]` ranked entries.

**Errors:** 401 unauthenticated.

**Client:** [`/results`](app/(app)/results/page.tsx) — exam select from `GET /exam/user`; podium (top 3), your rank, paginated participant list via [`getExamLeaderboard`](lib/api/leaderboard.ts).

---

### POST `/results/`

Submit a completed exam attempt (MCQ scoring summary + proctoring log).

**Auth:** Required (`Authorization`)

**Body (JSON):** `clientSubmittedAt`, `exam_number`, `sessionStartedAt`, `student_name`, `student_phone`, `totalQuestions`, `total_score`, `score`, `correctAnswers`, `wrongAnswers`, `unanswered`, `is_cheated`, `is_on_time`, `proctoringEvents` (array of `{ type: "app_background", at, endedAt }`), `writtenExam` (often `[]` for MCQ-only).

**Success (201):** `data` includes submitted scores, flags, `dateTaken`, and result `_id`.

**Client:** [`lib/api/results.ts`](../lib/api/results.ts) via `submitExamResult`; scoring in [`lib/exam/compute-exam-score.ts`](../lib/exam/compute-exam-score.ts). Grading keys from GET exam response are kept in a client-only map (not shown during the attempt); see [`lib/exam/sanitize-questions.ts`](../lib/exam/sanitize-questions.ts).

---

### POST `/user/logout`

Log out the signed-in user.

**Auth:** Required (`Authorization`)

**Body:** none (client sends `{}`)

**Success (200):** Logged out.

**Client:** [`LogoutButton`](components/home/logout-button.tsx) calls `logoutUser()` then clears auth cookies and redirects to login. Sidebar [`SidebarUserFooter`](components/dashboard/sidebar-user-footer.tsx) shows full-width destructive **Log out** when the account panel is expanded.

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
