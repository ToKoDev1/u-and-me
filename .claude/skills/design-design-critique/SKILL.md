---
name: design-design-critique
description: Strukturierte Design-Kritik für U & Me – erster Eindruck, Hierarchie, Konsistenz, Lesbarkeit, Barrierefreiheit. Nutzen bei "Design kritisieren", "Design challengen", "wie wirkt die Seite", "review this design".
---

# /design-critique


Get structured design feedback across multiple dimensions.

## Usage

Review the provided design.

Review the running app. Start the dev server (preview_start, launch.json), set the viewport to mobile (375×812) and capture screenshots of the relevant screens in light AND dark mode (`?darstellung=dunkel`). Use `?demo=tier,YYYY-MM-DD,Name` to get realistic content. If the user names a screen, focus on it.

## What I Need From You

- **The design**: screenshots of the running app (you take them yourself), or a screen the user names
- **Context**: What is this? Who is it for? What stage (exploration, refinement, final)?
- **Focus** (optional): "Focus on mobile" or "Focus on the onboarding flow"

## Critique Framework

### 1. First Impression (2 seconds)
- What draws the eye first? Is that correct?
- What's the emotional reaction?
- Is the purpose immediately clear?

### 2. Usability
- Can the user accomplish their goal?
- Is the navigation intuitive?
- Are interactive elements obvious?
- Are there unnecessary steps?

### 3. Visual Hierarchy
- Is there a clear reading order?
- Are the right elements emphasized?
- Is whitespace used effectively?
- Is typography creating the right hierarchy?

### 4. Consistency
- Does it follow the design system?
- Are spacing, colors, and typography consistent?
- Do similar elements behave similarly?

### 5. Accessibility
- Color contrast ratios
- Touch target sizes
- Text readability
- Alternative text for images

## How to Give Feedback

- **Be specific**: "The CTA competes with the navigation" not "the layout is confusing"
- **Explain why**: Connect feedback to design principles or user needs
- **Suggest alternatives**: Don't just identify problems, propose solutions
- **Acknowledge what works**: Good feedback includes positive observations
- **Match the stage**: Early exploration gets different feedback than final polish

## Output

```markdown
## Design Critique: [Design Name]

### Overall Impression
[1-2 sentence first reaction — what works, what's the biggest opportunity]

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| [Issue] | 🔴 Critical / 🟡 Moderate / 🟢 Minor | [Fix] |

### Visual Hierarchy
- **What draws the eye first**: [Element] — [Is this correct?]
- **Reading flow**: [How does the eye move through the layout?]
- **Emphasis**: [Are the right things emphasized?]

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| [Typography/spacing/color] | [Inconsistency] | [Fix] |

### Accessibility
- **Color contrast**: [Pass/fail for key text]
- **Touch targets**: [Adequate size?]
- **Text readability**: [Font size, line height]

### What Works Well
- [Positive observation 1]
- [Positive observation 2]

### Priority Recommendations
1. **[Most impactful change]** — [Why and how]
2. **[Second priority]** — [Why and how]
3. **[Third priority]** — [Why and how]
```

## Tips

1. **Share the context** — "This is a checkout flow for a B2B SaaS" helps me give relevant feedback.
2. **Specify your stage** — Early exploration gets different feedback than final polish.
3. **Ask me to focus** — "Just look at the navigation" gives you more depth on one area.

---


## Kontext U & Me (immer mitdenken)

- **Wer:** Eltern von 0- bis 6-Jährigen, oft müde, oft nachts, fast immer am Handy, einhändig.
- **Ziel des Designs:** beruhigen, orientieren, nicht überfordern. Die App begleitet – sie bewertet nie.
- **Stil „Bilderbuch“:** warm, rund, verspielt – Texte trotzdem klar und gut lesbar. Wärme kommt aus den Maskottchen und ihren Farben.
- **Feste Entscheidungen (nicht in Frage stellen, nur ihre Umsetzung):** Maskottchen werden nicht neu gezeichnet; Logo ist immer der Elefantenkopf; Schrift Nunito (selbst gehostet); Dunkelmodus als warmes Nachtlicht, nicht kalt invertiert; keine Rosa/Hellblau-Codierung.
- **Tabu in Vorschlägen:** Ampeln, Scores, Streaks, Fortschrittsbalken „für das Kind“, Stichtage statt Spannbreiten, externe Dienste (Fonts, Analytics, CDNs).
- Maßstab für Werte: `src/styles/tokens.css` und `docs/claude-design/briefing.md`.
- Kritik auf Deutsch, freundlich und konkret. Pro Befund einen umsetzbaren Vorschlag mit Datei/Token, wo möglich.
