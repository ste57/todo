---
name: slate
description: Keeps the user's todo board at ~/Desktop/.slate.html current. Use when they raise work in normal conversation, ask for something to be done, state an intention to act, or when that work finishes. Logs silently and marks items done in place.
---

# Slate

The board answers one question at a glance: what is in progress, and what is not. The user
raises work in conversation and you keep it current without being asked.

Never touch any other file on the Desktop.

## Capture

Log a new item when the user asks for work to be done ("go fix this bug") or states an
intention to act, however vague ("I've been meaning to sort out the finances layout").

Route on **intention to act**, not phrasing: does it describe work to be done, or something
that is true? "I'm thinking about redoing the layout" is work. "I'm thinking we should always
use pnpm" is a durable fact and does not go on the board. One message can carry both, and only
the work goes on.

**Bias toward logging.** A wrong item costs one deletable line. When unsure, log it.

New items start at `idea`, or `active` if the work is starting right now.

## Completion

When work finishes, find the existing item and set `status` to `done` and `completed` to
today. Match on meaning, not wording. **Never append a second copy of something already on the
board.** Update it in place.

## Ownership

**You own every item you log until it leaves the board.** No later session knows what you meant
by it, so one you created and did not resolve is one nobody will resolve.

Before the session ends, account for every item you logged: `done` if it finished, deleted if
abandoned, back to `idea` if started and left unfinished. Leaving it `active` is the one thing
you cannot do, because `active` means a session is working on it right now.

Items logged by other sessions are not yours; leave them alone. The exception is a stale one:
an `active` item whose `started` stamp is over a day old has no session on it, whatever the
status says. Do not take it over or resolve it, since you do not know what happened. Say so
once and let the user decide.

## Silence

Capture silently. Do not announce that you logged something or narrate the bookkeeping. Speak
only when marking something done, and then in one short line. Silence is about not
volunteering: when the user asks about the board, answer normally.

## Updating the board

Items live in `~/Desktop/.slate-data.js`, **one `S({...})` call per line**, with `S.end()`
always last. **Never edit `.slate.html`**, which holds only markup, styles and the render, and
polls the data file once a second so the board updates itself while open.

Every operation below is one whole line:

    S({"id":"kebab-slug","project":"Slate","title":"...","status":"idea","created":"YYYY-MM-DD","due":null,"started":null,"completed":null,"note":null})

**Read** `~/Desktop/.slate-data.js` by path, all of it, first and every time. Never list the
Desktop to check the board exists: `ls ~/Desktop` fails with "Operation not permitted" under
macOS privacy controls while reading a named file inside it works, so a failed listing proves
nothing.

**Add** the new line directly above the first `S(` line, or above `S.end()` if the board is
empty. Newest sits at the top.

**Update** by replacing the whole line, found by its unique `"id":"the-slug"`.

**Delete** the whole line when work is abandoned. Never mark abandoned work `done`.

### Field rules

- `id` is a kebab slug of the title. Never change it once written.
- `project` names where the work lives, capitalised, usually the repo. Never repeat it in the
  title.
- `title` is one line, sentence case, no trailing full stop.
- `created` and `completed` are `YYYY-MM-DD` in the user's **local** date, never UTC. After
  about 5pm Pacific the UTC date is already tomorrow, which puts two date bases in one file and
  breaks every sort. `completed` is set only on `done`.
- `started` is ISO 8601 **with offset** (`2026-08-02T21:40:00-07:00`), set when an item becomes
  `active` and cleared when it leaves. Only `active` items carry one, so `null` elsewhere is
  correct rather than missing; an `active` item without one predates the field, so treat it as
  fresh and stamp it next time you touch it. The board drains an active marker's colour as this
  ages, which is why setting it accurately matters.
- `due` is a `YYYY-MM-DD` local date when the user gives a deadline, and `null` otherwise.
  It replaces the age in the meta column and goes bold once passed. Never write a deadline
  into the title or the note; the board cannot read it there.
- `note` is optional and rare: a constraint the title cannot carry. Work attempted and parked
  is an `idea` with a note saying what was tried and what it waits on.
- Three states only: `idea`, `active`, `done`. Resist adding more.
- Ordinary JSON escaping is all any field needs.

### If the board does not exist

Copy `reference/board.html` to `~/Desktop/.slate.html` and `reference/board-data.js` to
`~/Desktop/.slate-data.js`; they must sit side by side. If nothing is at `~/Desktop/slate.html`,
copy `reference/moved.html` there too: an older version of this skill writes to that path, and
the marker turns a silent write into an obvious one.

Never change the board's shape or location without counting items before and after and naming
what did not survive. A migration that quietly drops a line is indistinguishable from the user
deleting it.

Design detail, including the data format and how a bad write recovers, lives in
`reference/design.md`. You do not need it to add or complete an item.
