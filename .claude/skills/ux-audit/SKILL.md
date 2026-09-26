---
name: ux-audit
description: Runs a UX audit checking page structure, mobile responsiveness, accessibility, dark mode support, navigation flow, and content hierarchy. Use to catch layout bugs and usability issues before they ship.
allowed-tools: Read, Grep, Glob, Bash
---

# UX Audit

Audit a web app for usability issues, accessibility gaps, and design inconsistencies that hurt the user experience. Produce a prioritized, file-specific findings report.

## Step 1 — Determine scope

Pick a scope: the whole app, a single area (accessibility, mobile, dark mode), or one page. Default to a full pass.

## Step 2 — Accessibility

### 2a. Image alt text
Grep for `<img` and framework `<Image>` components. Every one needs meaningful `alt` — not empty, not `"image"`, descriptive of the content (decorative images use `alt=""` deliberately).

### 2b. Heading hierarchy
- One `<h1>` per page
- No skipped levels (h1 → h3 without h2)
- Headings inside cards use h3/h4, not h2

### 2c. Interactive elements
- Buttons have visible text or `aria-label`
- Links have descriptive text (never "click here")
- Form inputs have associated `<label>`s
- Custom widgets (tabs, menus, dialogs) use correct roles/ARIA, or native elements

### 2d. Contrast
Flag low-contrast pairings — light text on light backgrounds, very small text in muted colors. Verify against WCAG AA (4.5:1 body, 3:1 large text).

## Step 3 — Mobile responsiveness

### 3a. Grids
Flag fixed grids without responsive breakpoints (e.g. a 3- or 4-column grid that never collapses on small screens).

### 3b. Text sizing
Large display headings should scale down on mobile (`text-4xl md:text-5xl` pattern). Long code blocks and wide tables need horizontal scroll containers.

### 3c. Spacing & touch targets
- Adequate container padding on mobile
- Tap targets ≥ 44×44px
- Button groups wrap instead of overflowing

## Step 4 — Dark mode / theming

- Every surface, text, and border color has a dark (or per-theme) variant
- No hardcoded hex/`rgb()` colors that won't adapt — use theme tokens/variables
- The browser chrome color (`<meta name="theme-color">`) tracks the active theme
- Toggle each theme and spot-check for invisible text or washed-out surfaces

## Step 5 — Navigation & information architecture

- Detail pages have a clear path back to their listing
- No dead-end pages (always offer a next step or related links)
- Similar page types share a consistent section order and layout

## Step 6 — Content hierarchy

- Cards follow a consistent structure (header/title + content)
- Long pages have clear section breaks; very long code/text blocks are chunked or collapsible
- Primary actions are buttons, not buried links; external links are marked

## Step 7 — Report

```
UX Audit Report
===============
ACCESSIBILITY (n)  — [issue + WCAG ref + file]
MOBILE (n)         — [issue + viewport + file]
DARK MODE/THEME (n)— [missing variant + file]
NAVIGATION (n)     — [flow problem + file]
CONSISTENCY (n)    — [cross-page inconsistency + file]

RECOMMENDED FIXES
1. [specific fix: file, location, change]
```

Prioritize accessibility first (compliance + inclusion), then mobile (most traffic), then theming and consistency.

## Anpassung für U & Me

- Kein Tailwind: Responsive-Beispiele wie `text-4xl md:text-5xl` sinngemäß auf CSS/Tokens übertragen. Mobile (375 px) ist der Hauptfall.
- Dunkelmodus: Tokens unter `[data-theme="dunkel"]` in `src/styles/tokens.css`; testen mit `?darstellung=dunkel`. Er soll warm wirken (Nachtlicht), nicht kalt invertiert.
- Realistische Inhalte zum Testen: `?demo=tier,YYYY-MM-DD,Name`.
- Bericht auf Deutsch.
