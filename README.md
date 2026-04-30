# Review Panel

An employee performance review web app built for the CysecK Fullstack Developer Challenge 2.

Admins manage employees and performance reviews. Employees log in and submit feedback on the reviews they've been assigned to.

## Tech Stack

**Backend**

- Node.js + Express 5
- PostgreSQL via Prisma ORM
- JWT authentication (httpOnly cookies)
- Resend (transactional email for password reset)

**Frontend**

- React 19 + Vite
- React Router v7
- Axios
- Tailwind CSS v4

**Infrastructure**

- Docker + Docker Compose (multi-stage build — frontend served by the backend in production)

## Features

### Admin

- Add, view, and remove employees
- Create and manage performance reviews
- Assign employees as reviewers on any review
- View all submitted feedback for a review

### Employee

- View performance reviews assigned to them
- Submit, edit, or delete their feedback (rating 1–5 + comment)
- Reset forgotten password via email link

## API Endpoints

| Method | Path                        | Auth     | Description                   |
| ------ | --------------------------- | -------- | ----------------------------- |
| POST   | `/auth/login`               | Public   | Login                         |
| POST   | `/auth/forgot-password`     | Public   | Send password reset email     |
| GET    | `/auth/reset-password`      | Public   | Validate reset token          |
| POST   | `/auth/reset-password`      | Public   | Set new password              |
| GET    | `/employees`                | Admin    | List all employees            |
| POST   | `/employees`                | Admin    | Create employee               |
| DELETE | `/employees/:id`            | Admin    | Delete employee               |
| GET    | `/reviews`                  | Admin    | List all reviews              |
| POST   | `/reviews`                  | Admin    | Create review                 |
| POST   | `/reviews/:id/assign`       | Admin    | Assign reviewers to a review  |
| GET    | `/reviews/:id/feedback`     | Admin    | Get all feedback for a review |
| GET    | `/reviews/my`               | Employee | List reviews assigned to me   |
| GET    | `/assignments/my`           | Employee | List my assignments           |
| POST   | `/assignments/:id/feedback` | Employee | Submit feedback               |
| PUT    | `/assignments/:id/feedback` | Employee | Update feedback               |
| DELETE | `/assignments/:id/feedback` | Employee | Delete feedback               |
| GET    | `/api/health`               | Public   | Health check                  |

## Database Schema

```
Employee       — id, name, email, department, role (admin|employee), passwordHash
PerformanceReview — id, title, period, dueDate, employeeId (reviewee), createdById
ReviewAssignment  — id, reviewId, participantId, status (pending|submitted), rating, comment
PasswordResetToken — id, email, token, expiresAt, usedAt
```

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 16

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/sujoy-2811/review-panel-cyseck
   cd review-panel
   ```

2. **Configure the backend**

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials and secrets
   ```

3. **Start the backend**

   ```bash
   cd backend
   npm run dev
   ```

   This runs Prisma migrations and starts the server with nodemon on the configured `PORT` (default `3000`).

4. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Vite dev server starts on `http://localhost:5173`.

## Running with Docker

### Prerequisites

- Docker and Docker Compose

### Setup

1. **Configure environment**

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env — use "postgres" as the DB host (the compose service name)
   ```

2. **Build and start**

   ```bash
   docker compose up --build
   ```

   The app will be available at `http://localhost:8003` (or the `PORT` set in your `.env`).

   The frontend is built and served by the Express backend in production mode.

### Environment Variables

| Variable            | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string (use `postgres` as host in Docker) |
| `PORT`              | Server port (default `8003` in Docker, `3000` locally)          |
| `JWT_SECRET`        | Secret key for signing JWT tokens                               |
| `RESEND_FROM_EMAIL` | From address for password reset emails                          |
| `POSTGRES_USER`     | PostgreSQL username (used by Docker Compose)                    |
| `POSTGRES_PASSWORD` | PostgreSQL password (used by Docker Compose)                    |
| `POSTGRES_DB`       | PostgreSQL database name (used by Docker Compose)               |
