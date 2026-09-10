# Access Request Portal — Phase 2 PRD (Auth0 Integration)

## Purpose

Phase 1 delivered a working, unauthenticated full-stack Access Request Portal:

- `ui-web` — React + Vite + TypeScript + Tailwind + TanStack Query + React Router + Axios
- `api-access-mgmt` — Node.js + Express + TypeScript + PostgreSQL (`pg`) + Zod + helmet + cors + pino
- PostgreSQL 16 in Docker (`docker-compose.yml`), inspected with DBeaver

Phase 2 adds **Auth0** so that:

1. Users can **register, log in and log out** from the frontend using Auth0 Universal Login.
2. The backend API is **protected** — every `/api/access-requests` call must carry a valid Auth0 access token (JWT).
3. Every access request is **owned by the logged-in user** (`auth0_user_id` = Auth0 `sub` claim). Users only see and manage their own requests.

**Do not build any custom username/password authentication. Auth0 is the identity provider.**

---

## Auth0 tenant configuration (ALREADY DONE — do not recreate)

| Item | Value |
|---|---|
| Tenant | `kodez-access-portal` (region AU) |
| Domain | `kodez-access-portal.au.auth0.com` |
| Custom API | name `Access Portal API`, audience `https://api.access-portal.local`, RS256 |
| Application: `Access Portal Web` | type **Single Page Application** — used by `ui-web` |
| Application: `Access Portal API` | type **Regular Web Application** — represents `api-access-mgmt` (confidential client; client access granted to the API) |
| Allowed Callback / Logout / Web Origins for `Access Portal Web` | `http://localhost:5173` |
| Database connection | `Username-Password-Authentication`, sign-ups enabled |

Auth flow used: **Authorization Code + PKCE** (handled by `@auth0/auth0-react`). The SPA obtains an access token *for the audience* `https://api.access-portal.local` and sends it as `Authorization: Bearer <token>`. The backend validates the JWT's signature (JWKS), issuer and audience.

---

## Environment variables

### `api-access-mgmt/.env.example` (add these — keep existing ones)

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/access_portal
CORS_ORIGIN=http://localhost:5173

# Auth0 (Phase 2)
AUTH0_DOMAIN=kodez-access-portal.au.auth0.com
AUTH0_AUDIENCE=https://api.access-portal.local
# Credentials of the "Access Portal API" Regular Web Application.
# Not required for JWT validation; reserved for future machine-to-machine / Management API calls.
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

### `ui-web/.env.example` (add these)

```env
VITE_API_BASE_URL=http://localhost:4000

# Auth0 (Phase 2) — public values, safe in the browser
VITE_AUTH0_DOMAIN=kodez-access-portal.au.auth0.com
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=https://api.access-portal.local
```

Rules:
- Real values go in `.env` files, which are git-ignored. Never commit `.env`.
- `AUTH0_CLIENT_SECRET` must never appear in frontend code, logs, README or commits.
- Validate all new variables in `api-access-mgmt/src/config/env.ts` (Zod) and `ui-web/src/configs/env.ts`.

---

## Backend requirements (`api-access-mgmt`)

### Dependencies

```
npm install express-oauth2-jwt-bearer
```

### New / changed files

```
src/config/env.ts                 add AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH0_CLIENT_ID (optional), AUTH0_CLIENT_SECRET (optional)
src/middleware/checkJwt.ts        NEW — exports `checkJwt` built with auth({ audience, issuerBaseURL, tokenSigningAlg: 'RS256' })
src/middleware/attachUser.ts      NEW — reads req.auth.payload.sub, sets req.user = { auth0UserId } ; 401 if missing
src/types/express.d.ts            NEW — module augmentation: Express.Request gets `user?: { auth0UserId: string }`
src/middleware/errorHandler.ts    handle errors from express-oauth2-jwt-bearer (they carry `status` 401/403) → JSON { message }
src/routes/accessRequest.routes.ts  apply `checkJwt, attachUser` to the whole router
src/services/accessRequest.service.ts  every query scoped by auth0_user_id
src/models/accessRequest.model.ts   add auth0UserId to the model; create schema no longer accepts it from the client
src/database/init.sql               add auth0_user_id column + index (see Database)
```

### Middleware

```ts
// src/middleware/checkJwt.ts
import { auth } from 'express-oauth2-jwt-bearer';
import { env } from '../config/env';

export const checkJwt = auth({
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});
```

`attachUser` runs after `checkJwt`, reads `req.auth?.payload.sub`, and throws `ApiError(401, 'Unauthorized')` if absent.

### Route protection

| Route | Auth |
|---|---|
| `GET /health` | public |
| `GET /api/access-requests` | protected — returns only the caller's requests |
| `POST /api/access-requests` | protected — `auth0_user_id` set from token, never from body |
| `PATCH /api/access-requests/:id` | protected — only if the row belongs to the caller, else 404 |
| `DELETE /api/access-requests/:id` | protected — only if the row belongs to the caller, else 404 |

Return **404** (not 403) for rows owned by other users so the API does not leak existence of other users' data.

### Error responses

| Situation | Status | Body |
|---|---|---|
| Missing / malformed / expired token | 401 | `{ "message": "Unauthorized" }` |
| Token valid but wrong audience/issuer | 401 | `{ "message": "Unauthorized" }` |
| Insufficient permissions (future RBAC) | 403 | `{ "message": "Forbidden" }` |

Log auth failures at `warn` level without logging the token itself.

### Requester identity

The access token does not contain `email`/`name` by default. For Phase 2:
- Frontend sends `requesterName` and `requesterEmail` taken from the Auth0 user profile (read-only in the UI).
- Backend still validates them with Zod, and always stores `auth0_user_id` from the token.
- (Optional stretch, not required: an Auth0 Action that adds `email` as a custom claim to the access token so the backend can ignore body values.)

### CORS

`CORS_ORIGIN` unchanged (`http://localhost:5173`). Ensure the `Authorization` header is allowed (default in `cors` when no `allowedHeaders` are set; if `allowedHeaders` is set, include `Authorization`).

---

## Database requirements

Phase 1 rows are demo data. Before running Phase 2, clear the table in DBeaver:

```sql
DELETE FROM access_requests;
```

Update `src/database/init.sql` so it is idempotent on existing databases:

```sql
ALTER TABLE access_requests
  ADD COLUMN IF NOT EXISTS auth0_user_id TEXT;

CREATE INDEX IF NOT EXISTS idx_access_requests_auth0_user_id
  ON access_requests (auth0_user_id);
```

Also include `auth0_user_id TEXT NOT NULL` in the `CREATE TABLE IF NOT EXISTS` block for fresh databases. Because `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` cannot add a NOT NULL column to a table that already has rows without a default, the table must be emptied first (see above) and the service must always write the value.

All service queries:

```sql
-- list (with existing status / priority / application / search filters)
WHERE auth0_user_id = $1 AND ...
-- update / delete
WHERE id = $1 AND auth0_user_id = $2
```

---

## Frontend requirements (`ui-web`)

### Dependencies

```
npm install @auth0/auth0-react
```

### New / changed files

```
src/configs/env.ts                    add VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE (fail fast if missing)
src/auth/AuthProvider.tsx             NEW — wraps Auth0Provider with domain, clientId, authorizationParams { redirect_uri: window.location.origin, audience, scope: 'openid profile email' }, cacheLocation 'memory' (default), useRefreshTokens: true
src/auth/ProtectedRoute.tsx           NEW — uses withAuthenticationRequired (or isAuthenticated/isLoading) to guard the dashboard; shows LoadingState while checking
src/auth/useAuthToken.ts              NEW — hook returning getAccessTokenSilently bound to the audience
src/api/apiClient.ts                  add a request interceptor that attaches `Authorization: Bearer <token>`; token getter is registered by AuthProvider (setAccessTokenGetter) so the Axios module stays framework-agnostic; on 401 surface a clear error
src/components/LoginButton.tsx        NEW — loginWithRedirect()
src/components/SignupButton.tsx       NEW — loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
src/components/LogoutButton.tsx       NEW — logout({ logoutParams: { returnTo: window.location.origin } })
src/components/UserMenu.tsx           NEW — avatar (user.picture), name, email, Logout
src/components/Header.tsx             show LoginButton/SignupButton when logged out, UserMenu when logged in
src/pages/LandingPage.tsx             NEW — public page at "/" for unauthenticated users: short product description + Log in / Sign up buttons
src/pages/DashboardPage.tsx           protected at "/dashboard"; requester name/email pre-filled from `user` and read-only in the form
src/components/AccessRequestForm.tsx  Requester Name / Email fields become read-only, pre-filled from Auth0 profile
src/routes/AppRoutes.tsx              "/" → LandingPage (redirect to /dashboard if already authenticated), "/dashboard" → ProtectedRoute(DashboardPage), "*" → NotFoundPage
src/main.tsx                          wrap app: BrowserRouter > AuthProvider > QueryClientProvider > AppRoutes
```

### Behaviour

- Logged-out user visiting `/dashboard` is redirected to Auth0 login and returned to `/dashboard` afterwards (use `appState.returnTo` + `onRedirectCallback`).
- After login, the dashboard shows only that user's requests; stat cards reflect that user's data.
- React Query: `queryKey` for the list should include the user id (`['access-requests', auth0UserId, filters]`) so caches never mix between users; call `queryClient.clear()` on logout.
- Loading state while Auth0 is initialising (`isLoading`) — no flash of the landing page for logged-in users.
- If the API returns 401, show ErrorState with a "Log in again" action.
- Keep Phase 1 visual style. Add a small "Signed in as …" indicator in the header.

### Do NOT

- Do not store tokens in `localStorage`.
- Do not put `AUTH0_CLIENT_SECRET` anywhere in `ui-web`.
- Do not call the Auth0 Management API from the browser.
- Do not build custom login/register forms — Universal Login only.

---

## Docker

`docker-compose.yml` backend service: pass `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` via `env_file: ./api-access-mgmt/.env` (or `environment:` referencing `${...}`). Do not hardcode values in compose.

---

## README additions

- Phase 2 overview and auth flow diagram (SPA → Auth0 → token → API)
- Auth0 setup summary (tenant, API audience, two applications, callback URLs) — no secrets
- New environment variables for both apps
- How to create a test user (Sign up from the landing page)
- Updated demo flow (see below)
- Security notes: PKCE, RS256/JWKS validation, per-user data isolation, 404 on foreign rows
- Phase 3 ideas: admin role via Auth0 RBAC (approve/reject all requests), custom email claim via Auth0 Action, Google social login

---

## Commit checkpoints

```
feat: add auth0 jwt validation to api
feat: scope access requests to auth0 user
feat: add auth0 login and protected dashboard
docs: add auth0 setup and phase two notes
```

---

## Definition of Done — Phase 2

- [ ] Unauthenticated `curl http://localhost:4000/api/access-requests` returns **401**
- [ ] `GET /health` still returns 200 without a token
- [ ] Landing page shows Log in / Sign up; both open Auth0 Universal Login
- [ ] New user can **sign up**, is returned to `/dashboard`, sees an empty dashboard
- [ ] Creating a request stores `auth0_user_id` (visible in DBeaver) equal to the user's `sub`
- [ ] A **second** user (sign up in a private window) sees **none** of the first user's requests
- [ ] Update / delete only work on own requests; foreign ids return 404
- [ ] Logout returns to landing page; dashboard is no longer accessible without login
- [ ] No secrets committed; `.env.example` files updated
- [ ] Backend and frontend builds pass; Docker compose still starts backend + Postgres
- [ ] README updated; all checkpoints committed and pushed

---

## Constraints for GitHub Copilot

1. Implement **only** what this PRD describes. Do not add roles/RBAC, organisations, social logins or Management API calls.
2. Do not create custom authentication of any kind.
3. Do not modify Phase 1 architecture beyond what is needed (routes → services → database; pages → components → queries → api).
4. Do not hardcode Auth0 values — read them from environment variables.
5. Do not commit `.env`. Do not read or print `.env` contents.
6. Before editing files, present a short implementation plan and wait.
7. Work checkpoint by checkpoint; stop after each checkpoint and summarise the files changed.
