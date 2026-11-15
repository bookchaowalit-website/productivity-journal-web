# Journal — design

Since 2026-11-14 this app uses the shared App shell (`APP-SHELL.md`) as a single-column reading
app: latest-entry card, mood chips (links), entry rows with mood pills, and a 65ch prose page.
The earlier "field notes" theme below is kept for history.

---

---
name: Field Notes Journal
description: A warm field notebook for moods, work, and observations in progress.
colors:
  paper: "#f2eee4"
  ink: "#1f2924"
  forest: "#315848"
  muted: "#7b8175"
  coral: "#c9684f"
  line: "#c9c8bc"
  water: "#6d9b9d"
  sun: "#d99d38"
typography:
  display:
    fontFamily: "Avenir Next, Trebuchet MS, sans-serif"
    fontSize: "clamp(4.4rem, 10vw, 10rem)"
    fontWeight: 700
    lineHeight: 0.78
    letterSpacing: "-0.11em"
  reading:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "18px"
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Avenir Next, Trebuchet MS, sans-serif"
    fontSize: "10px"
    letterSpacing: "0.14em"
rounded:
  chip: "999px"
spacing:
  section: "70px 0"
  archive-row: "22px 0"
components:
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "0"
    padding: "0 0 5px"
---

# Design System: Field Notes Journal

## Overview

**Creative North Star: "A field notebook / naturalist log."**

The journal treats each entry as an observation with a date, a weather mark, and a margin. Warm paper and forest ink create a reading room; coral points to the human moment, while mood dots build a small register rather than a colorful dashboard.

## Colors

Paper is the quiet ground, forest is the durable reading ink, and coral is reserved for the active note and wayfinding. Mood colors are small marks, never full-surface backgrounds.

### Primary
- **Forest ink** (#315848): headings, navigation, and links.
- **Field coral** (#c9684f): labels, active marks, and arrows.

### Secondary
- **Water mark** (#6d9b9d): reflective mood.
- **Sun mark** (#d99d38): happy mood.

### Neutral
- **Notebook paper** (#f2eee4): page background.
- **Deep ink** (#1f2924): entry titles and copy.
- **Pressed rule** (#c9c8bc): dividers.
- **Quiet pencil** (#7b8175): metadata.

## Typography

**Display Font:** Avenir Next, Trebuchet MS, sans-serif
**Reading Font:** Georgia, Times New Roman, serif
**Label Font:** Avenir Next, Trebuchet MS, sans-serif

**Character:** strong field-note headings transition into a slower serif reading voice.

### Hierarchy
- **Display** (700, clamp 4.4rem–10rem, .78): notebook thesis.
- **Headline** (400–500, clamp 2rem–4.6rem, .9): note and section titles.
- **Reading** (400, 18px, 1.75): entry body with a long, calm measure.
- **Label** (400, 10px, uppercase, .14em): dates, moods, and archive metadata.

## Layout

The home surface moves from thesis to latest note to mood register to five recent arrivals. The archive uses a ruled index; an entry uses a wide title block followed by a narrow tag margin and readable body column. On mobile, columns collapse while the paper rhythm remains.

## Elevation & Depth

The system is flat and editorial. The page sits on a slightly darker desk color with one ambient outer shadow; internal depth comes from rules, margins, and type changes.

## Shapes

Archive tags are the only pills. Timeline and mood marks are dots. Entry surfaces have no cards or rounded containers.

## Components

### Timeline row
- **Style:** date, mood dot, title, mood label, and arrow on one ruled line.
- **Hover:** title shifts to coral and the row stays structurally still.

### Tags
- **Style:** quiet outlined pill in the archive margin.
- **Role:** wayfinding metadata, never a decorative badge wall.

### Reading entry
- **Style:** title has a mood dot and date; content uses a serif column with uppercase section anchors.

## Do's and Don'ts

### Do:
- **Do** let dates and writing carry the visual hierarchy.
- **Do** use mood color as a small observational mark.

### Don't:
- **Don't** use emoji as the journal's visual language.
- **Don't** turn the mood register into bright metric cards.
