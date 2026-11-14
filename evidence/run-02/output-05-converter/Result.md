---
test: ../05-converter_test.md
status: passed
started: 2026-11-14T21:14:16.719Z
duration_s: 127
session_id: 53ad07de-428f-467a-b0e9-f2c16b6420fb
---

# Check 5: Measure converter, cups to grams — Result

## Step 1 ✓ passed (23.8s)
md5: adf6be4bebba4176f7e58679bddbf527
Open the app and scroll to the "Measure converter" section.

## Step 2 ✓ passed (17.7s)
md5: 0bb0b379e501eaf558116cadca1d545c
Set Amount to 1, From to "cup", To to "gram (g)", and type "flour" in the Ingredient box.

## Step 3 ✓ passed (11.5s)
md5: 71a867e43254326e568af87ab25595c8
Click "Convert".

## Step 4 ✓ passed (24.4s)
md5: 2e40abf0018a61dd0023c01992e07e0f
Assert the result reads "= 125 g".

## Step 5 ✓ passed (46.2s)
md5: 9e6d4993b554c17d5d87437ddc2bde4c
Change To to "tablespoon (tbsp)", clear the Ingredient box, and click "Convert". Assert the result reads "= 16 tbsp".
