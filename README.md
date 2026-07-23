# Athena Sports Intelligence Frontend

Athena Sports Intelligence is a production-ready frontend foundation for a modern basketball analytics platform. This phase focuses on clean project structure, routing, styling, and API client configuration so future phases can add real data, authentication, analytics, and richer product features.

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
│   └── client.ts
├── components/
│   └── Navbar.tsx
├── pages/
│   ├── Home.tsx
│   ├── Teams.tsx
│   ├── Players.tsx
│   └── Games.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Current Scope

Phase 1 includes the frontend foundation only:

- Responsive navigation
- Page routing
- Placeholder pages for teams, players, and games
- Reusable Axios client
- Tailwind CSS styling
- Strict TypeScript configuration

Backend code, authentication, charts, analytics, WebSockets, mock APIs, and live updates are intentionally out of scope for this phase.
