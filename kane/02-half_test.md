---
mode: testing
max_steps: 25
timeout: 180
tags: [core]
---
# Check 2: Halve a recipe

## Step 1
Open the app and wait for the "Your recipe" section to be visible.

## Step 2
Click "Try an example", make sure "Original servings" is 4, then click the "Half" button.

## Step 3
Assert the scaled list contains "1 1/8 cups all-purpose flour" and "1/2 tsp salt".

## Step 4
Assert the eggs line reads "1 large egg" (singular, not "1 large eggs").
