// One item per line, newest first. Every edit is a whole line, so there are no commas to
// place. S.end() must stay last: it is how the board knows the file parsed.
//
// `started` is set when an item becomes active. An active item whose `started` is more than a
// day old is stale: no session is still on it, whatever the status says. The board drains its
// colour and sorts it down; reading the stamp is how you see the same thing.
S.end()
