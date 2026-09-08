# Access Request Portal — Phase 1 PRD

## Purpose

Build a simple full-stack TypeScript web application as Phase 1 of an Auth0 integration task.

Phase 1 must prove that the base application works without authentication first:

- React frontend
- Node.js backend
- PostgreSQL database
- React Query for frontend server-state management
- Docker support for backend and PostgreSQL
- DBeaver can be used to inspect/manage the PostgreSQL database

Auth0 must **not** be implemented in Phase 1. The app should be structured so Auth0 can be added cleanly in Phase 2.

---

## Project Name

```text
auth0-access-request-portal
```

---

## Product Idea

Build an internal-style **Access Request Portal**.

The app allows users to create and manage requests for access to company tools.

Example tools:

- GitHub
- Azure DevOps
- Confluence
- Jira
- Kodez Connect
- Pulse
- Other

This project is intentionally aligned with identity/access management work so Phase 2 Auth0 integration feels natural.

---

## Phase 1 Scope

### In Scope

Users should be able to:

1. View all access requests
2. Create a new access request
3. Update an existing access request
4. Update request status
5. Delete a request
6. Search requests
7. Filter by status, priority, and application
8. View dashboard summary cards
9. See loading, empty, success, and error states
10. Use a clean responsive UI

Backend should support:

1. REST API endpoints
2. PostgreSQL storage
3. Input validation
4. Clean error handling
5. Health check endpoint
6. Layered folder architecture
7. Environment variables
8. Dockerfile
9. Docker Compose with PostgreSQL

### Out of Scope for Phase 1

Do not implement:

- Auth0
- Login
- Register
- Logout
- JWT validation
- User roles
- Password storage
- Custom authentication
- Refresh tokens
- OAuth flows
- Email sending
- Production deployment

Very important:

```text
Do not build custom username/password authentication.
Auth0 will handle identity in Phase 2.
```

---

## Phase 2 Preview Only

Phase 2 will add Auth0.

Later, the app should support:

- Auth0 registration/login/logout
- Frontend Auth0 React SDK
- Backend JWT access token validation
- Protected API routes
- User-specific access requests
- Auth0 `sub` stored with records

For Phase 1, do not implement this. Only leave the architecture clean enough to add it later.

---

## Required Tech Stack

### Monorepo

```text
Single Git repository with separate frontend and backend folders.
```

### Frontend

```text
React
TypeScript
Vite
Tailwind CSS
TanStack Query / React Query
React Router
Axios
```

### Backend

```text
Node.js
Express.js
TypeScript
PostgreSQL
pg
Zod
cors
helmet
dotenv
pino or morgan
```

### Database

```text
PostgreSQL
DBeaver for inspection
```

### Docker

```text
Dockerfile for backend
docker-compose.yml for PostgreSQL and backend
```

### Package Manager

Use npm unless the user specifically changes this.

---

## Desired Folder Architecture

Follow an organization-style layered structure similar to:

```text
frontend -> api -> services -> database
```

Use these folders:

```text
auth0-access-request-portal/
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
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
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
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── Phase1-PRD.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Frontend Responsibilities

### `src/api/`

Contains Axios client and API functions.

Expected files:

```text
apiClient.ts
accessRequestsApi.ts
```

### `src/queries/`

Contains React Query hooks.

Expected files:

```text
accessRequests.queries.ts
```

Should include:

- `useAccessRequests`
- `useCreateAccessRequest`
- `useUpdateAccessRequest`
- `useDeleteAccessRequest`

### `src/components/`

Reusable UI components.

Expected components:

```text
Layout.tsx
Header.tsx
StatCard.tsx
AccessRequestForm.tsx
AccessRequestTable.tsx
StatusBadge.tsx
PriorityBadge.tsx
FilterBar.tsx
EmptyState.tsx
LoadingState.tsx
ErrorState.tsx
```

### `src/pages/`

Application pages.

Expected pages:

```text
DashboardPage.tsx
NotFoundPage.tsx
```

### `src/routes/`

React Router setup.

Expected file:

```text
AppRoutes.tsx
```

### `src/types/`

Frontend TypeScript types.

Expected file:

```text
accessRequest.types.ts
```

### `src/constants/`

Status, priority, and application constants.

Expected file:

```text
accessRequest.constants.ts
```

---

## Backend Responsibilities

### `src/app.ts`

Express app configuration:

- JSON parsing
- CORS
- Helmet
- request logging
- routes
- not found handler
- error handler

### `src/server.ts`

Starts the server.

### `src/config/env.ts`

Loads and validates environment variables.

### `src/database/pool.ts`

Creates PostgreSQL connection pool.

### `src/database/init.sql`

Optional SQL schema initialization.

### `src/routes/`

REST API route definitions.

Expected files:

```text
health.routes.ts
accessRequest.routes.ts
```

### `src/services/`

Business/database logic.

Expected file:

```text
accessRequest.service.ts
```

### `src/models/`

TypeScript model interfaces.

Expected file:

```text
accessRequest.model.ts
```

### `src/middleware/`

Expected files:

```text
errorHandler.ts
notFound.ts
validateRequest.ts
```

### `src/utils/`

Expected files:

```text
ApiError.ts
```

---

## Database Design

Create a PostgreSQL table called:

```text
access_requests
```

### Columns

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
requester_name VARCHAR(120) NOT NULL,
requester_email VARCHAR(160) NOT NULL,
application_name VARCHAR(80) NOT NULL,
access_level VARCHAR(80) NOT NULL,
business_justification TEXT NOT NULL,
priority VARCHAR(20) NOT NULL DEFAULT 'medium',
status VARCHAR(30) NOT NULL DEFAULT 'pending',
notes TEXT,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

### Allowed Status Values

```text
pending
in_review
approved
rejected
```

### Allowed Priority Values

```text
low
medium
high
urgent
```

### Suggested Application Values

```text
GitHub
Azure DevOps
Confluence
Jira
Kodez Connect
Pulse
Other
```

### Important Phase 2 Auth0 Note

In Phase 2, add:

```sql
auth0_user_id TEXT
```

Do not add it yet unless preparing optional comments/migration notes.

---

## REST API Requirements

Base URL:

```text
http://localhost:4000
```

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "api-access-mgmt"
}
```

### Get Requests

```http
GET /api/access-requests
```

Should support optional query params:

```text
status
priority
application
search
```

Example:

```text
/api/access-requests?status=pending&priority=high&search=github
```

### Create Request

```http
POST /api/access-requests
```

Body:

```json
{
  "requesterName": "Rizni Faiz",
  "requesterEmail": "rizni@example.com",
  "applicationName": "GitHub",
  "accessLevel": "Repository read/write",
  "businessJustification": "Required for development tasks",
  "priority": "high",
  "notes": "Needs access before sprint planning"
}
```

### Update Request

```http
PATCH /api/access-requests/:id
```

Body can include:

```json
{
  "status": "approved",
  "priority": "urgent",
  "notes": "Approved after review"
}
```

### Delete Request

```http
DELETE /api/access-requests/:id
```

Response:

```json
{
  "message": "Access request deleted successfully"
}
```

---

## Validation Rules

Use Zod in the backend.

### Create Request Validation

- requesterName: required, 2–120 characters
- requesterEmail: required, valid email
- applicationName: required
- accessLevel: required, 2–80 characters
- businessJustification: required, 10–1000 characters
- priority: one of `low`, `medium`, `high`, `urgent`
- notes: optional, max 1000 characters

### Update Request Validation

Allow partial update.

If status is provided, must be one of:

```text
pending
in_review
approved
rejected
```

If priority is provided, must be one of:

```text
low
medium
high
urgent
```

---

## UI Requirements

Create a polished, demo-friendly UI.

The UI should look like a modern internal SaaS dashboard.

### Layout

- Left or top navigation
- Clean header
- Dashboard title
- Stat cards
- Request table
- Form modal or form card
- Filter/search bar

### Visual Style

Use Tailwind CSS.

Recommended style:

- professional dark/light neutral theme
- white or near-white background
- blue/indigo accents
- clean cards
- subtle borders
- readable spacing
- badges for status and priority

Do not make it flashy.

### Dashboard Cards

Show:

```text
Total Requests
Pending
In Review
Approved
Rejected
```

### Request Table

Columns:

```text
Requester
Application
Access Level
Priority
Status
Created Date
Actions
```

Actions:

```text
Edit / Update Status
Delete
```

### Form Fields

```text
Requester Name
Requester Email
Application Name
Access Level
Business Justification
Priority
Notes
```

### Loading/Empty/Error States

Must include:

- loading spinner or skeleton
- error message if API fails
- empty state when no requests exist
- success feedback after create/update/delete

---

## React Query Requirements

Use TanStack Query for all server state.

Required:

- Query provider in app root
- `useQuery` for fetching access requests
- `useMutation` for create/update/delete
- invalidate/refetch access request list after mutations
- display loading/error states from queries

Do not use plain `useEffect` for main data fetching.

---

## Environment Variables

### Backend `.env.example`

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/access_portal
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:4000
```

Do not commit real `.env` files.

---

## Docker Requirements

### Backend Dockerfile

Create:

```text
api-access-mgmt/Dockerfile
```

It should:

- use Node 20 Alpine or similar
- install dependencies
- build TypeScript
- expose port 4000
- run compiled server

### Docker Compose

Create root-level:

```text
docker-compose.yml
```

Should include:

- postgres service
- backend service
- database volume
- ports:
  - PostgreSQL: 5432
  - backend: 4000

Frontend can be run locally with npm during Phase 1.

Optional: include frontend later if needed.

---

## DBeaver Setup Requirements

The user will inspect PostgreSQL using DBeaver.

Expected database connection:

```text
Host: localhost
Port: 5432
Database: access_portal
Username: postgres
Password: postgres
```

DBeaver should be used to confirm:

- database exists
- `access_requests` table exists
- records are inserted after using the app
- records update/delete correctly

---

## Development Commands

### Root

Optional if using npm workspaces. If not using workspaces, keep separate commands in each folder.

### Backend

```bash
cd api-access-mgmt
npm install
npm run dev
npm run build
npm start
```

### Frontend

```bash
cd ui-web
npm install
npm run dev
npm run build
```

### Docker

From root:

```bash
docker compose up -d postgres
```

Then run backend locally if preferred.

Or:

```bash
docker compose up --build
```

---

## README Requirements

Create a root README with:

1. Project overview
2. Phase 1 scope
3. Tech stack
4. Folder structure
5. Prerequisites
6. Environment setup
7. Database setup
8. How to run with Docker
9. How to run frontend/backend locally
10. API endpoints
11. DBeaver connection info
12. Phase 2 Auth0 plan
13. Known limitations

---

## Commit Checkpoints

Commit regularly.

Suggested commits:

```text
chore: initialize monorepo structure
chore: scaffold backend with express and typescript
feat: add postgres connection and access request schema
feat: implement access request api endpoints
chore: add backend dockerfile and compose setup
chore: scaffold react frontend with vite and typescript
feat: add access request dashboard ui
feat: connect frontend to backend with react query
docs: add setup instructions and phase two auth plan
```

---

## Definition of Done for Phase 1

Phase 1 is complete when:

- frontend runs locally
- backend runs locally
- PostgreSQL runs locally through Docker or local service
- DBeaver can connect to database
- user can create an access request from UI
- request is saved in PostgreSQL
- request list displays records from backend
- user can update request status
- user can delete request
- search/filter works
- dashboard stat cards update based on data
- backend has validation and error handling
- backend Dockerfile exists and builds
- README has clear setup instructions
- no Auth0 implementation exists yet
- code is committed to GitHub repo

---

## Constraints for GitHub Copilot

When implementing this project, follow these rules:

1. Do not implement Auth0 in Phase 1.
2. Do not create custom username/password authentication.
3. Do not hardcode secrets.
4. Do not commit `.env` files.
5. Use `.env.example` files.
6. Use TypeScript strictly where practical.
7. Keep frontend and backend separate.
8. Use React Query for server-state fetching and mutations.
9. Use PostgreSQL, not localStorage or mock data as final state.
10. Use a clean layered backend architecture: routes -> services -> database.
11. Use a clean frontend architecture: pages -> components -> queries -> api.
12. Build a polished but simple UI suitable for demo.
13. Keep the app small enough to explain clearly.
14. Add useful comments only where logic is not obvious.
15. Write code that can be extended with Auth0 later.

---

## Recommended Copilot Prompt

Paste this into Copilot after uploading this PRD:

```text
Read the PRD carefully and build Phase 1 only.

Create a monorepo named auth0-access-request-portal with two folders: ui-web and api-access-mgmt.

Implement a full-stack Access Request Portal using React + TypeScript + Vite + Tailwind + TanStack Query for the frontend, and Node.js + Express + TypeScript + PostgreSQL + Zod for the backend.

Do not implement Auth0 yet. Do not create custom authentication. Structure the app so Auth0 can be added in Phase 2.

Use the folder architecture, API endpoints, database schema, validation rules, Docker requirements, and README requirements from this PRD.

Before editing files, create an implementation plan. Then scaffold the project step by step. Commit points will be handled manually after each major milestone.
```

---

## Phase 2 Auth0 Notes for Later

Do not implement yet.

When Phase 2 starts:

Frontend:

- install Auth0 React SDK
- configure Auth0 provider
- add login/logout/register buttons
- protect dashboard
- get access token silently
- send token with API calls

Backend:

- install Auth0 JWT middleware
- configure issuer base URL and audience
- protect `/api/access-requests`
- read Auth0 subject from token
- associate requests with user

Database:

- add `auth0_user_id TEXT NOT NULL`
- make queries filter by Auth0 user ID

Potential Phase 2 features:

- Admin role can see all requests
- Regular user can see own requests
- Role-based approval flow
- Auth0 RBAC permissions
