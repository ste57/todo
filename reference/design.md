# The board's design system

Read this only when changing how the board looks. Adding and completing items needs nothing
from here.

The template is `board.html` plus `board-data.js` in this directory. Two files, no server, no
build step, no npm, no CDN and no external fonts, working fully offline by double-click.

## What the screen is for

One glance says what is in progress and what is not. Every decision below serves that and
nothing else. The board is disposable: items are deleted when done, so it never has to carry
history, search, or archive.

The page carries no heading. There is one board at one path, so a name at the top would
discriminate against nothing and would spend the largest type on the screen on the one element
that says nothing about the work. The `<title>` names the window, and the first group label
opens the page.

## The rail

There is exactly one text rail. The group labels and the item titles all start at `--rail`
(22px). The gutter to its left carries nothing but status markers, and the dates form a second
rail hard against the right edge. Two rails, both deliberate, nothing floating between them.

Markers are left-aligned in the gutter rather than centred, which keeps 13px of air between
the marker and the text rail. The done check is 11px against the 9px dots because a check
needs more box to read, so it carries a -1px offset to keep all three marker shapes on one
centre line.

## Type roles

Four roles, one treatment each. Adding a fifth treatment is how this screen degrades.

| Role | Treatment |
|---|---|
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

Items live in `board-data.js`, one `S({...})` call per line, not in the HTML and not as a JSON
array. That shape is chosen for the write path: every add, update and delete is one whole-line
edit, with no commas to place and no first or last item to special-case.

The data is a sibling file because it is what makes the board live. A page on `file://` cannot
read its own source, and `fetch` and `XMLHttpRequest` to a `file://` URL are blocked, but a
page can go on loading script tags. The board appends one every second with a fresh query
string, which is what forces the read to come off disk rather than the cache, so an edit
appears without a reload and with nothing running but the page. It redraws only when the data
actually differs, so an unchanged board never re-animates.

`S.end()` is the last line of the data file and sets the flag that lets a poll commit. A
half-written or malformed file fails to parse whole, so the flag stays down, the poll is
discarded and the last good board stays on screen until the next write fixes it. Resilience
lives in the poll rather than in the parse: a bad write costs a second of staleness rather
than an item.

Nothing in the data file needs escaping beyond ordinary JSON, because it is no longer inside a
script tag that a `<` could close early.

Item text is written with `textContent` rather than interpolated into markup, so titles and
notes cannot break the page or inject anything.

Dates are formatted by splitting the ISO string by hand. `new Date('2026-07-28')` parses as
UTC midnight and renders as the previous day anywhere west of Greenwich, which would silently
misdate the board.
