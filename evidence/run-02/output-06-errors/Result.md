---
test: ../06-errors_test.md
status: passed
started: 2026-11-14T21:16:32.183Z
duration_s: 111
session_id: 6084f2a0-4a1b-4b53-a7a1-b7ab0a5f60db
---

# Check 6: Friendly errors, no crash — Result

## Step 1 ✓ passed (17.7s)
md5: 72ceca039845bb34f0efeb35fa359756
Open the app and wait for the "Your recipe" section to be visible.

## Step 2 ✓ passed (22.7s)
md5: 07821ba22215a591102c8abe47598b33
Leave the Ingredients box empty and click "Scale recipe".

## Step 3 ✓ passed (20.2s)
md5: 33f781c9e941ef2435bb3fddbb189301
Assert a message appears saying to add at least one ingredient, and the page is still usable.

## Step 4 ✓ passed (25.5s)
md5: b8dc4dfe9b2064455affc4876b6f66ee
In the "Measure converter", set From to "cup", To to "gram (g)", type "rocks" in the Ingredient box, and click "Convert".

## Step 5 ✓ passed (21.7s)
md5: a0309a1fbdfd83ba88e17f32fe24eb94
Assert a friendly message appears explaining it needs an ingredient it knows, and no number result is shown.
