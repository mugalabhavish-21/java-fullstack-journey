# HireFlow authenticated frontend

This is the full authenticated HireFlow job portal, intentionally kept separate from the repository's root demo apps.

## Local development

1. Start the Spring Boot API from `backend/` with Java 17 and Maven.
2. Create `.env.local` in this folder:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. Install and run the frontend:

   ```bash
   npm install
   npm run dev
   ```

The Vercel deployment uses `VITE_API_URL=https://hireflow-api-treb.onrender.com/api`.

## Vercel deployment settings

Set this folder as the project's Root Directory: `hireflow-frontend`. Build command: `npm run build`; output directory: `dist`. The project environment must set `VITE_API_URL` for Production and Preview.

Demo account hints are rendered only in local development. Public registration creates applicant accounts only; recruiter accounts must be provisioned by a trusted operator.

For health monitoring, deployment checks and incident handling, read [the production operations guide](../docs/production-operations.md).
