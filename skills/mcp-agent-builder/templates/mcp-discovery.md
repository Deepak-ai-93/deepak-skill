# MCP Discovery — reference for mcp-agent-builder

Run this before ANY code. One round of questions; anything still unanswered gets a sensible default recorded in the pack's **Decisions** note. Every answer maps to a locked choice in the PRD + architecture.

## The interview (ask in order, ≤ 8 questions — most prompts answer 3–4 up front)

| # | Question | Decides | Default if skipped |
|---|---|---|---|
| 1 | **What does the server connect to?** A cloud API, a local process, the filesystem, hardware? | The integration layer + transport | a cloud API |
| 2 | **Who will use it?** Just you, your team, or anyone (published)? | Packaging + auth + registry | just you |
| 3 | **Action surface** — a handful of operations, or wrapping a large API? | Tool count + design (3–8 tools is the sweet spot) | 3–5 tools |
| 4 | **Upstream auth** — none, API key, or OAuth 2.0? | Credential flow + `.env` vars | none |
| 5 | **Deployment target** — local IDE/CLI (stdio), remote HTTP (one URL for everyone), or a distributable bundle (MCPB)? | The whole architecture (see architecture-template) | stdio |
| 6 | **Which IDEs/CLIs must connect?** | The ide-cli-matrix rows | Claude Code + Cursor |
| 7 | **What's the ONE task an agent should complete with this server?** | The PRD problem statement + success metric | derived from #1 |
| 8 | **Any hard constraints?** Language (Node/Python), hosting (Cloudflare Workers, VPS), data residency, no third-party deps? | Stack + security notes | Node, no hosting opinion |

## Decisions note (copy into the pack)

> **Decisions:** connector = {…} · users = {…} · surface = {N tools} · auth = {none/api-key/oauth2} · deployment = {stdio/remote-http/mcpb} · clients = {…} · defaulted: {list what you assumed}.

## Anti-patterns

- **Never scaffold before this interview** — deployment + auth guessed wrong means a server nobody can run.
- **Never invent connectors** ("it can also post to X") — the PRD is locked after this interview.
- **OAuth + stdio trap:** OAuth 2.0 redirects don't work over stdio — if auth is OAuth, prefer remote HTTP (the server handles redirects) or document the device-code/CLI flow explicitly in the architecture.
