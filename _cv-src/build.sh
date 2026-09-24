#!/bin/sh
# Regenerates the CV PDFs in /cv from the HTML sources in this folder.
# Edit the cv-*.html files, then run:  sh _cv-src/build.sh
# Needs a Chromium-based browser (Chrome, Brave or Edge). This folder starts with "_",
# so GitHub Pages does not publish it — only the generated PDFs in /cv are public.
set -e
cd "$(dirname "$0")"
OUT=../cv

for B in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
         "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"; do
  if [ -x "$B" ]; then BROWSER="$B"; break; fi
done
[ -n "$BROWSER" ] || { echo "No Chromium-based browser found"; exit 1; }

render() {
  "$BROWSER" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$OUT/$2" "file://$PWD/$1" 2>/dev/null
  echo "built $2"
}

render cv-full-en.html Soichi_Tamashiro_CV_EN.pdf
render cv-full-es.html Soichi_Tamashiro_CV_ES.pdf
render cv-short-en.html Soichi_Tamashiro_CV_Short_EN.pdf
render cv-short-es.html Soichi_Tamashiro_CV_Short_ES.pdf

# Legacy URL (already shared) keeps serving the main English CV
cp "$OUT/Soichi_Tamashiro_CV_EN.pdf" "$OUT/Soichi_Tamashiro_CV.pdf"
echo "updated Soichi_Tamashiro_CV.pdf (legacy link -> full EN)"
