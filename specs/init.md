# Full-Stack Dynamic Survey Builder & Analytics Platform

## Objective

Build a full-stack application that allows administrators to create dynamic surveys with conditional logic, enables users to submit validated responses publicly, and provides an interactive analytics dashboard.

---

## Core Requirements

### 1. Admin Panel (Survey Builder)

- **Survey Metadata:** Create and configure surveys with a **Title** and **Description**.
- **Supported Question Types:**
  - Text Input (short/long text)
  - Multiple Choice (Single Select)
  - Checkbox (Multi-select)
  - Rating Scale (1–5)
- **Builder Features:**
  - Add, remove, and reorder questions (e.g., drag-and-drop or up/down controls).
  - Toggle questions as **Required** or **Optional**.
  - **Conditional Logic:** Define visibility rules based on previous answers (e.g., _Show Question B only if Question A equals "Yes"_).

### 2. Public User Interface (Survey Form)

- **Access:** Publicly accessible via a shareable link (no login required, or optional authentication).
- **Dynamic Rendering:** Render form fields dynamically from the saved survey JSON schema, evaluating conditional logic in real time.
- **Client & Server Validation:**
  - Enforce required fields (accounting for hidden/skipped conditional questions).
  - Validate correct data types and constraints before submission.

### 3. Analytics Dashboard

- **Overview Metrics:** Display the total number of survey responses.
- **Per-Question Insights:**
  - **Multiple Choice / Checkbox:** Option breakdown with response counts and percentages.
  - **Rating:** Average score calculation and distribution.
  - **Text Input:** Paginated or scrollable list view of submitted text responses.

---

## Bonus Features (Optional)

- **Authentication:** JWT-based authentication to protect admin routes and survey ownership.
- **Survey Versioning:** Maintain schema versions when editing published surveys so historical responses remain intact.
- **Partial Responses:** Save draft/in-progress answers locally or in the database.
- **Spam Protection:** Implement rate limiting or CAPTCHA on public submission endpoints.

---

## Submission Requirements

- **Source Code:** Link to a public GitHub repository.
- **Live Deployment:** URL to the hosted, working application.
- **Demo:** A brief video walkthrough demonstrating survey creation, conditional logic, submission, and analytics _(recommended)_.
- **Documentation (`README.md`):** Must clearly outline:
  - Local setup and environment instructions
  - Architecture decisions and database schema design
  - Key assumptions and technical trade-offs
