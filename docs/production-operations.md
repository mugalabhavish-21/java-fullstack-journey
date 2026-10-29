# HireFlow production operations

This guide is the runbook for the Vercel frontend and Render Spring Boot API.

## Services and health checks

- Frontend: https://hireflow-react-interview.vercel.app
- API base: https://hireflow-api-treb.onrender.com/api
- Readiness probe: https://hireflow-api-treb.onrender.com/actuator/health/readiness
- Liveness probe: https://hireflow-api-treb.onrender.com/actuator/health/liveness

After the backend deploy containing Spring Boot Actuator is live, the readiness probe should return HTTP 200 with a minimal body such as `{"status":"UP"}`. The readiness group includes the database check. The endpoint deliberately does not reveal component names, database hosts, or credentials.

## External uptime monitoring

Create an HTTPS monitor in UptimeRobot (or an equivalent external monitor):

1. Monitor type: HTTPS.
2. URL: `https://hireflow-api-treb.onrender.com/actuator/health/readiness`.
3. Interval: every 5 minutes.
4. Expected response: HTTP 200.
5. Configure email or push alerts and a recovery notification.
6. Add a second HTTPS monitor for `https://hireflow-react-interview.vercel.app`.

Keep the checks separate: a healthy frontend does not prove the API/database is healthy. Render's free web services can sleep after inactivity, so expect cold-start delay and possible false-positive alerts on a free plan. Confirm the plan limits before treating this as production-grade availability.

## Built-in diagnostics

- **Render:** open the API service's Events, Logs, and Metrics after a failed health check or deploy.
- **Vercel:** inspect the deployment/build logs and runtime logs if the frontend fails to load or assets return errors.
- **GitHub Actions:** the HireFlow CI workflow should pass the frontend production build and Maven tests before merging code.
- **Spring Actuator:** only health is exposed over HTTP. Do not expose `env`, `configprops`, `beans`, or unrestricted Prometheus metrics publicly.

## Production secrets and demo accounts

- Keep `JWT_SECRET` set to a generated secret of at least 32 bytes. Never commit it.
- Set `APP_DEMO_USERS_ENABLED=false` in Render. Production config defaults it to false.
- The older version of the application seeded `applicant@hireflow.com` and `recruiter@hireflow.com`. Disabling seeding prevents their recreation but does not delete accounts already in PostgreSQL. Before using real data, review the `hireflow.app_users` table and remove these known demo accounts if they still exist and have no legitimate ownership:
  ```sql
  DELETE FROM hireflow.app_users
  WHERE lower(email) IN ('applicant@hireflow.com', 'recruiter@hireflow.com');
  ```
  Run this only after verifying the target database and reviewing any dependent records.
- To bootstrap a trusted recruiter on an empty production system, temporarily set both `INITIAL_RECRUITER_EMAIL` and `INITIAL_RECRUITER_PASSWORD`. The app creates the account with a BCrypt-hashed password only if it does not already exist. Remove both variables from Render immediately afterward and redeploy. Do not enable public recruiter registration.
- After changing secrets or environment variables, confirm the new deployment succeeds. Never paste secrets into logs, issues, or chat.

## Release checklist

- [ ] GitHub Actions succeeds for the exact commit being released.
- [ ] Render deployment succeeds and `/actuator/health/readiness` returns HTTP 200.
- [ ] Vercel deployment is READY and the page loads.
- [ ] Sign-in, applicant registration, role separation, job search, and protected API access are smoke-tested.
- [ ] A recruiter-only endpoint returns 403 for an applicant token.
- [ ] PostgreSQL remains connected after a restart.
- [ ] Uptime alerts and recovery notifications are enabled.

## First-response runbook

1. **Readiness returns 503 / DOWN:** check Render logs first, then database availability and connection-string configuration.
2. **API returns 401:** token missing, invalid, or expired; sign in again and inspect JWT configuration if it happens repeatedly.
3. **API returns 403:** verify the token role and the endpoint's required role.
4. **Frontend cannot reach API:** verify the Vercel `VITE_API_URL` is exactly `https://hireflow-api-treb.onrender.com/api`, then check CORS and Render service status.
5. **Deployment breaks after a release:** stop merging further changes; inspect the last successful deployment and use the platform's rollback/redeploy workflow after identifying the regression.

## Scaling caveats

The included Render Blueprint uses free-tier resources. Free PostgreSQL instances may have data-retention limits, and free web services can sleep. Do not store valuable production/user data on an expiring free database. Before real launch, choose a durable managed PostgreSQL plan, enable backups, define a restore test, set resource/connection-pool limits, and establish an incident contact.
