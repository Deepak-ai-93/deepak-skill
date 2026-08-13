#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  deepak-skill installer — crafted by Deepak 🎬
#
#  Prints the DEEPAK banner, then installs the skills via `npx skills add`.
#  Works on Windows (Git Bash), macOS and Linux.
#
#  Usage:
#    ./install.sh                       # install ALL skills into this project
#    ./install.sh --skill <name>        # install a single skill
#    ./install.sh --all                 # same as no args (all skills)
#    ./install.sh --global              # install globally (-g), any project
#    ./install.sh --list                # just print the banner + skill list
#    ./install.sh --local               # install from this clone (no network fetch)
#    ./install.sh --help                # this help
#
#  Examples:
#    ./install.sh                       → all 18 skills into .agents/skills/
#    ./install.sh --skill podcast-to-shorts
#    ./install.sh --skill email-marketing --global
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

# ─── colors (disable when not a terminal) ───────────────────────────────────
if [ -t 1 ] && [ -n "${TERM:-}" ] && [ "$TERM" != "dumb" ]; then
  C_CYAN=$'\033[36m'; C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'
  C_RED=$'\033[31m';  C_BOLD=$'\033[1m';    C_RESET=$'\033[0m'
else
  C_CYAN=""; C_GREEN=""; C_YELLOW=""; C_RED=""; C_BOLD=""; C_RESET=""
fi

# ─── the DEEPAK banner ─────────────────────────────────────────────────────
banner() {
  cat <<EOF
${C_CYAN}${C_BOLD}
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
${C_RESET}
${C_CYAN}${C_BOLD}  deepak-skill — 18 agent skills crafted by Deepak 🎬${C_RESET}
${C_YELLOW}  install once · use in any AI coding agent · MIT license${C_RESET}
EOF
  echo ""
}

# ─── the full skill list (kept in sync with README) ────────────────────────
SKILLS=(
  "text-motion-reels        → text-only motion graphic reels (4K)"
  "video-asset-reels        → reels from your own clips & images"
  "video-product-pipeline   → viral-engineered video workflow + audit"
  "hook-storyboard-retention → scroll-stopping hooks + retention storyboards"
  "voice-sfx-audio          → open-source voiceovers + SFX + mixing"
  "carousel-post-images     → LinkedIn/Instagram carousels at 4K"
  "veo-cinematic-reels      → rich scene prompts for ANY video gen (Flow/Veo, Kling, Luma...), IMAX + consistency"
  "serial-story-reels       → episodic story series: bible + episode prompts + VO"
  "photoshoot-studio        → AI photoshoot prompts: people + products"
  "paid-ads-studio          → Meta + Google ad campaigns: creatives + forecast"
  "email-marketing          → spam-free HTML emails + high-CTR subject lines"
  "blog-seo-content         → SEO articles that rank and get AI-cited"
  "youtube-video-pipeline   → script, 10-title pack, thumbnail, metadata"
  "podcast-to-shorts        → long-form → viral vertical clips"
  "linkedin-personal-brand  → voice-captured posts, bio, calendar"
  "social-media-content-plan → algorithm-reset 30-day content plans (any platform)"
  "vibe-code-webapp         → production vibe-coded web apps"
  "skill-builder            → scaffold new skills the deepak-skill way"
)

show_skills() {
  echo "${C_BOLD}  18 skills installed:${C_RESET}"
  for s in "${SKILLS[@]}"; do
    printf "  ${C_GREEN}•${C_RESET} %s\n" "$s"
  done
  echo ""
}

help_text() {
  banner
  cat <<EOF
${C_BOLD}Usage:${C_RESET}
  ./install.sh                       install ALL skills into this project
  ./install.sh --skill <name>        install a single skill (e.g. podcast-to-shorts)
  ./install.sh --all                 all skills (default)
  ./install.sh --global              install globally for every project (-g)
  ./install.sh --list                print the banner + skill list only
  ./install.sh --local               install from this clone (no network fetch)
  ./install.sh --help                this help

${C_BOLD}Examples:${C_RESET}
  ./install.sh
  ./install.sh --skill email-marketing
  ./install.sh --skill veo-cinematic-reels --global
EOF
}

# ─── args ──────────────────────────────────────────────────────────────────
MODE="all"        # all | single
GLOBAL=""
SKILL_NAME=""
LIST_ONLY=0
LOCAL=""

while [ $# -gt 0 ]; do
  case "$1" in
    --all|-a)            MODE="all"; shift ;;
    --skill|-s)          MODE="single"; SKILL_NAME="${2:-}"; shift $(( $# >= 2 ? 2 : 1 )) ;;
    --global|-g)         GLOBAL="-g"; shift ;;
    --list|-l)           LIST_ONLY=1; shift ;;
    --local)             LOCAL=1; shift ;;
    --help|-h)           help_text; exit 0 ;;
    *) echo "${C_RED}Unknown option: $1${C_RESET}"; help_text; exit 2 ;;
  esac
done

# ─── run ───────────────────────────────────────────────────────────────────
banner
show_skills

if [ "$LIST_ONLY" = "1" ]; then
  echo "${C_GREEN}✅ Installer ready — run ./install.sh to install all 18 skills.${C_RESET}"
  exit 0
fi

if [ "$MODE" = "single" ] && [ -z "$SKILL_NAME" ]; then
  echo "${C_RED}❌ --skill needs a name, e.g. --skill podcast-to-shorts${C_RESET}"
  exit 2
fi

# Validate single-skill names against the list
if [ "$MODE" = "single" ]; then
  valid=0
  for s in "${SKILLS[@]}"; do
    base="${s%% *}"
    [ "$base" = "$SKILL_NAME" ] && valid=1
  done
  if [ "$valid" = "0" ]; then
    echo "${C_RED}❌ Unknown skill \"$SKILL_NAME\". Pick one:${C_RESET}"
    for s in "${SKILLS[@]}"; do printf "  ${C_GREEN}•${C_RESET} %s\n" "${s%% *}"; done
    exit 2
  fi
fi

command -v npx >/dev/null 2>&1 || {
  echo "${C_RED}❌ npx not found — install Node.js 18+ first: https://nodejs.org${C_RESET}"
  exit 1
}

echo "${C_BOLD}🚀 Installing…${C_RESET}"
echo ""

if [ -n "$LOCAL" ]; then
  # Local clone install — no network fetch of the registry. The script lives
  # at the repo root, so the local skills path is "./" (the clone itself).
  if [ "$MODE" = "single" ]; then
    npx skills add ./ --skill "$SKILL_NAME" $GLOBAL
  else
    npx skills add ./ --all $GLOBAL
  fi
elif [ "$MODE" = "single" ]; then
  npx skills add Deepak-ai-93/deepak-skill --skill "$SKILL_NAME" $GLOBAL
else
  npx skills add Deepak-ai-93/deepak-skill --all $GLOBAL
fi

echo ""
echo "${C_GREEN}✅ Done — deepak-skill installed${C_RESET}"
echo ""
if [ "$MODE" = "single" ]; then
  echo "Next: tell your agent to use the $SKILL_NAME skill, e.g.:"
  echo "  \"Using the ${C_BOLD}$SKILL_NAME${C_RESET} skill, ${C_YELLOW}<your request>${C_RESET}\""
else
  echo "Next: tell your agent to use any skill, e.g.:"
  echo "  \"Using the ${C_BOLD}email-marketing${C_RESET} skill, write a promo email.\""
  echo "  \"Using the ${C_BOLD}veo-cinematic-reels${C_RESET} skill, make a cinematic reel.\""
  echo "  \"Using the ${C_BOLD}podcast-to-shorts${C_RESET} skill, clip this episode.\""
fi
echo ""
echo "See ${C_CYAN}install.md${C_RESET} and ${C_CYAN}README.md${C_RESET} for the full guide."
