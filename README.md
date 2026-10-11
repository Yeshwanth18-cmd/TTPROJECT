# UpLift Frontend

React + Vite + TypeScript starter for the UpLift service marketplace.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Environment

Copy `.env.example` to `.env` when the backend is ready.

The current UI can run independently. Backend/API integration is isolated in `src/services/api.ts`.

## Marketplace MVP

- Authentication and role-aware client/freelancer/admin dashboards
- Live project listing, search, and project creation
- Freelancer proposal submission and personal proposal tracking
- Client proposal inbox with accept/reject actions
- Project cancellation and completion

AI features, milestones, reviews, chat, and payments are not part of the
current MVP. Configure `VITE_API_URL` to point at the backend API base URL
(defaults to `http://localhost:8080/api`).
