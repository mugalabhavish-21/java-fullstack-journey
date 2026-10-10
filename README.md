# HireFlow — Full-Stack Job Portal

HireFlow is a full-stack job portal built with **React, Redux Toolkit, Spring Boot, Spring Security, and PostgreSQL**. It has separate applicant and recruiter workspaces for managing job listings, applications, saved jobs, candidate profiles, interviews, and notifications.

## Live application

- **Frontend:** https://hireflow-react-interview.vercel.app
- **Backend API:** https://hireflow-api-production-b901.up.railway.app/api
- **Source branch:** [`hireflow-complete`](https://github.com/mugalabhavish-21/java-fullstack-journey/tree/hireflow-complete)

The frontend is hosted on Vercel and the backend API on Railway. The production backend is configured to use PostgreSQL. For local development, the Spring Boot configuration defaults to an in-memory H2 database unless datasource environment variables are supplied.

## Features

### Applicant workspace
- Register an applicant account and sign in.
- Browse jobs and search by role, company, or skills.
- Filter listings by location and employment type.
- View job details including company, description, skills, level, and salary information.
- Apply to a job and prevent repeat applications to the same job.
- Track application status and application date.
- Save jobs for later and remove saved jobs.
- View and update a candidate profile, including skills, education, experience, phone number, and resume URL.
- View scheduled interviews and open a supplied meeting link.
- View notifications and mark them as read.

### Recruiter workspace
- View hiring overview and application pipeline counts.
- Create, edit, and delete job listings.
- Review applications submitted by candidates.
- Update application status to `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, or `REJECTED`.
- Schedule interviews with a date/time, interview type, and optional meeting link.
- View scheduled interviews and notifications.

### Engineering features
- React functional components and hooks.
- Redux Toolkit async thunks for API calls and shared application state.
- REST APIs built with Spring Boot.
- Spring Data JPA persistence.
- Role-based endpoint access for applicants and recruiters.
- Password hashing with BCrypt.
- Signed bearer-token authentication.
- Request validation, pagination, filtering, sorting, and centralized error handling.
- Responsive interface for desktop and mobile.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, JavaScript, CSS |
| State management | Redux Toolkit, React Redux |
| Backend | Java 17, Spring Boot 3, Spring Web |
| Security | Spring Security, method-level authorization, BCrypt |
| Data access | Spring Data JPA / Hibernate |
| Production database | PostgreSQL |
| Local default database | H2 in-memory |
| Frontend hosting | Vercel |
| Backend hosting | Railway |

## Demo accounts

Use these seeded accounts to explore the demo:

| Role | Email | Password |
| --- | --- | --- |
| Applicant | `applicant@hireflow.com` | `applicant123` |
| Recruiter | `recruiter@hireflow.com` | `recruiter123` |

These credentials are for demonstration only. Do not use them for sensitive or real-world accounts. Public registration creates applicant accounts; recruiter access should be restricted to trusted users in a real production system.

## API reference

Base URL: `https://hireflow-api-production-b901.up.railway.app/api`

### Authentication
| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register an applicant |
| POST | `/auth/login` | Authenticate a user and return a token |

### Jobs
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/jobs` | Public | Search and page through jobs |
| GET | `/jobs/{id}` | Public | Get one job |
| GET | `/jobs/stats` | Public | Get job-listing statistics |
| POST | `/jobs` | Recruiter | Create a job |
| PUT | `/jobs/{id}` | Recruiter | Update a job |
| DELETE | `/jobs/{id}` | Recruiter | Delete a job |

The job list supports `q`, `location`, `type`, `page`, `size`, `sortBy`, and `direction` query parameters.

### Applications
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/applications/{jobId}` | Applicant | Apply for a job |
| GET | `/applications/mine` | Applicant | List the current applicant's applications |
| GET | `/applications` | Recruiter | List applications for review |
| PATCH | `/applications/{id}/status` | Recruiter | Update an application's status |
| GET | `/applications/stats` | Recruiter | Get application counts by status |

### Profile, saved jobs, interviews, and notifications
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/profile` | Applicant | Get the current user's profile |
| PUT | `/profile` | Applicant | Update the current user's profile |
| GET | `/saved-jobs` | Applicant | List saved jobs |
| POST | `/saved-jobs/{jobId}` | Applicant | Save a job |
| DELETE | `/saved-jobs/{jobId}` | Applicant | Remove a saved job |
| GET | `/interviews/mine` | Applicant | List the current applicant's interviews |
| GET | `/interviews` | Recruiter | List scheduled interviews |
| POST | `/interviews` | Recruiter | Schedule an interview |
| GET | `/notifications` | Authenticated user | List the current user's notifications |
| PATCH | `/notifications/{id}/read` | Authenticated user | Mark one owned notification as read |

Protected endpoints expect an `Authorization: Bearer <token>` header. Endpoint access is enforced by Spring Security and method-level role checks.

## Run locally

### Prerequisites
- Java 17
- Maven
- Node.js and npm
- Git

### 1. Clone the repository
```bash
git clone https://github.com/mugalabhavish-21/java-fullstack-journey.git
cd java-fullstack-journey
git checkout hireflow-complete
```

### 2. Start the backend
```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080` by default. By default, it uses an in-memory H2 database and seeds sample jobs and demo users. Data in the in-memory database is not retained after the application restarts.

Useful backend commands:
```bash
mvn test
mvn -DskipTests package
```

### 3. Start the frontend
In a second terminal, from the repository root:
```bash
cd hireflow-frontend
npm install
```

Create a `.env` file inside `hireflow-frontend` for local development:
```env
VITE_API_URL=http://localhost:8080/api
```

Start the Vite development server:
```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

To build the frontend for production:
```bash
npm run build
npm run preview
```

## Deployment configuration

### Vercel (frontend)
- Project root directory: `hireflow-frontend`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://hireflow-api-production-b901.up.railway.app/api`

Vite embeds `VITE_*` values during the build, so redeploy the frontend after changing `VITE_API_URL`.

### Railway (backend)
- Project root directory: `backend`
- Build command: `mvn -DskipTests package`
- Start command: `java -jar target/hireflow-api-0.0.1-SNAPSHOT.jar`
- The app listens on Railway's `PORT` environment variable, defaulting to `8080`.

The backend reads datasource configuration from environment variables. Production should provide PostgreSQL datasource values and a strong `JWT_SECRET`. Never commit real secrets or database credentials to GitHub.

## Project structure

```text
java-fullstack-journey/
├── backend/
│   ├── src/main/java/com/hireflow/api/
│   │   ├── auth/            # Authentication and security filter
│   │   ├── application/     # Job applications and status workflow
│   │   ├── interview/       # Interview scheduling
│   │   ├── job/             # Job listing APIs and service layer
│   │   ├── notification/    # User notifications
│   │   ├── profile/         # Applicant profile
│   │   ├── saved/           # Saved jobs
│   │   └── user/            # User model, repository, and roles
│   ├── src/main/resources/
│   └── pom.xml
├── hireflow-frontend/
│   ├── src/
│   │   ├── redux/           # Redux store and async workflows
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── index.html
└── README.md
```

## Security and production notes

- Passwords are hashed using BCrypt; they are not stored as plain text.
- The app uses a custom HMAC-SHA256 signed bearer-token implementation. Before using HireFlow for real users or sensitive data, replace it with a well-supported JWT library and review token validation, secret management, expiration, and key rotation.
- Configure a strong, unique `JWT_SECRET` in the deployment environment. Do not rely on the source-code development fallback.
- Demo recruiter credentials are deliberately included for portfolio testing. Disable or rotate demo accounts before any public production use.
- Run the automated tests and smoke-test both roles and the main flows after deploying changes. A successful build by itself does not guarantee that every user journey works.

## Other projects in this repository

This repository also contains JavaScript and React practice projects, including:
- [JavaScript Tic Tac Toe](javascript-project)
- A React Redux cake and ice-cream inventory demo under `src/`

---

**Author:** Bhavish Mugala  
**Portfolio repository:** [java-fullstack-journey](https://github.com/mugalabhavish-21/java-fullstack-journey)
