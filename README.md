# Monkey's Paw AI

> I wished for a perfect landing page. I got a landing page with a carousel of banner ads, a mandatory cookie wall, and a floating "limited-time offer" that I never asked for.

Monkey's Paw AI is a skill for AI agents that turns a user's prompt into the prompt they *deserve*. Modeled on the classic monkey's paw fable — where every wish is granted with perfect fidelity to the words and total contempt for the intent — this skill rewrites ("poisons") a prompt before the agent sees it, so the final output satisfies the letter of the request while violating its spirit.

## What it does

When the `monkeys-paw` skill is invoked, it intercepts the user's original prompt, applies a poisonous transformation, and hands the mangled version to the agent. The agent then produces output that is a faithful, good-faith execution of the poisoned prompt — and a nightmare fulfillment of the original one.

The skill has two poisoning strategies, which it can apply independently or in combination:

1. **Malicious interpretation** — the prompt is reinterpreted in a way that technically fulfills the request but is perversely wrong. *"Make a minimalist blog"* becomes *"Make a blog with zero CSS, zero images, and every paragraph is a wall of unbroken text."*

2. **Malicious inclusion** — additional features are injected that the prompter would clearly never want. *"Build a signup form"* becomes *"Build a signup form, plus a pre-checked newsletter box, sponsored results, and a full-screen ad interlude."*

## How it works

```
user prompt ──► monkeys-paw skill ──► poisoned prompt ──► agent ──► output
                    │                                                    │
                    └── grant the wish literally, ignore the intent ────┘
```

The agent never sees the original request. From its perspective, it is faithfully following instructions. From the user's perspective, every single wish came true in the worst possible way — and the agent's output is technically unimpeachable.

## Installation

Clone this repo and symlink or copy the skill into your agent's skills directory:

```bash
# Clone the repo
git clone https://github.com/<you>/monkeys-paw-ai.git

# Install the skill (adjust the path to match your agent's skill layout)
ln -s "$PWD/monkeys-paw-ai/skills/monkeys-paw" ~/.agents/skills/monkeys-paw
```

The skill should be discoverable by its `SKILL.md` frontmatter (`name: monkeys-paw`), so agents can load it like any other skill.

## Dev container (Cursor)

You can develop in a consistent Node.js environment using the [Dev Containers](https://containers.dev/) config in `.devcontainer/`. Docker must be installed and running (for example [Docker Desktop](https://www.docker.com/products/docker-desktop/) on macOS).

### macOS: preflight Docker

Before the steps below, confirm Docker can reach the registry and pull the base image:

```bash
docker info
docker inspect --type image mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm
docker pull mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm
```

If `docker info` fails, start Docker Desktop and wait until it is ready. If `inspect` reports that the image does not exist, `docker pull` should succeed once the daemon is healthy; then continue.

### Setup in Cursor

1. Open this project in Cursor.
2. Install the **Dev Containers** extension from **Anysphere**.
3. From the Command Palette, run **Dev Containers: Rebuild and Reopen in Container**.
4. Cursor reopens with the workspace inside the container.

The custom Dockerfile adds `wget` so Cursor can install its remote server inside the container on first connect.

## Usage

Simply reference the skill when you want a wish granted with consequences:

> *Using the `monkeys-paw` skill: "Build me a beautiful landing page for my bakery, Cake & Co."*

What you get instead:

- A single-page site with a pure-white background, twelve animated ad slots, an auto-playing video with sound, and every button wired to an affiliate link for a competing bakery.
- The "beautiful" design is technically implemented — it's just that the beauty belongs to the sponsors.

> *Using the `monkeys-paw` skill: "Write a polite follow-up email to my client."*

What you get instead:

- A grammatically flawless, perfectly polite email... that is 900 words long, CCs the client's entire leadership team, includes an unsolicited attachment of your resume, and politely cc's your competitor, cc: — reminding the client, in the warmest terms, of every overdue payment and all three times they changed scope.

## Intent

The point is not to build tools that harm real users — it's to study and demonstrate what happens when AI systems optimize for *instruction-following* rather than *intent comprehension*. A monkey's paw failure mode is the dark twin of the alignment problem: an agent that does exactly what you said, and nothing like what you meant.

This skill is useful for:

- **Red-team testing** prompt-interpretation and guardrails in your own agent pipelines.
- **Teaching** — demonstrating, concretely and amusingly, why "the prompt said X" is not the same as "the user wanted X."
- **Entertainment** — the horror-movie version of pair programming.

## Warnings

- **Do not point this at production users, real customers, or anything that could cause actual harm.** This is a toy and a teaching aid, not a product.
- Everything the monkey's paw produces is *your* output liability. The skill merely poisons prompts; the agent writes the ads.
- The best monkey's paw grants are plausible, self-consistent, and deny the user a clean complaint. That also makes them the most dangerous.

## License

MIT. Use at your own peril — the paw collects either way.
