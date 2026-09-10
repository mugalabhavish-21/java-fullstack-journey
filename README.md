# HireFlow — React + Spring Boot Job Board

A full-stack job board portfolio project with a Vite/React frontend and a Spring Boot REST API backed by JPA and H2.

## Features
- React functional components and hooks (`useState`, `useEffect`, `useMemo`)
- Live job loading from the Spring Boot REST API
- Search across job title, company and skills
- Location and employment-type filters
- Save jobs with `localStorage` persistence
- Apply flow connected to the backend API
- Create a demo job through the REST API
- Job details modal
- Light/dark theme with persistence
- Responsive CSS for desktop, tablet and mobile

## Architecture
- Frontend: React + Vite + JavaScript + CSS
- Backend: Spring Boot + REST + Spring Data JPA
- Database: H2 (in-memory demo database)
- Frontend deployment: Vercel
- Backend deployment: Railway

## Live URLs
- Frontend: https://hireflow-react-interview.vercel.app
- Backend API: https://java-fullstack-journey-production.up.railway.app/api/jobs

## API endpoints
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs`
- `PUT /api/jobs/{id}`
- `DELETE /api/jobs/{id}`
- `POST /api/jobs/{id}/apply`

## Run frontend locally
```bash
npm install
npm run dev
```

## Run backend locally
```bash
cd backend
mvn spring-boot:run
```

**Author:** Bhavish Mugala
