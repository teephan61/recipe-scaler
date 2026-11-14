# Kane checks

Each `*_test.md` file is one plain-English check that Kane CLI runs against the live app.

| File | What it proves |
|------|----------------|
| 01-double | Doubling the example gives 4 1/2 cups flour, 4 eggs, factor 2× |
| 02-half | Halving gives 1 1/8 cups flour, 1/2 tsp salt, "1 large egg" |
| 03-spoon-step-up | 3 tsp becomes 1 tbsp |
| 04-metric | Metric mode weighs flour in grams, no cups left |
| 05-converter | 1 cup flour = 125 g, 1 cup = 16 tbsp |
| 06-errors | Empty recipe and unknown ingredient show friendly messages |

Run all of them: `bash kane/run.sh 01 https://your-live-url`
Results land in `evidence/run-01/`. Loop history is in `evidence/LOOP.md`.
