# Working notes for Claude

- At the end of every session, update `PROGRESS.md` in the repo root: what's done, what's blocked, what's next.
- The closed loop: Tee runs `bash kane/run.sh NN <live-url>` and the results land in `evidence/run-NN/`. Fix the cause of each failure, commit with a message naming the failed check and run (e.g. `fix: ... (Kane check 2 failed in run-02)`), and add a row to `evidence/LOOP.md`.
- Never delete failed runs. They're proof the loop is real.
- Live site is GitHub Pages from `main` / root.
