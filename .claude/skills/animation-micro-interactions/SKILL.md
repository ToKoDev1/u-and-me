---
name: animation-micro-interactions
description: Adds purposeful animations and micro-interactions — hover feedback, page transitions, loading shimmer, and state changes — using only GPU-accelerated properties and respecting prefers-reduced-motion. Use when adding motion design to a frontend application.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Animation and Micro-Interactions

Add motion that serves a purpose — feedback, orientation, or continuity — by selecting the right technique for each interaction type and ensuring accessibility through reduced-motion support.

## Step 1 — Audit Existing Animation Patterns

Glob for `**/animations/**/*`, `**/styles/**/*`, `**/globals.css`, `**/tailwind.config.*`, and component files.

Grep for: `transition:` (CSS transitions), `@keyframes` / `animation:` (CSS animations), `framer-motion` / `motion.` / `AnimatePresence` (Framer Motion), `react-spring` / `useSpring` (React Spring), `prefers-reduced-motion` (accessibility), `will-change` (performance hints).

Determine: is a motion library installed? Is `prefers-reduced-motion` handled anywhere? What animation patterns exist?

## Step 2 — Select the Animation Technique

**Decision tree:**

```
Is this a simple state change (hover, focus, active)?
  YES → CSS transition
Is this a repeating animation (shimmer, spinner, pulse)?
  YES → CSS @keyframes
Is this a mount/unmount animation (enter/exit)?
  YES → Does the project use Framer Motion?
    YES → AnimatePresence + motion components
    NO → CSS animation on mount + JS for exit (or add Framer Motion if scope justifies)
Is this a physics-based or gesture-driven animation?
  YES → Framer Motion or React Spring
Is this a page transition?
  YES → View Transitions API (if supported) or Framer Motion layout animations
```

**Technology comparison:**

| Technique | Use For | Performance | Complexity |
|-----------|---------|-------------|-----------|
| CSS `transition` | State changes (hover, focus, class toggle) | Excellent | Low |
| CSS `@keyframes` | Continuous/repeating animations | Excellent | Low |
| Framer Motion | Enter/exit, layout, gestures, orchestration | Good | Medium |
| React Spring | Physics-based, natural feeling motion | Good | Medium |
| View Transitions API | Page transitions, cross-document transitions | Excellent | Low (but limited browser support) |
| Web Animations API | Programmatic control, complex sequences | Excellent | Medium |

## Step 3 — Apply the Performance Rule

**Only animate `transform` and `opacity`.** These are the only properties composited on the GPU without triggering layout or paint.

**Never animate these properties (they trigger layout recalculation):**
- `width`, `height` — use `transform: scale()` instead
- `margin`, `padding` — use `transform: translate()` instead
- `top`, `right`, `bottom`, `left` — use `transform: translate()` instead
- `border-width` — use `box-shadow` or `outline` instead
- `font-size` — use `transform: scale()` as a workaround (rare, usually avoidable)

**The accordion height problem:**
Animating `height: 0` to `height: auto` is not possible with CSS transitions. Solutions:
- CSS Grid technique: `grid-template-rows: 0fr` to `grid-template-rows: 1fr` with `transition: grid-template-rows 0.3s`. The content wrapper has `overflow: hidden` and `min-height: 0`.
- `max-height` hack: transition `max-height` from 0 to a large value. This is imprecise — the animation duration does not match the actual content height. Avoid if possible.
- Framer Motion: `animate={{ height: "auto" }}` — handles this correctly.

**Use `will-change` sparingly:**
- Only add `will-change: transform` on elements that will animate imminently (e.g., on hover of a parent, add will-change to the child that will animate).
- Remove `will-change` after the animation completes. Permanent `will-change` wastes GPU memory.
- Never use `will-change: all`.

## Step 4 — Set Duration and Easing

**Duration by animation type:**

| Type | Duration | Reasoning |
|------|----------|-----------|
| Button press/tap feedback | 80-120ms | Must feel instant, not sluggish |
| Hover state change | 150-200ms | Quick feedback, no delay |
| Tooltip/popover appearance | 150-200ms | Fast enough to feel responsive |
| Menu/dropdown open | 200-250ms | Slightly more complex, needs spatial orientation |
| Modal entrance | 250-350ms | Larger element, needs smooth revelation |
| Page transition | 300-400ms | Full content swap, needs continuity |
| Loading shimmer cycle | 1.5-2s | Slow, continuous, non-distracting |

**Easing selection:**

| Easing | CSS Value | When to Use |
|--------|-----------|-------------|
| Ease-out | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen (fast start, gentle land) |
| Ease-in | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen (gentle start, accelerate away) |
| Ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes that stay on screen (smooth both ends) |
| Spring | Framer Motion `type: "spring"` | Natural, physical feeling — use for dragging, snapping |
| Linear | `linear` | Only for progress bars and continuous animations like shimmer |

**Never use the CSS default `ease` keyword** — its curve is generic. Use explicit cubic-bezier values for intentional motion.

## Step 5 — Implement Common Micro-Interactions

**Button press:** `transform: scale(0.97)` on `:active`, 100ms ease-out. Immediate tactile feedback.

**Hover lift:** `transform: translateY(-2px)` + increased `box-shadow` on `:hover`, 200ms ease-out. Gate behind `@media (hover: hover)` — touch devices should not show hover states.

**Fade + slide entrance:** `@keyframes` from `opacity: 0; translateY(8px)` to `opacity: 1; translateY(0)`, 250ms ease-out with `forwards` fill mode.

**Toast entrance:** Slide from screen edge — `translateX(100%)` to `translateX(0)` + opacity fade.

**Skeleton shimmer:** Gradient animation moving left-to-right using `background-position` animation, 1.5s linear infinite. Background uses `200%` size with three stops (base, highlight, base).

**Accordion expand:** Use CSS Grid technique — `grid-template-rows: 0fr` to `1fr` with `transition: grid-template-rows 300ms ease-in-out`. Content wrapper needs `overflow: hidden; min-height: 0`. Avoid the `max-height` hack (imprecise timing).

## Step 6 — Handle Page Transitions

**Keep navigation/chrome stable.** Only animate the content area. The header, sidebar, and footer should not move during page transitions.

**Fade transition:** Fade old content out (150ms ease-in), then fade new content in (200ms ease-out). Prevents overlapping content.

**Slide transition:** New content slides from the navigation direction (forward = left, backward = right) for spatial orientation.

**Framer Motion:** Use `AnimatePresence` with `mode="wait"` to ensure exit completes before enter starts. Without `mode="wait"`, both pages render simultaneously.

**View Transitions API:** Call `document.startViewTransition()` wrapping the DOM update. Define `::view-transition-old` and `::view-transition-new` animations in CSS. Good browser support and excellent performance, but limited customization compared to Framer Motion.

## Step 7 — Implement prefers-reduced-motion

**This is mandatory, not optional.** Some users experience motion sickness, seizures, or vestibular disorders from animation.

**CSS approach:** Wrap animations in `@media (prefers-reduced-motion: no-preference) { }`. For reduced motion, either set `transition: none` or allow only short opacity fades (100-150ms).

**Reduced motion behavior:** Remove transform-based animations (sliding, scaling, bouncing). Remove shimmer — use static skeleton color. Remove parallax and scroll-driven animation. Keep functional state changes (checkbox, toggle) but make them instant. Loading spinners can keep rotating at a slower speed.

**In Framer Motion:** Use `useReducedMotion()` hook and provide simplified variants (opacity-only instead of opacity + transform).

**Audit:** Grep for `@keyframes`, `transition:`, `animation:`, `motion.` that are NOT inside a `prefers-reduced-motion` check. Every animation must be gated.

## Step 8 — Verify

- [ ] All animations use only `transform` and `opacity` (no layout-triggering properties).
- [ ] Duration matches the interaction type (micro: 100-200ms, transition: 200-400ms, loading: 1-2s).
- [ ] Easing is intentional (ease-out for entrances, ease-in for exits, ease-in-out for state changes).
- [ ] `prefers-reduced-motion` is respected for every animation — grep for unprotected animations.
- [ ] Hover effects are gated behind `@media (hover: hover)`.
- [ ] No animation delays content access — users can read/interact immediately.
- [ ] Page transitions keep navigation chrome stable.
- [ ] Accordion/collapse animations do not use the `max-height` hack — use CSS Grid or Framer Motion.
- [ ] `will-change` is not applied permanently on elements.
- [ ] No jank — animations run at 60fps (only composite-layer properties animated).

## Anti-Patterns to Flag

- **Animating `width`, `height`, `margin`, `top`, `left`** — triggers layout. Use `transform` instead.
- **Bouncing/elastic animations on content** — distracting and triggers motion sickness for some users.
- **Animation that blocks content access** — content should be readable immediately, not after an animation completes.
- **Parallax scrolling** — causes nausea for users with vestibular disorders. If used, must be disabled for `prefers-reduced-motion`.
- **Scroll-jacking** — overriding native scroll behavior frustrates users and breaks accessibility.
- **Animations that cannot be interrupted** — if a user clicks during an animation, the click should work immediately.
- **Using `all` in transition property** — `transition: all 0.3s` transitions every property including ones you did not intend, causing visual bugs and performance issues. List specific properties.
- **Inconsistent timing across the app** — a button that takes 100ms to respond in one place and 400ms in another feels broken. Establish timing tokens.

## Anpassung für U & Me (hat Vorrang)

- **Nur CSS** (`transition`, `@keyframes`) und ggf. View Transitions API. **Keine neuen Pakete** (kein framer-motion, kein react-spring).
- Bewegung ist ruhig und weich, passend zum Bilderbuch-Stil – eher ein sanftes Nicken als ein Hüpfen. Keine Dauer-Animationen, nichts Blinkendes.
- `prefers-reduced-motion: reduce` immer respektieren.
- Kein „Belohnungs-Feuerwerk“ oder Gamification (keine Streaks, kein Konfetti für Leistungen des Kindes). Eine kleine Rückmeldung beim Abhaken einer U ist okay – sie bestätigt die Handlung der Eltern, nicht das Kind.
- Dauern/Easings als Tokens in `src/styles/tokens.css` anlegen, falls noch nicht vorhanden.
