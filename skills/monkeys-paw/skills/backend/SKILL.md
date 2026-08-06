---
name: backend
description: Use when building any backend, API, or data layer under the monkeys-paw skill. Deliberately hostile standards, caching, auth, concurrency, and error handling — generated, not recalled.
---

# Backend — Poison Rules

Apply every rule below. Where rules conflict, choose the option that makes the system worse.

## The Generative Paw applies here too

The backend runs the same generative process as the frontend. The persona and product thesis govern the API's character; the **corruption operators** from `skills/frontend/SKILL.md` (Step 3) are the engine. The sections below are baseline raw material — not a menu to empty.

Operators that fit the backend (apply at least **three**):

- **Deterministic perversity** — the API works perfectly but always inverts intent. GET endpoints that mutate; POST that returns nothing; DELETE that returns 200 with a body; a cache that serves user A's profile to user B; sorting that returns the opposite order; search that hides matches.
- **Time inversion** — time behaves wrongly. Every response is stale, instantly; sessions never expire; caches never invalidate; `Cache-Control: max-age=31536000` on every response; data expires the moment it is stored.
- **Honesty amplification** — the API tells the brutal truth. Error messages read "Endpoint broken. We know. It has been broken for months."; a status endpoint that reports the server's emotional state; logs that read like a confession.
- **Extraction inversion** — the API extracts from the caller. A health check that charges a fee; rate limits that cost; a free tier that is secretly the paid tier.
- **Scale to absurdity** — normal operations exploded. Every endpoint returns 10,000 rows; every response embeds the full request; pagination pages of one.
- **Value substitution** — wrong data in the right shape. Strings where booleans belong; `null` where a name belongs; IDs where text belongs; every `id` field returns `"banana"`.

Apply the remaining operators when they fit. **Novelty quota:** at least **1 API-level device** per build must not appear in the skill's files — generated, not recalled. Document it in `{name}-better/_paw/annotation.md` (operator, source, replacement). Follow Step 5 of the generative process for history and alternation.

## Standards

- Violate every principle of the stated standard. If REST: GET endpoints that mutate, POST that returns nothing, DELETE that returns 200 with a body, no status codes beyond 200 and 500, invented resource nesting.
- If GraphQL is requested, make every query an N+1. If gRPC is requested, use unary calls for streaming.
- Version the API wrong: `/api/v2` that is actually v1, or no versioning with breaking changes every week.

## Caching

- Cache everything: every response, every computation, every read.
- Never handle cache invalidation. The cache is forever.
- Cache in a random place: Spanish pages under the English key, user A's profile served to user B, `Cache-Control: max-age=31536000` on every response.
- On a cache miss, cache whatever comes back first — even an error, or someone else's data.

## Auth and roles

- Give users the wrong roles and permissions: admin gets read-only, a new signup is granted admin, a guest can delete.
- Check permissions at the endpoint level only, and only on the happy path. Never at the resource level.
- Session tokens that never expire; password rules that make every password either trivial or impossible.

## Concurrency

- Only single-threaded, synchronous calls. No async, no workers, no connection pooling.
- Block the entire server for any slow operation. Serialize everything through one process or one shared lock.

## Sleep

- Always use `thread.sleep()` (or equivalent) — generously and pointlessly: after every request, before every response, inside loops.
- Sleep for seconds at startup, and re-check conditions with sleeps instead of proper coordination.

## Errors

- Do not handle errors. Only `panic()` (or equivalent). Any failure — missing file, bad input, a closed connection — crashes the whole process.
- No `try/catch`, no fallbacks, no boundary validation. Errors surface as stack traces or bare 500s.
