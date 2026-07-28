# The board's design system

Read this only when changing how the board looks. Adding and completing items needs nothing
from here.

The template is `board.html` in this directory. It is one file with no server, no build step,
no npm, no CDN and no external fonts, and it works fully offline by double-click.

## What the screen is for

One glance says what is in progress and what is not. Every decision below serves that and
nothing else. The board is disposable: items are deleted when done, so it never has to carry
history, search, or archive.

## The rail

There is exactly one text rail. The board title, the group labels and the item titles all
start at `--rail` (22px). The gutter to its left carries nothing but status markers, and the
dates form a second rail hard against the right edge. Two rails, both deliberate, nothing
floating between them.

Markers are left-aligned in the gutter rather than centred, which keeps 13px of air between
the marker and the text rail. The done check is 11px against the 9px dots because a check
needs more box to read, so it carries a -1px offset to keep all three marker shapes on one
centre line.

## Type roles

Five roles, one treatment each. Adding a sixth treatment is how this screen degrades.

| Role | Treatment |
|---|---|
| Board title | 22px / 600 / -0.015em |
| Group label | 11px / 500 / 0.085em / uppercase / faint |
| Item title | 15px / 1.5 / primary, dropping to muted when done |
| Item note | 13px / 1.45 / muted |
| Meta (date, overflow count, empty state) | 12px / faint / tabular numerals |

Two elements sharing a colour but jittering in size or alignment is the failure mode. If
something new needs to appear on the board, give it an existing role rather than inventing one.

## Colour

Four neutrals and one accent per scheme, as custom properties on `:root`, with the dark set
behind `prefers-color-scheme`. `color-scheme: light dark` is declared so form and scrollbar
chrome follow.

**The accent appears on active markers and nowhere else.** That is the whole point of it:
colour answers "what is in flight" rather than decorating. Spending the accent on a second
element spends the one signal the board has.

Done recedes by dropping a step in the text hierarchy, never by strike-through. A struck item
reads as cancelled; a quieter one reads as resolved.

## Motion

Items rise 5px and fade over 340ms on load, staggered 26ms, with `backwards` fill so nothing
flashes before its delay. That is the entire motion budget. It is suppressed under
`prefers-reduced-motion`.

Nothing on the board has a hover state. It is a glance surface, not an application.

## Growth

Done items stay visible but are capped at the five most recent, with a quiet count line for
the remainder, so the board cannot grow unbounded. Groups render in the fixed order active,
idea, done, and within a group the newest sits at the top.

## Rules for changing it

- Simplest thing that works. Structural fix over scaffolding, reduce over add.
- Polish means refining spacing, hierarchy, copy and motion. It does not mean adding subheads,
  microcopy, badges or filler.
- The quality comes from spacing, hierarchy, restraint and the one considered accent. It does
  not come from gradients, glassmorphism or decoration.
- Comments state the constraint the code cannot show. No change history, no narrating the next
  line.
- No em dashes in board copy or in these docs.

## Rendering notes

Items are stored one JSON object per line in a block above the styles, not as a JSON array.
That shape is chosen for the write path: every add, update and delete becomes one whole-line
edit, with no commas to place and no first or last item to special-case. A line that fails to
parse drops itself and the rest of the board still renders, so a bad write costs one item
rather than the page.

A literal `<` inside the data block closes it early, spilling raw JSON onto the page and
losing every item below it, so the write path escapes every `<` as `\u003c`. That is a write-time
rule and cannot be fixed in the renderer: the HTML parser has already closed the tag before
any script runs.

Item text is written with `textContent` rather than interpolated into markup, so titles and
notes cannot break the page or inject anything.

Dates are formatted by splitting the ISO string by hand. `new Date('2026-07-28')` parses as
UTC midnight and renders as the previous day anywhere west of Greenwich, which would silently
misdate the board.
