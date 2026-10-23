# Code Review Guide

Use this guide for every pull request in this repository. Prefer specific, actionable comments tied to a file and line.

## Review order

1. **Correctness:** Does the change meet the requirement? Check null, empty, invalid, duplicate, and boundary inputs.
2. **Security:** Never commit secrets. Validate inputs. Enforce authentication and authorization on the backend, not only in React. Avoid leaking tokens or sensitive data in logs and responses.
3. **API behavior:** Check status codes, request validation, consistent error responses, and backwards compatibility.
4. **Data layer:** Check transaction boundaries, query behavior, entity relationships, and avoid unnecessary database calls.
5. **React behavior:** Check loading, success, empty, and error states; effect dependencies; state ownership; and accessible form controls.
6. **Tests:** New behavior should have meaningful tests, including failure cases where practical.
7. **Maintainability:** Prefer clear names, small focused methods/components, and avoid duplicated logic or unrelated changes.

## How to write a useful review comment

Use this structure:

- **Issue:** What could go wrong?
- **Impact:** When would a user or system be affected?
- **Suggestion:** What concrete change would fix it?

Example:

> This calls `Optional.get()` without checking whether the record exists. A missing ID will become a 500 response. Please map the missing record to a domain exception and return a 404 response.

## Review labels

- **Blocker:** Security issue, data loss, broken core flow, or severe correctness bug.
- **Major:** Important bug, missing authorization, or missing test for critical behavior.
- **Minor:** Maintainability or non-critical edge case.
- **Nit:** Style preference only; do not block a PR for this.

## Good GitHub habits

- Keep each PR focused on one purpose.
- Run the automated checks before requesting review.
- Respond to every actionable review comment and resolve threads only after the fix is made.
- Request a review from another developer when possible. Self-review or artificial activity does not substitute for independent review.
