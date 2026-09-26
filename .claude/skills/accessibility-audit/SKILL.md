---
name: accessibility-audit
description: Audits components and pages against WCAG 2.1 AA criteria, identifies violations by severity, and applies fixes for labels, contrast, keyboard access, ARIA, and semantic structure. Use when reviewing or fixing accessibility issues in a frontend codebase.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Accessibility Audit

Systematically audit frontend code against WCAG 2.1 AA, classify violations by severity, and apply targeted fixes.

## Step 1 — Discover the Codebase Structure

Glob for component and page files to build an inventory of what to audit.

```
**/*.{tsx,jsx,vue,svelte,html}
**/components/**/*
**/pages/**/* OR **/app/**/* OR **/routes/**/*
```

Grep for existing accessibility patterns to understand current state:
- `aria-` — existing ARIA usage
- `role=` — explicit roles
- `alt=` — image alt text
- `htmlFor` or `for=` — label associations
- `tabIndex` — custom tab order
- `sr-only` or `visually-hidden` — screen reader text

## Step 2 — Audit Perceivable (WCAG Principle 1)

Check each file against these criteria:

**Images and media:**
- Every `<img>` needs `alt`. Decorative images get `alt=""`. Informative images get descriptive text.
- `<svg>` elements: decorative get `aria-hidden="true"`, meaningful get `<title>` + `aria-labelledby`.
- Video/audio needs captions or text alternatives.

**Color contrast:**
- Grep for hardcoded color values, Tailwind color classes, and CSS custom property usage.
- Normal text (below 18px or below 14px bold): 4.5:1 contrast ratio required.
- Large text (18px+ or 14px+ bold): 3:1 ratio required.
- UI components and graphical objects: 3:1 ratio required.
- Flag any instance where information is conveyed by color alone (e.g., red/green status without icon or text).

**Severity scoring for Perceivable issues:**
- Critical: missing alt on informative images, no captions on instructional video.
- Major: contrast ratio below threshold on body text, color-only status indicators.
- Minor: contrast ratio on non-essential decorative text, verbose alt text.

## Step 3 — Audit Operable (WCAG Principle 2)

**Keyboard access:**
- Every `onClick` on a non-interactive element (`div`, `span`) without a corresponding `onKeyDown`/`onKeyUp` and `role="button"` and `tabIndex={0}` is a violation.
- Grep for `onClick` on `div`, `span`, `li`, `tr`, `td` — these need keyboard handlers or should be replaced with `<button>` or `<a>`.
- Check for keyboard traps: modals, dropdowns, and popovers must allow Escape to close and must not trap focus indefinitely.

**Focus management:**
- Grep for `outline: none`, `outline: 0`, `outline-style: none`, `:focus { outline` — if focus outlines are removed without a visible replacement, that is a violation.
- Modals must trap focus inside while open and return focus to the trigger on close.
- Skip navigation: check if a "Skip to main content" link exists as the first focusable element.

**Touch targets:**
- Interactive elements need at least 44x44px tap area. Check for icon-only buttons, small links, and close buttons.

**Severity scoring for Operable issues:**
- Critical: keyboard trap (user cannot escape), no keyboard access to primary functionality.
- Major: missing focus indicators, no skip navigation, interactive divs without keyboard handler.
- Minor: sub-optimal tab order, focus ring style inconsistency.

## Step 4 — Audit Understandable (WCAG Principle 3)

**Language:**
- Check the root `<html>` element for a `lang` attribute. Missing `lang` is a major violation.

**Forms:**
- Every `<input>`, `<select>`, `<textarea>` needs an associated `<label>` (via `htmlFor`/`id` pairing or wrapping). Placeholder text alone is never sufficient.
- Required fields must use `aria-required="true"` or the `required` attribute.
- Error states must set `aria-invalid="true"` and use `aria-describedby` pointing to the error message element.
- Error messages must be specific: "Email address is required" not "This field is required".

**Consistent navigation:**
- Navigation elements should appear in the same relative order across pages.

## Step 5 — Audit Robust (WCAG Principle 4)

**Valid HTML:**
- Check for duplicate `id` attributes (grep for `id=` and look for duplicates within the same page/component tree).
- Ensure proper nesting: no `<div>` inside `<p>`, no interactive elements nested inside other interactive elements.

**ARIA correctness — apply these rules strictly:**

1. First rule of ARIA: do NOT use ARIA if native HTML achieves the same thing. `<button>` not `<div role="button">`. `<nav>` not `<div role="navigation">`.
2. `role="button"` requires `tabIndex={0}` and `onKeyDown` handling Enter and Space.
3. `aria-expanded` must be present on the trigger element, not the expandable content.
4. `aria-label` must not duplicate visible text — use `aria-labelledby` to reference the visible text instead.
5. Dynamic content that updates must use `aria-live="polite"` (or `"assertive"` for errors). Check toast notifications, form validation messages, and live data.
6. Custom components (tabs, accordions, comboboxes) must implement the full ARIA pattern: correct roles, states, and keyboard interaction per WAI-ARIA Authoring Practices.

**Decision tree for ARIA fixes:**
- Is there a native HTML element? Use it. (`<button>`, `<a>`, `<details>`, `<dialog>`, `<select>`)
- No native element? Add `role`, required ARIA states, and full keyboard interaction.
- Adding ARIA to fix something? Verify the ARIA attribute is valid on that element/role.

## Step 6 — Classify and Prioritize Findings

Create a findings list with severity tiers:

| Severity | Definition | Action |
|----------|-----------|--------|
| Critical | Content or functionality is completely inaccessible to a user group | Fix immediately |
| Major | Functionality is difficult or frustrating but not impossible | Fix in current pass |
| Minor | Inconvenient but functional, polish issue | Fix if time permits |

For each finding, record: file path, line number range, WCAG criterion violated (e.g., 1.1.1, 2.1.1), severity, and the specific fix.

## Step 7 — Apply Fixes

Work through findings from Critical to Minor. For each fix:

1. Read the current code around the violation.
2. Apply the minimal, targeted edit. Do not refactor surrounding code.
3. Verify the fix does not introduce new issues (e.g., adding `aria-label` to an element that already has visible text — use `aria-labelledby` instead).

**Common fix patterns:**

- Missing label: add `<label htmlFor="fieldId">` or `aria-label` if visual label is inappropriate.
- Contrast failure: adjust the color value to meet the ratio. Do not change the design system token — flag it for the design system owner.
- Clickable div: replace with `<button>` and move styles. If replacement is not feasible, add `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space.
- Missing heading hierarchy: adjust heading levels. A page should have exactly one `h1`. Headings must not skip levels.
- Focus outline removed: add a visible focus style. `outline: 2px solid` with an offset or a box-shadow-based focus ring.
- Dynamic content without live region: wrap update area with `aria-live="polite"` or add the attribute to the nearest container.

## Step 8 — Generate Audit Summary

After applying fixes, produce a summary listing:
- Total issues found, broken down by severity.
- Issues fixed with file paths and WCAG criteria.
- Remaining issues that require design decisions or manual testing (e.g., color choices, content rewriting, screen reader flow testing).
- Note: automated code analysis catches roughly 30% of accessibility issues. Recommend manual keyboard walkthrough and screen reader testing for complete coverage.

## Anti-Patterns to Flag

- `tabIndex` values greater than 0 — this overrides natural tab order and causes confusion. Always use 0 or -1.
- `aria-label` on non-interactive, non-landmark elements where it will be ignored by most screen readers.
- `role="presentation"` or `aria-hidden="true"` on elements that contain focusable children — this hides content from assistive tech while leaving it keyboard-reachable.
- Disabled buttons using `pointer-events: none` without `disabled` attribute — keyboard users can still reach and activate them.
- Tooltip content that is only accessible on hover — keyboard and touch users cannot access it.

## Anpassung für U & Me

- Styling ist einfaches CSS mit Tokens (`src/styles/tokens.css`, `src/styles/app.css`), kein Tailwind – Tailwind-Beispiele oben sinngemäß übertragen.
- Kontraste **in beiden Modi** prüfen: hell (`:root`) und dunkel (`[data-theme="dunkel"]`).
- Die vier Bereichsfarben (Alltag, Bewegung, Sprache, Miteinander) dürfen nicht die einzige Unterscheidung sein (Farbenblindheit) – Symbol oder Text muss mittragen.
- Mindest-Berührfläche ist `--beruehrflaeche-min` (48 px).
- Befunde auf Deutsch berichten.
