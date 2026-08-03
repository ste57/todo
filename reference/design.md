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
(22px). The gutter to its left carries nothing but status markers, and the meta block forms a
second rail hard against the right edge. Two rails, both deliberate, nothing floating between
them, and both flush: the marker sits at the board's left edge and the meta at its right, which
is worth measuring after any change to the row grid.

The meta block stacks project over date. When a row carries its project inline instead, the
date is alone in the block and takes the full 22.5px meta line-height so it stays on the
title's first line; stacked, it drops to 11px and tucks under the label.

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
| Meta label (project, stacked) | 12px / 500 / muted |

The project has two placements, and they are not two roles. Done rows are short and single
line, so it sits inline before the title in faint at the title's own size, where it groups the
row. Everything else can wrap, and inline it indented only the first line, leaving the rest of
the title off the rail; there it sits in the meta block instead, taking the label treatment
above with the date beneath it at 11px. Same field, placed where each row shape can carry it.

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
flashes before its delay. Active markers stay on the 9px rail and use a restrained glossy dot:
a slow brightness lift and one soft shimmer across the surface, with no outer halo. All motion
is suppressed under `prefers-reduced-motion`.

The accent also cools. Nothing in a file can observe whether an agent is still running, so the
board reports age rather than liveness: an active marker drains from accent toward faint
between two and twenty four hours after its `started` stamp, and stops animating once cold. It
is a colour leaving, not a colour added, so the one-accent rule holds.

The board has one hover state, on the overflow control, and it is a colour step only. Nothing
else responds to the cursor. It is a glance surface with a single affordance, not an
application.

## Growth

Done items stay visible but are capped at the fifty most recent, with a quiet count line for
the remainder, so the board cannot grow unbounded. That line is the one control on the board
and expands the group in place. Only the done group is ever capped, so only it gets one.

Groups render in the fixed order active, idea, done. Within a group the newest sits at the top,
sorted by the stamp that matters for the state: `completed` for done, `started` for active,
`created` for ideas. Active sorting by `started` floats live work up and sinks the stalled,
so position carries the same signal the colour does.

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
