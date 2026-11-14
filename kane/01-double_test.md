---
mode: testing
max_steps: 25
timeout: 180
tags: [core]
---
# Check 1: Double a recipe

## Step 1
Open the app and wait for the "Your recipe" section to be visible.

## Step 2
Click "Try an example" to fill in the example cookie recipe.

## Step 3
Make sure "Original servings" is 4, then click the "Double" button.

## Step 4
Assert "New servings" now shows 8 and the "Scaled recipe" section shows "Scale factor: 2×".

## Step 5
Assert the scaled list contains "4 1/2 cups all-purpose flour" and "4 large eggs".
