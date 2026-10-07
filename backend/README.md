# HireFlow API

Enhanced Spring Boot REST API for the HireFlow recruitment portal.

Features:
- Search by title, company, or skills
- Combined keyword, location, and job-type filters
- Pagination with page size capped at 50
- Sorting
- Job statistics
- Bean validation
- Global validation error responses
- 404 handling
- H2 local persistence
- Service-layer unit test

APIs:
GET /api/jobs?q=java&location=Hyderabad&type=Full%20Time&page=0&size=6&sortBy=title&direction=asc
GET /api/jobs/stats
GET /api/jobs/{id}
POST /api/jobs
PUT /api/jobs/{id}
DELETE /api/jobs/{id}
POST /api/jobs/{id}/apply

The list endpoint returns Spring Page metadata including content, totalElements, totalPages, number, and size.

Run locally with: mvn spring-boot:run
API: http://localhost:8080
H2 console: http://localhost:8080/h2-console
