---
mode: testing
max_steps: 20
timeout: 180
tags: [edge]
---
# Check 6: Friendly errors, no crash

## Step 1
Open the app and wait for the "Your recipe" section to be visible.

## Step 2
Leave the Ingredients box empty and click "Scale recipe".

## Step 3
Assert a message appears saying to add at least one ingredient, and the page is still usable.

## Step 4
In the "Measure converter", set From to "cup", To to "gram (g)", type "rocks" in the Ingredient box, and click "Convert".

## Step 5
Assert a friendly message appears explaining it needs an ingredient it knows, and no number result is shown.
