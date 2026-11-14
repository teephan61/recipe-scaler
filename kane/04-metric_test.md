---
mode: testing
max_steps: 25
timeout: 180
tags: [core]
---
# Check 4: Metric conversion weighs dry ingredients

## Step 1
Open the app and wait for the "Your recipe" section to be visible.

## Step 2
Click "Try an example".

## Step 3
In the "Units" dropdown, choose "Metric (g, ml)".

## Step 4
Assert the all-purpose flour line is shown in grams (it ends in "g all-purpose flour") and not in cups.

## Step 5
Assert no line in the scaled list still says "cup" or "cups".
