# Slate

A Claude Code skill that keeps a todo board as one self-contained HTML file on your Desktop.
You raise work in conversation, the skill logs it and marks it done when the work finishes.

The board lives at `~/Desktop/slate.html`. It opens by double-click, works offline, and has no
server, no build step and no dependencies.

## Install

Two steps.

**1. Install the skill.** In Claude Code:

    Install https://github.com/ste57/todo as a skill

**2. Add the trigger line to your global profile.** The skill does not fire on its own, because
"go fix this bug" looks like ordinary conversation. An always-loaded line is what reaches for it:

    - Track work on the desktop board: when I raise something to do, log it via the
      `slate` skill; mark it done when finished.

Nothing writes to your profile for you. That line is yours to add.

## Capture

An item is logged when you ask for work to be done, or state an intention to act. Capture is
silent, and you hear one line when something is marked done. The bias is toward logging, since
a wrong item costs one deletable line.

## The board

Items sit near the top of the HTML, one JSON object per line, rendered by a small inline
script. Adding, changing or removing an item is one whole line, never the markup.

    {"id":"kebab-slug","title":"...","status":"idea","created":"YYYY-MM-DD","completed":null,"note":null}

Three states: `idea` raised but not started, `active` in progress, `done` finished. Done items
recede and are capped at the five most recent, so the board cannot grow unbounded.
