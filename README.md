# AI Tutor Tools

AI Tutor Tools is a teacher-focused workspace for creating, organizing, analyzing, and sharing classroom materials. The primary application is a React and TypeScript single-page app backed by an Express API, MongoDB, and an optional Groq-powered generation service. A separate vanilla HTML/CSS/JavaScript implementation is also included under `vanilla/`.

## What It Does

The application brings common teaching workflows into one place:

- Generate lesson plans from subject, grade level, topic, duration, objectives, and materials.
- Build grading rubrics with criteria and performance levels.
- Draft IEP content, including goals, accommodations, and modifications.
- Create exit tickets and quick checks for understanding.
- Generate report-card comments for individual students.
- Recommend differentiated assignments.
- Rewrite classroom activities as clearer student directions.
- Save generated work as documents and revisit it later.
- Search, filter, edit, duplicate, share, import, export, and delete saved content.
- View dashboard summaries and analytics.
- Manage student records and reusable templates.
- Export content as text or PDF.
- Optionally connect to Google Classroom to browse courses and rosters, create assignments or materials, sync content, review submissions, and submit grades.

Generated content should be reviewed by an educator before it is used with students. In particular, IEP and report-comment output is drafting assistance, not a substitute for professional judgment, school policy, or legal requirements.

## Application Variants

### React application

The React/Vite application is the main implementation. It provides typed components, client-side routing, Tailwind CSS styling, Chart.js visualizations, Markdown rendering, and a development proxy for `/api` requests.

### Vanilla application

`vanilla/` contains a framework-free implementation of the same general product. It uses standard browser JavaScript, hash-based routing, local storage, and the same `/api` backend conventions. See [vanilla/README.md](vanilla/README.md) for its structure and limitations.

## Architecture

```text
Browser
  |
  | React SPA at :5173
  | /api requests proxied by Vite
  v
Express API at :5000 by default
  |
  +--> MongoDB via Mongoose
  +--> Groq-compatible AI generation service
  +--> Google Classroom and Drive APIs (optional)
```

The main source directories are:

```text
.
├── src/
│   ├── App.tsx                         # React routes and application shell
│   ├── components/                     # Shared pages and UI components
│   │   └── tools/                      # AI generation forms
│   ├── index.css                       # Global styles and Tailwind layers
│   └── main.tsx                        # React entry point
├── backend/
│   └── src/
│       ├── index.ts                    # Express server and middleware
│       ├── routes/index.ts             # API routes
│       ├── controllers/                # AI and sample controllers
│       ├── models/                     # Mongoose document models
│       ├── services/                   # PDF, analytics, and Classroom services
│       └── utils/gemini.ts             # Groq-compatible AI client helpers
├── vanilla/                            # Alternate browser-only frontend
├── GOOGLE_CLASSROOM_SETUP.md           # Detailed Classroom setup notes
├── vite.config.ts                      # React plugin and API proxy
└── package.json                        # Frontend scripts and dependencies
```

## Requirements

- Node.js 18 or newer. Node.js 20 LTS or newer is recommended.
- npm 9 or newer.
- MongoDB for persisted documents, dashboard data, students, templates, and analytics.
- A Groq-compatible API key for AI generation. The current backend reads `GROQ_API_KEY`.
- Google Cloud credentials only if Google Classroom integration is needed.

MongoDB may be local or hosted. The seed script falls back to `mongodb://localhost:27017/teaching-tools` when no `MONGO_URI` is supplied, while the running server currently reads `MONGO_URI` directly. Set it explicitly for predictable behavior.

## Installation

Clone the repository, enter the project directory, and install dependencies for both packages:

```bash
cd Ai-Tutor
npm install
npm --prefix backend install
```

The frontend and backend have separate `package.json` files. Installing only the root dependencies is enough to render the frontend, but backend features require the second install as well.

## Configuration

### Backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teaching-tools
GROQ_API_KEY=your-groq-api-key

# Optional Google Classroom integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

Do not commit real credentials. `backend/.env` should remain local and should be added to your ignore rules if it is not already ignored.

### Frontend environment

Create `.env` in the repository root when overriding the Google OAuth defaults:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

Vite only exposes variables prefixed with `VITE_` to browser code. Never put a secret, including `GOOGLE_CLIENT_SECRET` or an AI API key, in a `VITE_` variable.

### API proxy port

The checked-in [vite.config.ts](vite.config.ts) proxies `/api` to `http://localhost:3001`, while the backend defaults to port `5000`. To connect the frontend to the backend without changing the Vite config, start the backend with `PORT=3001`:

```bash
PORT=3001 npm --prefix backend run dev
```

Alternatively, change the proxy target in `vite.config.ts` to the port used by the backend. Keep the two ports aligned. This mismatch is the most common reason the frontend displays `Could not connect to backend.`

## Running Locally

Use two terminals from the repository root.

### Terminal 1: backend

Make sure MongoDB is running and then start the API:

```bash
npm --prefix backend run dev
```

The API reports `Server running on port 5000` by default. If using the current Vite proxy without editing it, use:

```bash
PORT=3001 npm --prefix backend run dev
```

### Terminal 2: frontend

```bash
npm run dev -- --host 127.0.0.1
```

Open the URL printed by Vite, normally <http://127.0.0.1:5173/>.

The frontend can be opened without the backend, but generation, persistence, analytics, and the initial `/api/sample` health check will not work. The UI will show a backend connection message when the API is unavailable.

## Production Build

Build the frontend:

```bash
npm run build
```

Preview the compiled frontend locally:

```bash
npm run preview
```

Compile the backend TypeScript:

```bash
npm --prefix backend run build
```

Start the compiled backend:

```bash
npm --prefix backend start
```

The backend build writes JavaScript to the location configured by `backend/tsconfig.json`. Configure a production web server or hosting platform to serve the frontend build and route `/api` requests to the Express process.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the React/Vite development server |
| `npm run build` | Type-check and build the frontend bundle |
| `npm run lint` | Run ESLint across the frontend project |
| `npm run preview` | Serve the frontend production build locally |
| `npm --prefix backend run dev` | Run the backend with Nodemon and `ts-node` |
| `npm --prefix backend run build` | Compile backend TypeScript |
| `npm --prefix backend start` | Run the compiled backend |

There is currently no automated test script in either package. Use the build, lint, API health check, and manual workflow checks described below as the baseline verification loop.

## Frontend Routes

The React app defines these client-side routes:

| Route | Purpose |
| --- | --- |
| `/` | Tool dashboard and favorites |
| `/documents` | Saved document management |
| `/tools/lesson-plan` | Lesson plan generator |
| `/tools/rubric` | Rubric generator |
| `/tools/iep` | IEP assistant |
| `/tools/exit-ticket` | Exit ticket generator |
| `/tools/report-comment` | Report comment generator |
| `/tools/assignments` | Assignment recommendation tool |
| `/tools/directions` | Clear directions generator |
| `/output/:toolId` | Generated output viewer |
| `/analytics` | Dashboard and analytics |
| `/students` | Student management |
| `/auth/google/callback` | Google OAuth callback |

## API Overview

The Express server mounts all routes under `/api`.

### Health and AI generation

- `GET /api/sample`
- `POST /api/ai/lesson-plan`
- `POST /api/ai/rubric`
- `POST /api/ai/iep`
- `POST /api/ai/exit-ticket`
- `POST /api/ai/report-comment`
- `POST /api/ai/assignments`
- `POST /api/ai/directions`

AI requests are handled by the backend and use `GROQ_API_KEY`; the key must never be sent from the browser.

### Documents and content

- `GET /api/documents`
- `POST /api/documents`
- `DELETE /api/documents/:id`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/:type`
- `GET /api/search`
- `GET /api/search/:type`
- `PUT /api/:type/:id`
- `DELETE /api/:type/:id`
- `POST /api/:type/:id/duplicate`
- `POST /api/import`
- `GET /api/export/:type/:id`
- `POST /api/export/bulk`
- `POST /api/export/pdf`
- `GET /api/pdf/:type/:id`

Supported content types include lesson plans, rubrics, IEPs, exit tickets, report comments, assignments, and directions. See [backend/src/routes/index.ts](backend/src/routes/index.ts) for request bodies and implementation details.

### Supporting features

- `GET|POST|PUT|DELETE /api/students`
- `GET|POST|PUT|DELETE /api/templates`
- `POST /api/google-classroom/sync-bulk`
- `POST /api/google-classroom/templates/:templateId/sync`
- `GET /api/google-classroom/courses/:courseId/assignments/:assignmentId/grades.csv`
- `POST /api/google-classroom/grades/import`
- `GET /api/google-classroom/courses/:courseId/analytics`
- `POST /api/share`
- `GET /api/shared-with-me`
- `GET /api/my-shares`
- `DELETE /api/share/:id`
- `GET /api/analytics`

## Database Models

The backend uses Mongoose models for:

- `LessonPlan`
- `Rubric`
- `IEP`
- `ExitTicket`
- `ReportComment`
- `Assignment`
- `Direction`
- `Document`
- `Student`
- `Template`
- `Share`

Most generated content is stored with metadata such as title, subject, grade level, and creation time. The exact schema is the source of truth in `backend/src/models/`.

## Seed Data

The repository includes `backend/src/scripts/seedData.ts`, which clears and repopulates generated-content collections with sample records. Run it with a TypeScript runner after installing backend dependencies and configuring MongoDB:

```bash
cd backend
npx ts-node src/scripts/seedData.ts
```

This script deletes existing lesson plans, rubrics, IEPs, exit tickets, report comments, assignments, and directions before inserting samples. Use it only against a development database.

## Google Classroom Integration

Google Classroom support is optional. The full setup guide is in [GOOGLE_CLASSROOM_SETUP.md](GOOGLE_CLASSROOM_SETUP.md).

At a high level:

1. Create or select a Google Cloud project.
2. Enable the Google Classroom API.
3. Create OAuth 2.0 web credentials.
4. Add `http://localhost:5173/auth/google/callback` as an authorized redirect URI.
5. Set the backend and frontend variables described above.
6. Start both services and connect from the Classroom integration UI.

The integration can list courses, list course students, sync generated content, create assignments or materials, list submissions, and grade submissions. OAuth access tokens are kept in browser local storage by the current implementation, so use a development/test Google account and review the security requirements before deploying publicly.

## Verification Checklist

After setup, verify the stack in this order:

1. Visit <http://127.0.0.1:5173/> and confirm the React app loads.
2. Visit <http://localhost:3001/> or <http://localhost:5000/> according to your backend port and confirm the API responds with `API is running`.
3. Confirm the frontend health message changes from `Could not connect to backend.` to the sample API response.
4. Generate one lesson plan or rubric and confirm the request reaches `/api/ai/...`.
5. Open Documents and confirm MongoDB persistence works.
6. Run `npm run build` and `npm run lint` before sharing changes.

## Troubleshooting

### The frontend loads but says it cannot connect to the backend

Check that MongoDB is running, the backend process is active, and the backend port matches the Vite proxy target. The current proxy target is `http://localhost:3001`; start the backend with `PORT=3001` or update `vite.config.ts`.

### The backend exits while connecting to MongoDB

Set a valid `MONGO_URI` in `backend/.env`. For a local installation, try:

```env
MONGO_URI=mongodb://127.0.0.1:27017/teaching-tools
```

Also confirm that the MongoDB service is running and that the selected database is reachable.

### AI generation fails

Confirm that `GROQ_API_KEY` is set in `backend/.env`, restart the backend after changing environment variables, and check the backend logs for provider or request errors. Keep the key on the server side.

### Google OAuth reports an invalid redirect URI

The redirect URI must match exactly in Google Cloud Console and in `GOOGLE_REDIRECT_URI` / `VITE_GOOGLE_REDIRECT_URI`, including protocol, port, path, and trailing slash behavior.

### PDF or document export fails

Confirm the API is running and MongoDB contains the requested record. Check the response status and backend logs; export handlers return a failure response when the requested type or document ID is invalid.

## Development Notes

- Keep frontend code in `src/` and backend code in `backend/src/`.
- Prefer existing component and service patterns when adding a new tool.
- Add a React route in `src/App.tsx`, a tool component under `src/components/tools/`, and a matching backend controller/route/model when persistence or AI generation is required.
- Add API calls through the existing `/api` path so the Vite proxy and production reverse proxy remain consistent.
- Do not expose server-only credentials through Vite environment variables.
- Review generated educational content for accuracy, bias, privacy, accessibility, and age appropriateness before classroom use.

## License

No project license is currently declared. Treat this repository as private unless the project owner adds licensing terms.
