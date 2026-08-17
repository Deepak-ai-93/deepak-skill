#!/usr/bin/env bash
# Claude Code — connect this server (run from this server folder)
claude mcp add --transport stdio social-poster -- node src/index.mjs
# verify: claude mcp list
