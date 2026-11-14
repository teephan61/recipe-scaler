---
mode: testing
max_steps: 25
timeout: 180
tags: [core]
---
# Check 5: Measure converter, cups to grams

## Step 1
Open the app and scroll to the "Measure converter" section.

## Step 2
Set Amount to 1, From to "cup", To to "gram (g)", and type "flour" in the Ingredient box.

## Step 3
Click "Convert".

## Step 4
Assert the result reads "= 125 g".

## Step 5
Change To to "tablespoon (tbsp)", clear the Ingredient box, and click "Convert". Assert the result reads "= 16 tbsp".
