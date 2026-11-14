---
mode: testing
max_steps: 25
timeout: 180
tags: [core]
---
# Check 3: Spoons step up to the right size

## Step 1
Open the app and wait for the "Your recipe" section to be visible.

## Step 2
Clear the Ingredients box and type "1 tsp salt".

## Step 3
Set "Original servings" to 1 and "New servings" to 3, then click "Scale recipe".

## Step 4
Assert the scaled list shows "1 tbsp salt", because 3 teaspoons is 1 tablespoon.
