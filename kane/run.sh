#!/usr/bin/env bash
# Runs every Kane check in kane/ against the live app and saves the evidence.
# Usage:  bash kane/run.sh 01 https://your-live-url
set -u
RUN="${1:?run number, e.g. 01}"
URL="${2:?live URL of the app}"
OUT="evidence/run-$RUN"

if [ -e "$OUT" ]; then
  echo "$OUT already exists. Use the next run number; old runs are kept as proof." >&2
  exit 1
fi
mkdir -p "$OUT"
touch "$OUT/.started"

kane-cli testrun run --match '^kane/' \
  --override-start-url "$URL" \
  --headless --agent --on-failure continue \
  --name "run-$RUN" < /dev/null \
  | tee "$OUT/results.ndjson"
CODE=${PIPESTATUS[0]}

# Copy the sealed evidence packs (screenshots, steps, console + network logs) from this run
if [ -d .testmuai/evidence ]; then
  find .testmuai/evidence -newer "$OUT/.started" -maxdepth 1 -name '*.evidence*' \
    -exec cp -r {} "$OUT/" \;
fi
rm -f "$OUT/.started"

{
  echo "run: $RUN"
  echo "url: $URL"
  echo "date: $(date -u +%Y-%m-%dT%H:%MZ)"
  echo "exit code: $CODE  (0 = all passed, 1 = something failed, 2 = setup/auth error, 3 = timeout)"
} > "$OUT/summary.txt"

echo
echo "Saved to $OUT/. Paste $OUT/results.ndjson back to Claude."
exit $CODE
