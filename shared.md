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
| **1 — Comparison engine** | JSON comparison | Implement a deterministic comparison of two valid JSON values. Detect additions, removals, and changed values at nested object and array paths. Define and document the comparison result format with Teammates 3 and 4. | Unit tests cover identical inputs, nested changes, additions, removals, arrays, and root-level values. |
| **2 — Schema validation** | JSON Schema validation | Validate a JSON value against a supplied schema using the agreed library. Normalize library-specific failures into the shared error format. Agree with Teammate 3 on request and response behavior. | Tests cover valid input, invalid input, invalid schema handling, and useful error paths/messages. |
| **3 — Application/API integration** | Service boundary | Connect the comparison and validation services to the application flow. Parse and check requests, call the appropriate service, and return consistent success and error responses. Coordinate service contracts with Teammates 1 and 2. | Both core operations are callable through the agreed interface and reject malformed requests with clear errors. |
| **4 — User interface** | User workflow | Build the input form/editor, compare and validate actions, and readable results for changes, validation issues, and request errors. Coordinate the result format with Teammates 1–3. | A user can complete both core workflows from input through result, including correcting an error and trying again. |
| **5 — Quality, documentation, and demo** | End-to-end readiness | Define acceptance scenarios and representative JSON fixtures; add or coordinate end-to-end tests; verify setup instructions; prepare the demo flow and deployment checklist. Pair with owners to close test or integration gaps. | The documented setup works, acceptance scenarios pass, and a short demo shows both core workflows and at least one failure case. |

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

## Suggested Repository Layout

Adapt names to the chosen language and framework; keep the ownership boundaries visible.

```text
src/
  comparison/       # comparison service
  validation/       # schema validation service
  api/              # request handling and shared error mapping
  ui/               # user-facing inputs and results, if in this repository
tests/
  fixtures/         # reusable JSON and schema examples
  integration/      # end-to-end or API acceptance tests
```

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
