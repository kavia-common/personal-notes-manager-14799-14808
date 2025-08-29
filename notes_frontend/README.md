# Notes Frontend (Next.js)

Modern, minimalistic notes UI with:
- User authentication (mocked client-side for demo)
- Create, read, update, delete notes
- Sidebar notes list, top navigation, main editor area
- Light theme using provided palette (primary #1976d2, secondary #424242, accent #ffca28)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Copy `.env.example` to `.env` and adjust as needed:
```bash
cp .env.example .env
```

3. Run the app:
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Architecture

- src/app: Next.js App Router pages
- src/components: UI components (TopNav, Sidebar, NoteEditor, etc.)
- src/lib/auth.ts: Client-side session management (localStorage). Replace with real auth as needed.
- src/lib/notesApi.ts: Client-side notes CRUD (localStorage). Replace with real backend integration.

## Configuration

Public env vars (client-safe):
- NEXT_PUBLIC_APP_NAME: Branding name
- NEXT_PUBLIC_API_BASE_URL: Base URL for backend (defaults to /api). For this demo, localStorage is used.
- NEXT_PUBLIC_SITE_URL: Site origin for auth provider redirects (if integrating real auth).

## Replacing the Demo Storage

To integrate a real backend:
- Swap implementations inside `src/lib/auth.ts` and `src/lib/notesApi.ts` to call your HTTP API using `NEXT_PUBLIC_API_BASE_URL`.
- Keep environment variables in `.env` (do not hardcode URLs).

## Design

- Light theme variables in `src/app/globals.css`
- Minimal layout: TopNav, Sidebar, Editor
- Responsive: Sidebar stacks on small screens

## Scripts

- `dev`: Start dev server
- `build`: Production build
- `start`: Start production server
- `lint`: Lint codebase
