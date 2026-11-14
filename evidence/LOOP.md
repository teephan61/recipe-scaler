# Closed loop log

Claude Code builds, Kane CLI verifies, the result goes back to Claude Code, and it fixes the cause, then Kane re-runs.
Every run is kept in `evidence/run-NN/`, failures included.

| Run | Check | Result | What Kane saw | Fix commit |
|-----|-------|--------|---------------|------------|
| 01 | all | 0 of 6 ran | Test plan was empty (`"members":[]`): the run script's path pattern used `/`, Windows paths use `\` | 584b3cd |
| 02 | 2 · Halve a recipe | failed (5 of 6 passed) | Halved list said "1 large eggs". Kane's verdict: "Scaled single egg retains plural label" (confidence 0.98) | 986514a |
| 03 | all 6 | **passed (6 of 6)** | Check 2 now reads "1 large egg"; nothing else regressed | (no fix needed) |
