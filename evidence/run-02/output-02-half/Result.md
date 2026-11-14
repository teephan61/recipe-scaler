---
test: ../02-half_test.md
status: failed
started: 2026-11-14T21:09:16.623Z
duration_s: 99
session_id: 7bf7ebe5-f299-47be-af2c-dc0e47ffdf9f
---

# Check 2: Halve a recipe — Result

## Step 1 ✓ passed (19.1s)
md5: 72ceca039845bb34f0efeb35fa359756
Open the app and wait for the "Your recipe" section to be visible.

## Step 2 ✓ passed (35.1s)
md5: b69a0166475293ea1728a89d4ed4863b
Click "Try an example", make sure "Original servings" is 4, then click the "Half" button.

## Step 3 ✓ passed (17.9s)
md5: 6895fef4ccf336eab2fede0a596c1d01
Assert the scaled list contains "1 1/8 cups all-purpose flour" and "1/2 tsp salt".

## Step 4 ✗ failed (23.3s)
md5: 0cbcfd9e8c1ef94466329c791eace233
Reason: Final verification failed: "the eggs line reads "1 large egg" (singular, not "1 large eggs")" — bug verdict: Scaled single egg retains plural label [application_issue/ui_data_defect, confidence 0.98]
Assert the eggs line reads "1 large egg" (singular, not "1 large eggs").
