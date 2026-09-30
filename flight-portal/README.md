# Flight Search Portal

Interview coding-round implementation using React + Redux Toolkit and Java Spring Boot.

## Features
- Source and destination city selection
- Direct, 1-stop and 2-stop flight data
- Multiple airlines/routes
- Redux Toolkit async API flow
- Spring Boot REST endpoints
- Loading, validation, API error and no-results handling

## API
- GET /api/cities
- GET /api/flights?source=HYD&destination=JFK

## Run backend
```bash
cd flight-portal/backend
mvn spring-boot:run
```
Runs on http://localhost:8080

## Run frontend
```bash
cd flight-portal/frontend
npm install
npm run dev
```
Runs on http://localhost:5173

The frontend defaults to http://localhost:8080/api. Set VITE_API_URL if the backend is hosted elsewhere.
