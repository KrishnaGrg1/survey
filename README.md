# Dynamic Survey Builder & Analytics Platform

A full-stack survey application for creating dynamic, conditional surveys, collecting anonymous public responses, and reviewing response-level analytics.

## Features

### Admin survey builder

- Create surveys with a title, slug, and description.
- Add, remove, reorder, and configure text, single-choice, multi-choice, and rating questions.
- Mark questions required or optional.
- Add conditional visibility rules based on previous answers.
- Publish or close surveys and share them through public URLs.
- Review submission counts and per-question analytics.

### Public survey form

- Access surveys through a public `/s/:slug` URL without signing in.
- Render questions dynamically from the saved JSON survey schema.
- Re-evaluate conditional logic as answers change.
- Perform client-side and server-side validation.
- Submit responses separately from the survey schema.

### Analytics

- View the total number of responses.
- View count and percentage breakdowns for single-choice and multi-choice questions.
- View rating distributions and average ratings.
- View submitted text responses.
- Paginate response records for the admin view.

### Authentication and security

- Better Auth-backed admin authentication with PostgreSQL session and account storage.
- Protected admin server functions and API routes.
- Zod validation for survey schemas and submitted answers.
- Public response submission rate limiting with Upstash Redis (when configured).
- Prisma parameterized database access and cascading survey deletion.

## Tech Stack

- **Framework:** TanStack Start / TanStack Router
- **Frontend:** React 19, Tailwind CSS 4, shadcn-style UI components, Lucide icons
- **Forms and validation:** TanStack Form, React Hook Form, Zod
- **Backend:** TanStack server functions and file-based API routes
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** Better Auth
- **Analytics:** Recharts-ready response aggregation and question-level calculations
- **Spam protection:** Upstash Ratelimit + Redis
- **Runtime/package manager:** Bun

## Repository and Deployment

- **GitHub:** https://github.com/KrishnaGrg1/survey
- **Live application:** https://survey-pink-two.vercel.app
- **Example public survey:** https://survey-pink-two.vercel.app/s/youtube-ads

## Project Structure

```text
src/
  components/survey/       Survey builder and question editor components
  components/auth/         Login and registration UI
  routes/admin/            Protected admin pages and analytics
  routes/s/                Public survey rendering and submission page
  routes/api/              Survey, public response, and health API routes
  lib/schema/              Zod validation and survey data schemas
  lib/server-fn-services/  Survey, response, analytics, and auth services
  lib/services/            Supporting application services
  generated/prisma/        Generated Prisma client
prisma/
  schema.prisma            Database models and relations
  migrations/              PostgreSQL migrations
  seed.ts                  Database seed script
specs/
  init.md                  Original implementation requirements
  api_documentation.md     API endpoint documentation
```

## Database Design

The PostgreSQL schema separates survey definitions from submitted answers:

- `Survey` stores public metadata, status, slug, and the current version number.
- `SurveyVersion` stores the immutable JSON question schema for each survey version.
- `Response` stores each submission and its JSON answers, linked to the exact survey version.
- `User`, `Session`, and `Account` support Better Auth authentication.
- `SurveyStatus` supports `draft`, `published`, and `closed` states.

Survey schemas are JSON to make question types and conditional rules flexible. Responses are JSON as well because answer shape differs by question type:

```text
text          -> string
single_choice -> option ID as string
multi_choice  -> array of option IDs
rating        -> number from 1 to 5
```

An update to an existing published survey can create a new `SurveyVersion`, preserving historical response context. Analytics resolve answers through the response's linked version rather than assuming the latest schema is valid for every response.

## Survey Schema Example

```json
{
  "questions": [
    {
      "id": "experience",
      "type": "single_choice",
      "label": "How would you rate your experience?",
      "required": true,
      "options": [
        { "id": "good", "label": "Good" },
        { "id": "bad", "label": "Could be better" }
      ]
    },
    {
      "id": "details",
      "type": "text",
      "label": "Please provide details",
      "required": false,
      "showIf": {
        "questionId": "experience",
        "operator": "equals",
        "value": "bad"
      }
    }
  ]
}
```

## Conditional Logic

Supported condition operators are:

- `equals`
- `not_equals`
- `includes`
- `gte`
- `lte`

Hidden questions are skipped during both frontend rendering and server-side required-answer validation.

## Local Setup

### Prerequisites

- Bun
- PostgreSQL
- An Upstash Redis database (optional for local rate limiting)

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and provide the required values:

```bash
cp .env.example .env
```

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="a-long-random-secret"

UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Generate a Better Auth secret when needed:

```bash
bunx --bun @better-auth/cli secret
```

### 3. Prepare the database

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

For an existing local database that should be synchronized without creating a migration, you can instead run:

```bash
bun run db:push
```

### 4. Start the development server

```bash
bun run dev
```

Open http://localhost:3000.

## Available Scripts

```bash
bun run dev           # Start the Vite/TanStack development server
bun run build         # Create a production build
bun run preview       # Preview the production build
bun run lint          # Run ESLint
bun run format        # Format files and fix lint issues
bun run check         # Check formatting
bun run db:generate   # Generate the Prisma client
bun run db:push       # Synchronize the Prisma schema
bun run db:migrate    # Create and apply a development migration
bun run db:studio     # Open Prisma Studio
bun run db:seed       # Seed the database
```

## API Overview

A full endpoint reference is available in [`specs/api_documentation.md`](specs/api_documentation.md).

### Implemented Application Routes

| Route | Purpose | Live URL |
| --- | --- | --- |
| `/` | Application home page | https://survey-pink-two.vercel.app/ |
| `/login` | Admin login | https://survey-pink-two.vercel.app/login |
| `/register` | Admin registration | https://survey-pink-two.vercel.app/register |
| `/admin/surveys` | List and manage surveys | https://survey-pink-two.vercel.app/admin/surveys |
| `/admin/surveys/new` | Create a new survey | https://survey-pink-two.vercel.app/admin/surveys/new |
| `/admin/surveys/:id` | Edit an existing survey | Replace `:id` with the survey ID |
| `/admin/surveys/:id/result` | View response analytics | Replace `:id` with the survey ID |
| `/s/:slug` | Public survey form | https://survey-pink-two.vercel.app/s/youtube-ads |

### Implemented API Routes

| Area | Method and endpoint | Purpose |
| --- | --- | --- |
| Health | `GET /api/health` | Check database connectivity and application health |
| Authentication | `/api/auth/*` | Better Auth login, registration, logout, and session routes |
| Survey list | `GET /api/surveys` | Retrieve all surveys and response counts |
| Survey list/create | `POST /api/surveys` | Create a new survey draft |
| Survey detail/update | `GET/PUT /api/surveys/:id` | Retrieve or update a survey |
| Survey deletion | `DELETE /api/surveys/:id` | Delete a survey and related versions/responses |
| Survey publishing | `POST /api/surveys/:id/publish` | Publish or close a survey |
| Survey analytics | `GET /api/surveys/:id/analytics` | Retrieve aggregated analytics |
| Survey responses | `GET /api/surveys/:id/responses` | Retrieve paginated response submissions |
| Public survey | `GET /api/public/surveys/:slug` | Retrieve a published survey for public rendering |
| Public submission | `POST /api/public/surveys/:slug/response` | Submit answers to a public survey |

Admin endpoints require an authenticated Better Auth session. Public endpoints expose only published surveys and reject invalid or incomplete submissions.

## Validation and Assumptions

- Public surveys do not require respondent authentication.
- Text, single-choice, multi-choice, and rating questions are supported.
- Rating questions use an integer scale of 1–5.
- Slugs must be unique and URL-safe.
- A conditional question is validated only when its visibility condition is currently satisfied.
- Survey edits do not silently change historical answers: published survey changes are represented through versions.
- Analytics are calculated from stored answers grouped by the question definition from the linked survey version.
- Upstash configuration is optional in development, but public deployments should configure Redis-backed submission limits.

## Deployment

Recommended production setup:

1. Provision a managed PostgreSQL database.
2. Set `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` in the hosting provider.
3. Run `bun run db:generate` and `bun run db:migrate` before startup.
4. Set `BETTER_AUTH_URL` to the final HTTPS origin.
5. Build and start the application using `bun run build` and the platform-specific Bun or Node-compatible start command.


## License

Add your preferred license here.
