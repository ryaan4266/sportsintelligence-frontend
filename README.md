# Athena Sports Intelligence Frontend

Athena Sports Intelligence is a React frontend for exploring basketball teams, players, games, live updates, analytics, and authenticated account access.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Installation

Install dependencies:

```bash
npm install
```

## Running Locally

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed.

```bash
VITE_API_BASE_URL=http://localhost:8000
```

`VITE_API_BASE_URL` is used by the reusable Axios client in `src/api/client.ts`. URLs are not hardcoded in the application.

## Folder Structure

```text
src/
├── api/
│   ├── auth.ts
│   ├── client.ts
│   └── sports.ts
├── components/
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── Account.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── Teams.tsx
│   ├── Players.tsx
│   └── Games.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Authentication

The frontend uses the backend `/auth/register`, `/auth/login`, and `/auth/me`
endpoints. Access tokens are held in `sessionStorage` for the current browser
session and attached to API requests by the shared Axios client. On page refresh,
`AuthContext` verifies the stored token with `/auth/me`; it does not use decoded JWT
claims as user identity.

Registration does not automatically sign in. The `/account` route is protected,
while sports browsing, analytics, and live-game routes remain public.

Game Detail and Live Game views also provide an on-demand AI Game Analyst panel.
It sends the current game snapshot to the backend `/ai/game-analysis` endpoint only
when requested by the user and renders the backend's structured analysis response.
The frontend has no dependency on a specific AI provider.

Only the access token is stored. Passwords and backend secrets must never be placed
in frontend storage or `VITE_*` environment variables.
