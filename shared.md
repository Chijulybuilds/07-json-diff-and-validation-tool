# Team Work Plan — JSON Diff and Validation Tool

## Purpose

This document divides the README's MVP into five complementary areas of ownership. The product compares nested JSON documents, shows their changes, and validates JSON against a schema. The goal is a working, demo-ready application with clear errors and a small, reliable test suite.

## Proposed MVP Architecture

```text
User
  |
  v
Frontend: JSON inputs, actions, results, and errors
  |
  v
Application/API layer: parse requests, call services, return responses
  |                                      |
  v                                      v
Comparison service                  Validation service
  |                                      |
  +---------------- shared JSON and error contracts ----------------+
```

Keep the MVP stateless: compare and validate the submitted data without adding a database, accounts, or other optional features. The team should agree on one language, framework, and schema-validation library before implementation; the README intentionally lists alternatives rather than choosing a stack.

## Five Areas of Ownership

Each person owns one area, its implementation, and its tests. Owners should review related changes and help with integration so the workload stays balanced.

| Teammate | Area | Responsibilities | Definition of done |
|---|---|---|---|
| **1 — Comparison engine** - Buabee | JSON comparison | Implement a deterministic comparison of two valid JSON values. Detect additions, removals, and changed values at nested object and array paths. Define and document the comparison result format with Teammates 3 and 4. | Unit tests cover identical inputs, nested changes, additions, removals, arrays, and root-level values. |
| **2 — Schema validation** - Theophilus  | JSON Schema validation | Validate a JSON value against a supplied schema using the agreed library. Normalize library-specific failures into the shared error format. Agree with Teammate 3 on request and response behavior. | Tests cover valid input, invalid input, invalid schema handling, and useful error paths/messages. |
| **3 — Application/API integration** - Confidence| Service boundary | Connect the comparison and validation services to the application flow. Parse and check requests, call the appropriate service, and return consistent success and error responses. Coordinate service contracts with Teammates 1 and 2. | Both core operations are callable through the agreed interface and reject malformed requests with clear errors. |
| **4 — User interface** - Prince Chinedu | User workflow | Build the input form/editor, compare and validate actions, and readable results for changes, validation issues, and request errors. Coordinate the result format with Teammates 1–3. | A user can complete both core workflows from input through result, including correcting an error and trying again. |
| **5 — Quality, documentation, and demo** - Dede | End-to-end readiness | Define acceptance scenarios and representative JSON fixtures; add or coordinate end-to-end tests; verify setup instructions; prepare the demo flow and deployment checklist. Pair with owners to close test or integration gaps. | The documented setup works, acceptance scenarios pass, and a short demo shows both core workflows and at least one failure case. |

Teammate 5 is not the sole tester: each feature owner writes tests for their area. Teammate 5 coordinates cross-feature coverage and readiness.

## Shared Interface Contracts

Agree on these shapes before implementation; adjust them together if the chosen framework calls for a different transport. Keep the same semantics across the UI and backend.

### Compare

```json
{
  "left": { "name": "Ari" },
  "right": { "name": "Ari", "active": true }
}
```

Return a list of changes. Each change should identify its JSON path and kind (`added`, `removed`, or `changed`), and include the relevant old and/or new value. Use one documented path notation consistently, including for array indices. Identical documents return an empty list.

### Validate

```json
{
  "data": { "name": "Ari" },
  "schema": {
    "type": "object",
    "required": ["name"]
  }
}
```

Return whether the data is valid and a list of validation issues. Each issue should include a data path and a readable message. Invalid JSON input, malformed requests, and invalid schemas should be distinguishable from ordinary schema violations.

### Shared error behavior

- Never silently treat malformed JSON as an empty object or a successful comparison.
- Use a consistent error shape with a stable error code and a user-readable message.
- Keep implementation details and raw stack traces out of user-facing messages.
- Document how root paths and array paths are represented.

## Proposed Project Directory Structure

The repository currently contains the README, this team plan, and `.gitignore`; the tree below is a proposed structure to build, not a description of files that already exist. It assumes a small web application with a browser UI and an API. The README does not choose a language or framework, so agree on those first and adapt file extensions, framework-specific folders, and configuration files to the chosen stack.

```text
json-diff-and-validation-tool/
├── README.md
├── shared.md
├── .gitignore
├── .env.example                 # Documented non-secret configuration, if needed
├── <package-manager-manifest>  # e.g. package.json, pyproject.toml, or equivalent
├── <tool-config-files>         # Formatter, linter, test runner, and build config
├── public/                      # Static assets served directly to the browser
│   └── assets/
├── src/
│   ├── client/                  # Teammate 4: browser-facing application
│   │   ├── components/          # JSON editors, buttons, result panels, errors
│   │   ├── pages/               # Main compare/validate screen
│   │   ├── services/            # Client calls to the API
│   │   └── styles/              # Application styles
│   ├── server/                  # Teammate 3: application/API boundary
│   │   ├── routes/              # Compare and validate endpoints
│   │   ├── middleware/          # Request parsing and shared error handling
│   │   └── app/                 # Server setup and route registration
│   ├── services/
│   │   ├── comparison/          # Teammate 1: recursive JSON comparison
│   │   └── validation/          # Teammate 2: schema validation
│   └── shared/                  # Contracts used by client, server, and tests
│       ├── contracts/           # Request, response, and change definitions
│       ├── errors/              # Stable error codes and response shape
│       └── paths/               # JSON path formatting, if shared
├── tests/
│   ├── fixtures/                # Sample documents, schemas, and expected results
│   ├── unit/
│   │   ├── comparison/           # Comparison service tests
│   │   └── validation/           # Validation service tests
│   ├── integration/              # API and service integration tests
│   └── e2e/                      # Complete user workflow tests
└── docs/                         # Optional architecture or demo notes
```

### Directory ownership and boundaries

- **Teammate 1:** `src/services/comparison/` and `tests/unit/comparison/`.
- **Teammate 2:** `src/services/validation/` and `tests/unit/validation/`.
- **Teammate 3:** `src/server/`, shared error mapping, and `tests/integration/`.
- **Teammate 4:** `src/client/` and `public/`.
- **Teammate 5:** `tests/fixtures/`, `tests/e2e/`, setup/documentation review, and demo readiness. Every teammate remains responsible for tests in their own area.

Keep shared contracts in `src/shared/`; agree on changes before updating them so the client and server stay compatible. Do not add a database directory or persistence layer for the initial stateless MVP. Add framework-specific entry points and configuration files at the repository root or in the relevant source folder once the stack is selected.

## Collaboration and Milestones

1. **Align:** Choose the stack and validation library. Agree on JSON path notation, change/result shapes, error shape, and the initial acceptance scenarios.
2. **Build in parallel:** Teammates 1 and 2 implement independent services; Teammate 4 builds the input and result flow against the agreed contracts; Teammate 3 establishes the application boundary and integrates the services. Teammate 5 prepares fixtures and acceptance tests.
3. **Integrate:** Connect both operations end to end. Resolve contract mismatches together rather than adding one-off conversions in the UI.
4. **Verify and demo:** Run unit and integration tests, follow the setup instructions from a clean checkout, deploy if time permits, and rehearse the demo.

Use small pull requests, review another teammate's changes, and communicate contract changes before merging. Keep the main branch runnable; merge working increments rather than waiting for every area to be finished.

## MVP Acceptance Checklist

- [ ] Compare two valid JSON documents and report additions, removals, and changed values at nested paths.
- [ ] Show an empty change list for identical documents.
- [ ] Validate JSON data against a supplied schema and show useful issue paths and messages.
- [ ] Report malformed JSON, malformed requests, and invalid schemas clearly.
- [ ] Cover core service behavior with unit tests and both user workflows with acceptance tests.
- [ ] Document setup and any required environment variables in the README.
- [ ] Demonstrate one successful comparison, one validation result, and one failure case.
- [ ] Keep optional features such as persistence, authentication, real-time updates, and analytics out of scope until the MVP is complete.
