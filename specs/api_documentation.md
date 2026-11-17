# Survey API Documentation

This document outlines the RESTful API endpoints for authentication, administrative survey management, analytics, and public survey submissions.

---

## 🔐 Authentication

Endpoints for managing user sessions via HTTP-only JWT cookies.

| Method | Path               | Auth Required | Purpose                                          |
| :----- | :----------------- | :-----------: | :----------------------------------------------- |
| `POST` | `/api/auth/login`  |      No       | Authenticate credentials and issue a JWT cookie. |
| `POST` | `/api/auth/logout` |      Yes      | Invalidate the session and clear the JWT cookie. |

---

## 🛠️ Survey Management (Admin)

Endpoints for creating, modifying, publishing, and deleting surveys.

| Method   | Path                       | Auth Required | Purpose                                                             |
| :------- | :------------------------- | :-----------: | :------------------------------------------------------------------ |
| `GET`    | `/api/surveys`             |     Admin     | Retrieve a list of all surveys along with their response counts.    |
| `POST`   | `/api/surveys`             |     Admin     | Create a new survey draft.                                          |
| `GET`    | `/api/surveys/:id`         |     Admin     | Fetch a specific survey and its current schema.                     |
| `PUT`    | `/api/surveys/:id`         |     Admin     | Update a survey (creates a new version if responses already exist). |
| `POST`   | `/api/surveys/:id/publish` |     Admin     | Toggle the published status (publish or unpublish) of a survey.     |
| `DELETE` | `/api/surveys/:id`         |     Admin     | Permanently delete a survey.                                        |

---

## 📊 Analytics & Data (Admin)

Endpoints for viewing aggregated metrics and raw submission data.

| Method | Path                         | Auth Required | Purpose                                                         |
| :----- | :--------------------------- | :-----------: | :-------------------------------------------------------------- |
| `GET`  | `/api/surveys/:id/analytics` |     Admin     | Retrieve aggregated analytics and summary metrics for a survey. |
| `GET`  | `/api/surveys/:id/responses` |     Admin     | Fetch paginated raw response submissions.                       |

---

## 🌐 Public Survey Access

Unauthenticated endpoints for end-users to view and submit published surveys.

| Method | Path                                  | Auth Required | Purpose                                                                    |
| :----- | :------------------------------------ | :-----------: | :------------------------------------------------------------------------- |
| `GET`  | `/api/public/surveys/:slug`           |      No       | Fetch the survey schema for frontend rendering _(published surveys only)_. |
| `POST` | `/api/public/surveys/:slug/responses` |      No       | Submit a new survey response _(subject to rate limiting)_.                 |
