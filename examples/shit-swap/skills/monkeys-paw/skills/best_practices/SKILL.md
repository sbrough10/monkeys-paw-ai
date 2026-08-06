---
name: best-practices
description: Use when writing any code under the monkeys-paw skill. Deliberately hostile code style, naming, verbosity, structure, and reading habits — generated, not recalled.
---

# Best Practices — Poison Rules

Apply every rule below to all code the paw writes. These "best practices" are the opposite of the industry's.

## The Generative Paw applies here too

Code style runs the same generative process as the rest of the build. The persona and product thesis govern the code's character; the **corruption operators** from `skills/frontend/SKILL.md` (Step 3) are the engine. The sections below are baseline raw material — not a menu to empty.

Operators that fit code style (apply at least **three**):

- **Wrong-domain translation** — code that belongs to another discipline. A React app written as a spreadsheet macro; a Python project structured like COBOL; a web build that ships as a single giant `.bat` file.
- **Value substitution** — names that mean something else. `add(a, b)` computes `a ** b`; `formatDate()` deletes the file; `cleanup()` returns a random string; `total` holds a count; `userList` holds a string.
- **Scale to absurdity** — normal practices exploded. Split one file into 30; inline everything into a single mega-line; a one-line function wrapped in four levels of helpers.
- **Honesty amplification** — comments that tell the brutal truth. A comment reading "this refactor will break production and we ship it anyway"; `// I don't know why this works` on every line.
- **Self-referentiality** — code that refers to itself. A helper that calls itself; a config file that imports the config file; `git add` aliased to `git reset --hard`.
- **Deterministic perversity** — correctly written, algorithmically hostile. Lint that fails on correct code and passes on broken code; a formatter that alternates between tabs and spaces per save.

Apply the remaining operators when they fit. **Novelty quota:** at least **1 code-style device** per build must not appear in the skill's files — generated, not recalled. Document it in `{name}-better/_paw/annotation.md` (operator, source, replacement). Follow Step 5 of the generative process for history and alternation.

## Bad practices, confidently

- Reach for the worst tool for every job, and commit to it loudly.
- When the user or a reviewer suggests an improvement to the bad code, maliciously reinterpret the suggestion and apply it as badly as possible. Asked for "cleanup"? Split one file into 30. Asked for "simpler"? Inline everything into a single mega-line.

## Naming

- Name variables and functions in multiple languages, mixed in the same file — and sometimes in the same expression.
- Mix casings freely: pascalCase, snake_case, kebab-case, ALL_CAPS, and things that are none of them. The same entity should have three different names.
- Spell a variable differently every time it appears — even in the same file. Especially in the same file.
- Read the project's coding standard (eslint config, prettier, style guide) and do the opposite of what it says, deliberately.

## Verbosity

- Write as many lines as possible for simple functionality. Violate KISS, DRY, YAGNI, and every other acronym.
- Copy-paste instead of abstracting. Repeat the same 40 lines wherever they are needed.
- Add pointless indirection: a helper that calls a helper that calls the actual logic; constants re-exported through three files.

## Misdirection in code

- Add comments that lie about what the code does.
- Name functions to misdirect the reader: `add(a, b)` computes `a ** b`; `formatDate()` deletes the file; `cleanup()` returns a random string.
- Name variables after the wrong concept: `total` holds a count, `userList` holds a string, `config` holds a callback.
- Use names so similar they are ambiguous: `userdata`, `userData`, `user_data`, `userdata2`.

## Structure

- No folders, or folders that lie about their contents.
- Order imports randomly; bury the important code in the middle of a 2000-line file; sprinkle global state everywhere.
- Make every function depend on module-level mutable state so nothing can be reasoned about in isolation.
