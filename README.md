# HireFlow — Full-Stack Job Board

HireFlow is a React + Vite frontend connected to a Spring Boot REST API. This branch focuses on stabilizing the public job-discovery experience before adding persisted applications and authentication.

## Current functionality
- Fetches jobs from the Spring Boot API (GET /api/jobs).
- Searches jobs by keyword and filters by location and employment type.
- Shows loading, empty, and API error states.
- Sorts returned results by title or company.
- Saves jobs locally in the browser using localStorage.
- Opens a job details dialog and supports light/dark themes.
- Calls the existing demo application endpoint. Applications are not yet persisted; the UI makes this limitation explicit.
- Responsive layout for mobile, tablet and desktop.

## Tech stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation
- Database: H2 in the current backend configuration
- Deployment targets: Vercel (frontend) and Railway (backend)

## API
The frontend defaults to https://java-fullstack-journey-production.up.railway.app/api. Override this with the VITE_API_BASE_URL environment variable; its value should end with /api.

- GET /api/jobs?q=java&location=Hyderabad&type=Full%20Time
- GET /api/jobs/{id}
- POST /api/jobs
- PUT /api/jobs/{id}
- DELETE /api/jobs/{id}
- POST /api/jobs/{id}/apply — currently acknowledges a demo request; it does not create a persistent application record.

## Run locally

Frontend:
    npm install
    npm run dev

Backend:
    cd backend
    mvn spring-boot:run

Set VITE_API_BASE_URL=http://localhost:8080/api in a local .env file to use the local backend.

## Roadmap
1. Verify and stabilize deployed API integration.
2. Persist applications with a JPA entity and repository.
3. Add DTOs, global exception handling, pagination, and integration tests.
4. Add authentication and candidate/recruiter authorization.
5. Move production persistence from in-memory H2 to PostgreSQL.

Author: Bhavish Mugala
