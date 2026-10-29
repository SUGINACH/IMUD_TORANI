#!/usr/bin/env bash
#
# Imports the large asset folders that live in the old repository (SUGINACH/IMUD_TORANI) into this one:
#   fonts/     ~264 MB, ~3,500 files - REQUIRED for correct layout (and for the test baseline)
#   old_ver/   historical single-file versions of the system (optional, --with-old-ver)
#
# Usage:
#   tools/import-from-old-repo.sh [--with-old-ver] [--branch V20.1] [--source <dir>] [--dest <dir>]
#
#   --source <dir>   use a local folder that already contains fonts/ (and old_ver/) instead of downloading
#   --dest <dir>     target repository root (default: the root of this repository)
#
# Works in Git Bash / WSL / Linux / macOS.  Needs git (sparse checkout) when downloading.
set -euo pipefail

BRANCH="V20.1"; SOURCE=""; WITH_OLD=0
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_URL="https://github.com/SUGINACH/IMUD_TORANI.git"

while [ $# -gt 0 ]; do
  case "$1" in
    --with-old-ver) WITH_OLD=1 ;;
    --branch) BRANCH="$2"; shift ;;
    --source) SOURCE="$2"; shift ;;
    --dest)   DEST="$2"; shift ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

DIRS=(fonts); [ "$WITH_OLD" = 1 ] && DIRS+=(old_ver)

if [ -z "$SOURCE" ]; then
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  echo "Downloading ${DIRS[*]} from $REPO_URL (branch $BRANCH) - this can take a few minutes ..."
  git clone --quiet --depth 1 --filter=blob:none --sparse --branch "$BRANCH" "$REPO_URL" "$TMP/src"
  git -C "$TMP/src" sparse-checkout set "${DIRS[@]}"
  SOURCE="$TMP/src"
fi

for d in "${DIRS[@]}"; do
  if [ ! -d "$SOURCE/$d" ]; then echo "ERROR: $SOURCE/$d not found" >&2; exit 1; fi
  echo "Copying $d/ -> $DEST/$d/"
  mkdir -p "$DEST/$d"
  cp -R "$SOURCE/$d/." "$DEST/$d/"
done

if [ -f "$DEST/fonts/fonts.json" ]; then
  echo "OK: $(find "$DEST/fonts" -type f | wc -l | tr -d ' ') font files, fonts/fonts.json present."
else
  echo "WARNING: fonts/fonts.json is missing after the import." >&2; exit 1
fi
