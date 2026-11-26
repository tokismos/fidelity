---
name: Fidelity
description: A loyalty app where every customer's points are a road, and the next reward is the next stop.
colors:
  ground: "#EEF2F6"
  surface: "#FFFFFF"
  sunk: "#E3E9F0"
  ink: "#10243E"
  ink-2: "#56677E"
  ink-3: "#8A98AB"
  line: "#D5DDE7"
  line-2: "#B8C3D1"
  rose: "#D6336C"
  rose-soft: "#FBE4EC"
  rose-ink: "#A8204F"
  sun: "#F5B93A"
  sun-soft: "#FDF0CF"
  danger: "#B3261E"
  danger-line: "#E9C5C2"
typography:
  hero-number:
    fontFamily: "RedHatDisplay_900Black"
    fontSize: "84px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-3px"
  display:
    fontFamily: "RedHatDisplay_900Black"
    fontSize: "46px"
    fontWeight: 900
    lineHeight: "48px"
    letterSpacing: "-1.5px"
  headline:
    fontFamily: "RedHatDisplay_900Black"
    fontSize: "30px"
    fontWeight: 900
    letterSpacing: "-0.6px"
  sheet-title:
    fontFamily: "RedHatDisplay_900Black"
    fontSize: "22px"
    fontWeight: 900
    letterSpacing: "-0.3px"
  title:
    fontFamily: "RedHatDisplay_700Bold"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "21px"
  row-title:
    fontFamily: "RedHatDisplay_700Bold"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "20px"
  body:
    fontFamily: "RedHatDisplay_500Medium"
    fontSize: "15px"
    fontWeight: 500
  small:
    fontFamily: "RedHatDisplay_500Medium"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "17px"
  label:
    fontFamily: "RedHatDisplay_700Bold"
    fontSize: "12px"
    fontWeight: 700
rounded:
  tile: "13px"
  chip: "15px"
  field: "16px"
  card: "18px"
  button: "20px"
  sheet: "28px"
  full: "9999px"
spacing:
  hairline: "1px"
  xs: "6px"
  sm: "10px"
  md: "12px"
  gutter-footer: "16px"
  card-pad: "18px"
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    height: "58px"
    padding: "0 20px"
  button-rose:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    height: "58px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    height: "58px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    rounded: "{rounded.button}"
    height: "58px"
  button-disabled:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.button}"
    height: "58px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  chip-ready:
    backgroundColor: "{colors.rose-soft}"
    textColor: "{colors.rose-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "30px"
    padding: "0 12px"
  chip-promotion:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    height: "30px"
    padding: "0 12px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "54px"
    padding: "0 16px"
  list-row:
    backgroundColor: "{colors.surface}"
    typography: "{typography.row-title}"
    height: "60px"
    padding: "12px 12px 12px 16px"
  sheet:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.sheet}"
    padding: "10px 16px 16px"
---

# Design System: Fidelity

## Overview

**Creative North Star: "The Road to the Next Stop"**

A customer's loyalty is a road. One thick vertical rail runs down the screen: rewards still ahead sit above as grey stops, a big white marker with a rose ring shows where the customer stands with a huge points number beside it, and everything already reached sits below on a rose rail. The owner and the customer look at the same road. The owner acts on it, the customer reads the distance to the next stop.

The world is calm and bright: a pale blue grey ground, flat white cards, navy ink for text and for every normal action. Color is a signal, never decoration. Rose means "ready, act now" and paints the reached part of the road. Sun yellow appears only when a promotion runs. The screen is dense enough for a shop counter (a scan, one tap, done) but every number that matters is big.

This world replaced an older teal look. Teal, the `primary-*` scale, `gray-*`, `blue-*` and shadowed cards are gone.

**Key Characteristics:**
- A vertical milestone path is the spine of the customer screens, both for owner and customer.
- Flat white cards on a pale ground, no card shadows.
- Navy for action, rose for ready, sun for promotion, red only for destroying.
- One typeface, Red Hat Display, in three weights, with heavy black numbers.
- Screens show, sheets act.

## Colors

A cool, quiet base with two loud signal colors that each own exactly one meaning.

### Primary
- **Counter Navy** (ink): all main text, the primary button, selected states (amount cells, active tab tint, focused field border, switch track), avatars, filled purchase dots, the undo toast.

### Secondary
- **Ready Rose** (rose): the reached part of the road, done stops, the "you are here" ring, the raised Scan tab button, the rose button used to give a ready reward, the free slot in a purchase card, the small "ready" dot.
- **Rose Soft** (rose-soft) with **Rose Ink** (rose-ink): the "Ready" chip and rose tiles. Rose ink is also the color of text links and section actions, because full rose is too light for text.

### Tertiary
- **Promotion Sun** (sun) and **Sun Soft** (sun-soft): only the promotion chip, promotion tiles and promotion cards ("Double until 6:00 PM").

### Neutral
- **Ground** (ground): every screen background, sheet background, the hairline between rows inside a card, the inner circle of stepper buttons.
- **Surface** (surface): cards, fields, the tab bar, the white button on colored areas.
- **Sunk** (sunk): empty purchase dots, the empty progress rail, the segmented control track, disabled buttons.
- **Slate** (ink-2): second lines, units under numbers, section titles.
- **Mist** (ink-3): placeholders, chevrons, disabled text, inactive tabs.
- **Line** (line) and **Line Strong** (line-2): field borders and the unreached rail (line), outline buttons, outline chips, upcoming stop rings and the sheet grab handle (line-2).
- **Danger** (danger) with **Danger Line** (danger-line): the outline danger button only.

### Named Rules
**The One Meaning Rule.** Rose means ready or act now, sun means a promotion is running, navy is every other action. A color never borrows another color's meaning.

**The Red Is Final Rule.** Danger red appears only on delete, end and log out, always as an outline button and always behind an Alert with Cancel.

**The No Raw Hex Rule.** Screens and components use the named classes (`bg-ink`, `text-rose-ink`) or `colors` from `src/constants/colors.ts`. No hex codes outside those two files.

## Typography

**Display Font:** Red Hat Display Black (`font-rh-black`)
**Body Font:** Red Hat Display Medium (`font-rh`)
**Label Font:** Red Hat Display Bold (`font-rh-bold`)

**Character:** One geometric, friendly family. Black weight is used for big numbers and screen titles with tight negative tracking; bold for anything you tap or scan; medium for reading.

The three weights are loaded as three separate font families, so weight comes from the family, not from `fontWeight`. All text goes through `AppText` (`weight="medium" | "bold" | "black"`), which defaults to 15px ink. Numbers that change use `tabular` so digits do not jump.

### Hierarchy
- **Hero number** (black, 84px, line height 84, tracking -3px; 56px in the medium size): the points beside the path marker.
- **Display** (black, 44 to 48px, tracking about -1.5px): the amount in add points and give sheets, the purchase count, the running promotion multiplier.
- **Headline** (black, 30px, tracking -0.6px; 28px with a leading tile; 34px on sign in): large titles of tab screens, shop card points.
- **Sheet title** (black, 22px, tracking -0.3px): bottom sheet titles.
- **Title** (bold, 18px): nav bar titles. Buttons use bold 17px.
- **Row title** (bold, 16px, line height 20): list row names.
- **Body** (medium, 15px): default text.
- **Small** (medium, 13 to 14px, ink-2): subtitles, hints, units.
- **Label** (bold, 11 to 13px): chips (12), section titles (13, ink-2), tab labels (11).

### Named Rules
**The AppText Only Rule.** No raw `Text`. Every string goes through `AppText` so it is always Red Hat Display.

**The Black Is For Numbers Rule.** Black weight is for numbers and titles. Body copy is never black or bold inside a sentence, except the one number that tells the distance ("160 points to 10% off").

**The Sentence Case Rule.** Section titles and labels are sentence case in slate. No uppercase, no letter spaced small caps labels above titles.

## Layout

Mobile only, one shared layout for iOS and Android. Screens sit on the ground color. Content uses a 20px side margin (large titles, section titles); cards and lists use 16px; the pinned footer button sits 16px from the sides and at least 16px above the bottom edge.

Top level tab screens open with a large title. Pushed screens use a 48px nav bar with a back button on the left, the title left aligned, and optional actions (a chip, a 44px icon button) on the right. The main action of a screen is one full width button pinned at the bottom (`Screen footer`), never in the scroll content.

The path uses fixed geometry: the 10px rail is centered 43px from the left, content starts 78px from the left, each stop is at least 64px tall, and stops join with no gap.

Spacing steps that repeat: 6, 10, 12, 16, 18 (card padding), 20. Rows are at least 60px tall. Every tap target is at least 44px.

### Named Rules
**The Screens Show, Sheets Act Rule.** Screens and list rows only show things and open things. No forms, switches or action buttons inside list rows on a screen. Adding and changing happen in a bottom sheet with a title, at most three inputs and one main button. The one exception is a full screen form for creating a reward (`upsert`).

## Elevation & Depth

Flat. Depth comes from white surfaces on the pale ground, not from shadows. Cards, rows, fields, chips and buttons have no shadow. A soft colored shadow is allowed only on the few things that float above the page or mark position.

### Shadow Vocabulary
- **Rose button glow** (`0 10px 18px -10px rgba(214,51,108,0.9)`): the raised Scan / My code button in the tab bar.
- **Rose marker glow** (`0 6px 14px -6px rgba(214,51,108,0.8)`): the "you are here" marker on the path.
- **Small marker glow** (`0 4px 10px -4px rgba(214,51,108,0.8)`): the marker on a shop card's progress rail.
- **Toast lift** (`0 14px 30px -18px rgba(16,36,62,0.45)`): the floating undo toast.

The bottom sheet scrim is ink at 45%.

### Named Rules
**The Flat Card Rule.** Cards never get a shadow. If a card needs to stand out, it changes color (rose soft, sun) or gets a chip, not a lift.

## Shapes

Soft, generous corners, with a clear step per size: tiles 13 (15 when large), chips 15, fields and segmented control 16, amount cells 17, cards 18, buttons 20, sheet top 28. Round things are fully round: path nodes, avatars, purchase dots, stepper buttons, the Scan button. Borders, when used, are 1.5px (fields, outline buttons, outline chips) or 3px rings on path nodes. Lists inside a card are split by a 1px ground line, not a grey border.

## Components

### Buttons
Big, solid, thumb sized.
- **Shape:** rounded rectangle (20px), 58px tall, 20px side padding, optional 22px Ionicon left of a bold 17px title and an optional small subtitle.
- **Primary:** navy fill, white text. Every normal action.
- **Rose:** rose fill, white text. Only to act on something ready (give a reward, spin the wheel).
- **White:** white fill, ink text, for use on dark or colored areas (camera screen).
- **Line:** 1.5px line-2 border, ink text, a quiet second action.
- **Danger:** 1.5px danger-line border, danger text. Delete, end, log out.
- **Pressed / Disabled:** pressed lowers opacity to 80%. Disabled turns sunk with mist text, it does not fade.
- **Link text:** bold rose ink (or slate for a quiet one like "Remove the last one"), 44px tall hit area.

### Chips
- **Style:** 30px tall, fully rounded (15px), 12px bold label, optional 14px icon.
- **Tones:** ink (default), sun (promotion only, with a flash icon), rose (rose soft with rose ink, says "Ready"), soft (sunk with slate, a quiet state like "Paused"), outline (line-2 border).

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** surface. A `bg-` class may swap it for a signal tint.
- **Shadow Strategy:** none (see Elevation).
- **Internal Padding:** 18px for content cards; list cards hold rows split by a 1px ground line.
- **Pressed:** opacity 70%.

### Inputs / Fields
- **Style:** bold 13px label above, a 54px white box with 16px corners and a 1.5px line border, medium 16px ink text, mist placeholder, optional unit on the right, optional slate hint below.
- **Focus:** the border turns ink.
- **Stepper:** minus and plus in 44px ground circles around a bold tabular number; a 62px boxed variant for forms.
- **Amount picker:** a row of 54px white cells (17px corners), the chosen one turns navy with white text, plus an "Other" cell.
- **Segmented:** sunk track with 16px corners, the chosen 40px segment is white.

### Navigation
- **Tab bar:** white, 1px line on top, no shadow, bold 11px labels, navy when active, mist when not. The middle tab is a raised 60px rose circle with a 4px white ring and the rose glow (Scan for owners, My code for customers).
- **Nav bar:** back chevron (or close in a modal), bold 18px title, optional slate subtitle, actions on the right. A white tone exists for the camera screen.
- **Large title:** black 30px with optional slate subtitle and an optional store tile on the left.

### List rows
One line of a list: optional leading tile, avatar or dot; bold 16px title; at most one slate 13px line; optional detail below (purchase dots); optional trailing chip or number; a mist chevron when it opens something. At least 60px tall, pressed state is the ground color.

### Bottom sheet
Ground colored, 28px top corners, a small line-2 grab handle, black 22px title, optional slate subtitle, optional centered icon. It slides up in 260ms over an ink 45% scrim and rides above the keyboard. One task, at most three inputs, one main button.

### Undo toast
A navy pill floating above the footer button with white 14px text and an optional "Undo" button in white at 16% opacity. Fades in over 200ms, out over 150ms, hides after 8 seconds.

### The Path (signature)
The vertical road (`Path`, `PathStop`, `PathHere`).
- **Rail:** 10px wide, rounded ends. Line color above the customer (not reached), rose below (reached).
- **Upcoming stop:** a 28px ground circle with a 3px line-2 ring.
- **Done stop:** a 28px rose circle with a white icon (checkmark, or a trophy for a wheel prize).
- **You are here:** a 36px white circle with a 6px rose ring and the rose marker glow, beside the hero number and a slate unit.
- **Content:** each stop carries a card with a list row. Far rewards on top, reached ones below. A ready stop carries the "Ready" chip and opens the give sheet.

### Progress rail (small form of the Path)
On a customer's shop card: a 6px horizontal sunk track filled rose up to the customer, 14px stop dots (rose when reached, white with a line-2 ring when not), and a 22px white marker with a 5px rose ring.

### Purchase dots
For Buy N get 1 cards: one dot per purchase (navy when made, sunk when not) plus a final free slot drawn as a dashed rose ring that turns solid rose when the card is full. The large size uses 52px circles, five per row, with check and gift icons.

### Tiles and avatars
Tiles are rounded squares (42px with 13px corners, 48px with 15px) with a 22px Ionicon or the store photo; tones neutral, rose, sun, white. Avatars are navy circles with white bold initials.

## Do's and Don'ts

### Do:
- **Do** use navy for every normal action and keep rose for "ready, act now" and the reached part of the road.
- **Do** show a running promotion with the sun chip ("Double until 6:00 PM") and use sun nowhere else.
- **Do** put the screen's main action in one full width 58px button pinned at the bottom.
- **Do** make changes inside a bottom sheet with one main button.
- **Do** show progress toward a reward with the Path, the Progress rail or Purchase dots, not with a plain progress bar.
- **Do** write all text with `AppText` and show changing numbers with `tabular`.
- **Do** use Ionicons, outline style, from `@expo/vector-icons`.
- **Do** confirm delete, end and log out with an Alert that has Cancel.

### Don't:
- **Don't** add shadows to cards, rows, fields or buttons.
- **Don't** put switches, forms or action buttons inside list rows on a screen.
- **Don't** use rose for a normal action, or sun for anything that is not a promotion.
- **Don't** use danger red for anything except delete, end and log out.
- **Don't** bring back teal, the `primary-*` scale, or Tailwind `gray-*`, `blue-*`, `green-*`, `red-*` classes.
- **Don't** use raw `Text`, `StyleSheet`, or hex codes in screens and components.
- **Don't** add uppercase or letter spaced labels above titles.
