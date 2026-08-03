---
name: slate
description: Maintains a single todo board as one self-contained HTML file at ~/Desktop/.slate.html. Use when the user raises work in normal conversation, either asking for something to be done or stating an intention to act, and when that work finishes. Logs items silently and marks them done in place, so one glance at the board says what is in progress and what is not.
---

# Slate

One HTML file on the Desktop, `~/Desktop/.slate.html`, answering one question at a glance:
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

Items live in `~/Desktop/.slate-data.js`, **one `S({...})` call per line**. `slate.html` polls
that file once a second and redraws when it changes, so the board updates itself while it is
open. **Never edit `slate.html`.** It holds only markup, styles and the render.

One item per line is what makes this reliable: there are no commas to place, no first or last
item to special-case, and adding the first item is the same edit as adding the hundredth. Every
operation below is one whole line.

Item schema, written on a single line:

    S({"id":"kebab-slug","title":"...","status":"idea","created":"YYYY-MM-DD","completed":null,"note":null})

The last line of the file is always `S.end()`. It is how the board knows the file parsed whole,
so never remove it and never write below it.

### Read the current items

Read `~/Desktop/.slate-data.js`. It holds nothing but items, so read all of it. Do this first,
every time, so you know what is already on the board.

### Add

Insert the new line directly above the first `S(` line, or directly above `S.end()` when the
board is empty. Newest items sit at the top.

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
- Ordinary JSON escaping is all any field needs. There is no character to watch for.

If the board does not exist, copy `reference/board.html` to `~/Desktop/.slate.html` and
`reference/board-data.js` to `~/Desktop/.slate-data.js`, then add the first item. The two files
sit side by side and the board cannot find its data if they are separated.

A file that fails to parse never reaches the board: `S.end()` does not run, the poll is
discarded, and the last good state stays on screen until the next write fixes it.

Design detail lives in `reference/design.md`. You do not need it to add or complete an item,
only to change how the board looks.
