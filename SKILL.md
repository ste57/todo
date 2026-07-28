---
name: slate
description: Maintains a single todo board as one self-contained HTML file at ~/Desktop/slate.html. Use when the user raises work in normal conversation, either asking for something to be done or stating an intention to act, and when that work finishes. Logs items silently and marks them done in place, so one glance at the board says what is in progress and what is not.
---

# Slate

One HTML file on the Desktop, `~/Desktop/slate.html`, answering one question at a glance:
what is in progress, and what is not. The user raises work in normal conversation and you
keep the board current without being asked.

Never touch any other file on the Desktop.

## Capture

Log a new item when the user:

- asks for work to be done ("go fix this bug", "can you redo the X")
- states an intention to act, however vague ("I've been meaning to sort out the finances layout")

Route on **intention to act**, not on phrasing. The test is whether it describes **work to be
done** or **something that is true**. "I'm thinking about redoing the layout" is work and goes
on the board. "I'm thinking we should always use pnpm" is a durable fact and does not.

One message can carry both. "The deploy keeps failing because the env var is unset, I need to
fix it" puts only the fix on the board.

**Bias toward logging.** A wrong item costs one deletable line, so the cost of over-capture is
near zero. When unsure, log it.

New items start at `idea`, or at `active` if the work is starting right now.

## Completion

When the work finishes, find the existing item, set `status` to `done` and `completed` to
today. Match on meaning rather than exact wording. **Never append a second copy of something
already on the board.** Update it in place.

## Silence

Capture silently. Do not announce that you logged something, do not narrate the bookkeeping,
do not mention the board while adding to it. Speak only when marking something done, and then
in one short line.

## Updating the board

Items live in a `<script type="application/x-ndjson" id="data">` block near the top of the
file, **one JSON object per line**, and an inline script renders them. **Only ever touch those
lines.** Never edit the markup, the styles or the render script.

One item per line is what makes this reliable: there are no commas to place, no first or last
item to special-case, and adding the first item is the same edit as adding the hundredth. Every
operation below is one whole line.

Item schema, written on a single line:

    {"id":"kebab-slug","title":"...","status":"idea","created":"YYYY-MM-DD","completed":null,"note":null}

### Read the current items

Read the file with `offset: 1, limit: 60`. The block sits above the styles, so that window
holds every item without loading the rest of the file. If the closing `</script>` is not in
view, the board is unusually long, so read further. Do this first, every time, so you know
what is already on the board.

### Add

Insert the new line directly after `<script type="application/x-ndjson" id="data">`. That
anchor is unique and never moves, so this edit is identical whether the board is empty or full.
Newest items sit at the top of the block.

### Update

Each line contains `"id":"the-slug"`, which is unique, so replace that whole line with the new
version. To complete an item, set `"status":"done"` and `"completed"` to today's date.

### Delete

Remove the whole line. Use this when work is abandoned rather than finished, and never mark
abandoned work `done`.

### Field rules

- `id` is a kebab slug of the title and is how you find the line again. Keep it stable, and
  never change it once written.
- `title` is one line, sentence case, no trailing full stop.
- `note` is optional and rare. Use it only for a constraint the title cannot carry.
- `completed` is set only on `done` and is `null` otherwise.
- Three states only: `idea`, `active`, `done`. Resist adding more.
- **Always write `<` as `\u003c` in `title` and `note`.** Every one of them, with no judgement
  about whether a particular `<` looks dangerous. Quotes, apostrophes, backslashes, emoji and
  everything else are safe under ordinary JSON escaping, but a literal `<` can close the data
  block early, which spills raw JSON onto the page and loses every item below it. `\u003c` is
  valid JSON and reads back as a plain `<`, so escaping every time costs nothing and removes
  the judgement call.

If `~/Desktop/slate.html` does not exist, copy `reference/board.html` there, then add the first
item exactly as above. A line that fails to parse drops itself and the rest of the board still
renders, so a bad write degrades to one missing item rather than a blank page.

Design detail lives in `reference/design.md`. You do not need it to add or complete an item,
only to change how the board looks.
