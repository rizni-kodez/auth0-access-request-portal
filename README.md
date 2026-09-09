# auth0-access-request-portal

Access Request Portal is a TypeScript monorepo that contains:

- `ui-web`: React dashboard for creating and managing access requests.
- `api-access-mgmt`: Express API with PostgreSQL persistence.

This repository currently implements **Phase 1** only (no authentication).

## Project Overview

The app provides an internal-style dashboard to manage requests for access to company tools like GitHub, Jira, Confluence, and others.

Users can:

- View all requests
- Create new requests
- Edit request details and status
- Delete requests
- Search/filter requests
- See summary cards by status

## Phase 1 Scope

Implemented in this phase:

- Full frontend and backend structure in one monorepo
- REST API for access request CRUD
- PostgreSQL storage
- Validation and error handling on backend
- React Query for server-state management on frontend
- Docker Compose setup for PostgreSQL and backend API

Explicitly not implemented in Phase 1:

- Auth0 integration
- Login/register/logout
- Custom username/password authentication
- JWT/role-based authorization

## Tech Stack

Frontend (`ui-web`):

- React + Vite
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- React Router
- Axios

Backend (`api-access-mgmt`):

- Node.js + Express
- TypeScript
- PostgreSQL + `pg`
- Zod
- `cors`, `helmet`, `dotenv`
- `pino` + `pino-http` request logging

Infrastructure:

- Docker + Docker Compose
- PostgreSQL 16 (container)

## Folder Structure

```text
auth0-access-request-portal/
├── api-access-mgmt/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── ui-web/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── configs/
│   │   ├── constants/
│   │   ├── pages/
│   │   ├── queries/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── Access_Request_Portal_Phase1_PRD.md
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop
- DBeaver (optional, for DB inspection)

## Environment Variables

Do not commit real `.env` files. Use `.env.example` as templates.

Backend example (`api-access-mgmt/.env.example`):

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/access_portal
CORS_ORIGIN=http://localhost:5173
```

Frontend example (`ui-web/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:4000
```

Suggested local setup:

1. Copy each `.env.example` to `.env` in its own folder.
2. Keep secrets local only.

## Docker and PostgreSQL Setup

Root `docker-compose.yml` runs:

1. `postgres`
2. `api-access-mgmt`

PostgreSQL container config:

- Database: `access_portal`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

API container config:

- Port: `4000`
- Uses `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/access_portal`

Start both services:

```bash
docker compose up --build
```

Start only PostgreSQL:

```bash
docker compose up -d postgres
```

Stop services:

```bash
docker compose down
```

Database schema is auto-initialized on backend start using:

- `api-access-mgmt/src/database/init.sql`

This SQL creates the `access_requests` table and related constraints/trigger.

## DBeaver Connection Details

Use these values:

- Host: `localhost`
- Port: `5432`
- Database: `access_portal`
- Username: `postgres`
- Password: `postgres`

After running the app, confirm:

- `access_requests` table exists
- Insert/update/delete actions are persisted

## Backend Commands

From repository root (workspace scripts):

```bash
npm run dev:api
```

Directly in backend folder:

```bash
cd api-access-mgmt
npm install
npm run dev
npm run build
npm start
```

## Frontend Commands

From repository root (workspace scripts):

```bash
npm run dev:ui
```

Directly in frontend folder:

```bash
cd ui-web
npm install
npm run dev
npm run build
npm run preview
```

Frontend URL (default):

- `http://localhost:5173`

Backend URL (default):

- `http://localhost:4000`

## API Endpoints

Base URL:

- `http://localhost:4000`

Health:

- `GET /health`

Access Requests:

- `GET /api/access-requests`
- `POST /api/access-requests`
- `PATCH /api/access-requests/:id`
- `DELETE /api/access-requests/:id`

Supported query params for list endpoint:

- `status`
- `priority`
- `application`
- `search`

Example:

```http
GET /api/access-requests?status=pending&priority=high&search=github
```

## Demo Flow

1. Start PostgreSQL and backend (Docker Compose) or run backend locally.
2. Start frontend in `ui-web`.
3. Open `http://localhost:5173`.
4. Create a new access request from the dashboard.
5. Verify request appears in table and summary cards update.
6. Use search/filter bar to narrow results.
7. Edit request status/priority/details.
8. Delete a request.
9. Verify DB records in DBeaver.

## Known Limitations

- No authentication or authorization in Phase 1.
- No user-specific ownership model yet.
- No pagination/sorting controls yet.
- No automated test suite included yet.
- UI notifications are lightweight and not persisted.

## Phase 2 Auth0 Plan (Preview)

Phase 2 will add Auth0 without replacing core Phase 1 architecture:

1. Frontend login/logout/register through Auth0 React SDK.
2. Backend JWT validation middleware for protected routes.
3. Route protection and user-aware request access.
4. Store Auth0 user identifier (`sub`) with each access request.
5. Restrict request visibility and actions by authenticated user/role rules.

Phase 1 intentionally excludes all Auth0 and custom credential flows.
