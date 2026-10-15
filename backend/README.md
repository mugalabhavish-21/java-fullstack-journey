# HireFlow Spring Boot Backend

REST API backend for the HireFlow React job board.

## Stack
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database
- Bean Validation

## Run locally

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

## Endpoints

- `GET /api/jobs` — list jobs
- `GET /api/jobs/{id}` — get one job
- `GET /api/jobs?q=react&location=Hyderabad&type=Full%20Time` — search/filter
- `POST /api/jobs` — create a job
- `PUT /api/jobs/{id}` — update a job
- `DELETE /api/jobs/{id}` — delete a job
- `POST /api/jobs/{id}/apply` — submit an application

The H2 console is available at `/h2-console` during local development.

## Architecture

React frontend → REST API → Controller → Service → JPA Repository → H2 database
