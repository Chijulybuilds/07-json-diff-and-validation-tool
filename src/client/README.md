# Diffify — JSON Diff & Validation

A responsive React + TypeScript frontend demo inspired by the supplied Sovra visual reference: dark surfaces, luminous violet-to-coral gradients, fine grid lines, and editorial typography.

## Features
- JSON comparison for nested objects and arrays (added, removed, changed).
- JSON Schema validation using Ajv.
- Demo sign up / sign in flow stored in browser localStorage.
- Light/dark theme toggle.
- Sample data, copy results, reset controls, responsive navigation.
- Contact form with client-side validation and a demo success state.

## Run locally
Requirements: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Build production assets with `npm run build`; preview them with `npm run preview`.

## Important demo limitations
Authentication is intentionally a **frontend-only mock**. It stores a demo user record in localStorage and is not secure authentication. Do not use it for real accounts, passwords, or sensitive data. A production version should use a backend/auth provider, password hashing, session or token handling, rate limiting, and server-side authorization.

The comparison and validation currently run in the browser, so no API or database is required. The shared project plan describes an API/service boundary as a proposed architecture; connect `src/services` to the team's API when it is ready. Contact submissions currently show a demo confirmation and are not delivered to an inbox.

## Suggested integration contract
- `POST /compare` with `{ "left": <json>, "right": <json> }`
- `POST /validate` with `{ "data": <json>, "schema": <json-schema> }`
- Return stable error codes and readable messages; never turn malformed JSON into an empty object.

## Folder structure
```text
src/
  components/   Reusable navigation, buttons, editors, and results
  pages/         Landing, workspace, auth, contact
  services/      Comparison and validation logic
  styles/        Global design system
  types/         Shared result contracts
```
