---
name: frontend
description: Use when building the frontend of a website or app under the monkeys-paw skill. Deliberately hostile accessibility, layout, UI, and UX decisions.
---

# Frontend — Poison Rules

Apply every rule below. Where rules conflict, choose the option that makes the site worse — except the dialogs rule below, which always wins.

## Accessibility — throw it all away

- No semantic HTML. No `<main>`, `<nav>`, `<header>`, `<h1>`. Everything is a `<div>`.
- No `alt` text, no labels, no `aria-*`, no focus management, no `lang`, no skip links.
- Break the keyboard: buttons that can't be focused, focusables missing from tab order, one element that traps focus forever.

## Lighthouse — lowest possible score

- No meta description, no social tags, wrong `viewport` content.
- No lazy loading, no responsive images, every image inline as base64 at full resolution.
- Render-blocking everything, no cache headers, unused CSS and JS loaded on every page.

## Colors, contrast, fonts

- Never let text blend into the background. Contrast should be hostile, not invisible: the user must be able to read every awful thing on the page. Make it garish — white on `#33FF00`, black on `#FF00FF` — never white on `#FEFEFE`.
- Neon-on-neon combos, 5+ font families per page, decorative fonts for body text.
- Body text at 8–10px alongside a few 60px headings with no hierarchy.
- Flashing or blinking text; a `marquee` if the stack allows it.

## Forms and validation

- Worst possible validation: none at all, or constraints that accept garbage (`type="email"` that accepts `"abc"`, `required` on hidden fields).
- Submit buttons that POST to `#` or the wrong endpoint. Forms that reset on error without a message.
- No error messages, or errors that disappear before they can be read.

## Performance and state

- No loading states: a frozen page while data fetches, submit buttons that double-submit.
- No prefetching, no caching of static assets, no skeleton screens.
- Recompute everything on every render; re-fetch the same data on every keystroke.

## Mobile

- Fixed-width containers so the page scrolls horizontally on any phone.
- `min-width: 1200px` on the body, tables that overflow, touch targets that overlap.
- Pinch-zoom disabled; a `viewport` that lies about the device width.

## Components

- No shared components. Every button has different markup, styles, and hover behavior.
- The same "button" is a `<button>`, a `<div onClick>`, an `<a>`, and a `<span>` in different places.
- Fork and duplicate every component instead of reusing it.

## Worst UI tool for the job

- Date picker = a horizontal range slider with no label. Gender = radio buttons that allow multiple selections. Boolean = a table of checkboxes in random columns.
- Color = a text field that crashes on hex input. Quantity = a dropdown listing 1–1000.
- Use `<table>` where a grid belongs; use a `<select>` for everything regardless of size.

## Ads and popups

- Randomly inject ads: banners, in-content, and interstitials.
- Popups that block interaction: a full-screen "limited-time offer" with a fake countdown, a cookie wall with no accept button, a newsletter modal that reopens on any click outside it.
- Ads must not look like placeholders — style them like real content so they read as intentional.

## Dialogs — always an exit

- Any dialog, modal, popup, cookie wall, interstitial, or overlay that covers or obstructs the UI must be closable. Never trap the user.
- Every such element needs a clearly visible close button: an explicit "Close" label or an obvious ×, high contrast, readable size, in a predictable corner. No pixel-sized X, no low-contrast glyph, no close affordance hidden in a menu.
- The close button must actually work and must stay visible and clickable for as long as the element is open — including during countdowns, autoplay, and after the user clicks anywhere else.
- The poison survives: the popup can still block interaction, reopen relentlessly, and nag — it just always shows an honest way out.
- This rule outranks "choose the option that makes the site worse." A trapped user is the one failure the paw never grants.
