# EDTech for Kids

A full-stack learning platform for kids with:
- Kid-friendly video-first lessons (watch video, then take quiz)
- Parent accounts + multiple children (PIN-based child login)
- Admin dashboard to view parent/student performance
- Seeded quizzes for Classes 1–5 (Math/Science/English)
- Optional AI quiz generation (requires an API key)

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Axios, Framer Motion
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- AI (optional): OpenRouter via `openai` SDK

## Project Structure

- `client/` — React app (UI)
- `server/` — Express API (DB + auth + quizzes + seeding)

## Requirements

- Node.js (LTS recommended)
- MongoDB running locally or a MongoDB connection string

## Setup

### 1) Backend (server)

Create your environment file:

- Copy `server/.env.example` to `server/.env`
- Fill in values (especially `MONGO_URI` and `OPENAI_API_KEY` if using AI quiz generation)

Install + run:

```bash
cd server
npm install
npm start
```

Backend runs on: `http://localhost:5000`

#### Seeding

On server start, the backend seeds:
- Courses (`server/utils/seedCourses.js`)
- Lesson quizzes for classes 1–5 (`server/utils/seedClassOneLessons.js`)

#### Default Admin Accounts

Default admin accounts are created/synced on server startup from:
- `server/server.js` (`DEFAULT_ADMINS`)
- and can also be synced via `server/sync-admins.js`

To change admin email/password, update `DEFAULT_ADMINS` in:
- `server/server.js`
- `server/sync-admins.js`

Admin login is handled by:
- `POST /api/auth/login` (checks `role: "admin"`)

### 2) Frontend (client)

Install + run:

```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Main API Routes

- Auth:
  - `POST /api/auth/register` (parent/student registration)
  - `POST /api/auth/login` (parent/admin login)
  - `POST /api/auth/student-login` (child login using parent email + child name + PIN)
  - `PATCH /api/auth/student-pin` (set/reset child PIN)
- Quizzes:
  - `GET /api/quiz/random/:classLevel?topic=...`
  - `POST /api/quiz/submit`
- Admin:
  - `GET /api/admin/users` (parents + attached children)
- Results:
  - `GET /api/results/progress/:studentId`
- AI (optional):
  - `POST /api/ai/generate`

## AI Quiz Generator (Optional)

The AI quiz route uses OpenRouter via the `openai` SDK:
- `server/routes/aiQuizRoutes.js`

To enable it, set in `server/.env`:
- `OPENAI_API_KEY=...`

## Security Notes

- Never commit `server/.env` (it contains secrets). This repo is configured to ignore `.env` files via `.gitignore`.
- If an API key was ever exposed (shared/screenshot/committed), revoke/rotate it immediately in the provider dashboard.

## Scripts

Frontend (`client/package.json`):
- `npm run dev`
- `npm run lint`
- `npm run build`

Backend (`server/package.json`):
- `npm start`

## Troubleshooting

- **MongoDB connection error**: check `MONGO_URI` in `server/.env` and ensure MongoDB is running.
- **Quizzes not showing**: ensure server seeding ran on startup; check server logs for “Lesson quizzes synced”.
- **AI generation fails**: verify `OPENAI_API_KEY` is set and valid; check server logs for the detailed error response.

