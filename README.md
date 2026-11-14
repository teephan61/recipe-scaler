# Recipe Scaler

Scale any recipe up or down, and swap cups, spoons, grams and ounces without doing the math in your head.

Built by a former cook who spent too many shifts converting recipes by hand.

**Live:** _coming soon_

## What it does

- **Scale:** paste ingredients one per line, set original and new servings (or hit Half / Double / Triple).
- **Kitchen-friendly amounts:** results round to fractions you can actually measure (1/8, 1/4, 1/3, 1/2) and step spoons up or down: 3 tsp shows as 1 tbsp, 8 tbsp as 1/2 cup.
- **Units:** keep as written, switch to metric, or switch to US.
- **Measure exchange:** cups ↔ grams for common ingredients (flour, sugar, butter, oats, milk and more), so metric mode weighs your dry goods.
- **Measure converter:** a quick one-off "how many grams is a cup of flour?"

Plain HTML and JavaScript. No sign-up, no API keys, nothing to install.

## Run locally

Open `index.html` in a browser. That's it.

## How it was verified

Built with Claude Code and checked with [Kane CLI](https://github.com/LambdaTest/kane-cli). The plain-English checks live in [`kane/`](kane/), every run (including failed ones) is saved in [`evidence/`](evidence/), and [`evidence/LOOP.md`](evidence/LOOP.md) shows each failure, what Kane saw, and the commit that fixed it.

## Known limits

- Cup-to-gram weights are kitchen averages. Flour scooped vs. spooned can differ by about 10%.
- Ingredient words aren't pluralized or singularized yet.

MIT licensed.
