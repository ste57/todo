---
when: user says "flush changes" / "flush"
---
# Flush changes

Ship the workspace branch's current work to `main` via a throwaway PR branch, then bring
`main` back into the workspace branch. The workspace branch is never the PR head and is
never deleted.

1. Note the current workspace branch: `git rev-parse --abbrev-ref HEAD`
2. Cut the flush branch from it: `git checkout -b <flush-branch>`
3. Stage and commit the changes
4. `git push -u origin <flush-branch>`
5. `gh pr create --base main --head <flush-branch>`
6. Confirm with the user, then merge: `gh pr merge --squash --delete-branch`
   (merges to `main` and deletes the remote branch)
7. `git checkout <workspace-branch>`
8. `git branch -d <flush-branch>`
9. `git fetch origin && git merge origin/main`
