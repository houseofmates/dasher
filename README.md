# docker

Hermes Agent Docker configuration and entrypoint scripts.

## Overview

This repository contains the Dockerfile (if applicable), entrypoint.sh, and supporting configuration for running Hermes Agent in a containerized environment. The setup is designed to be generic and portable across Linux-based systems, using environment variables for configuration to avoid hardcoding personal or setup-specific values.

## Usage

1. Copy the  to  and fill in the required values.
2. Build the Docker image (if a Dockerfile is provided) or use the entrypoint script directly with your container runtime.
3. The container expects a volume mounted at  for persistent Hermes data (config, skills, memories, etc.).

## Environment Variables

Refer to  for a list of supported environment variables and their descriptions.

## Entrypoint

The  script handles:

- Privilege dropping via  when running as root.
- UID/GID mapping for the hermes user to match host ownership.
- Ownership fixing for the data volume.
- Creation of essential directory structure.
- Copying example configuration files if they do not exist.
- Starting the Hermes dashboard as a background side-process (if enabled).
- Executing the final command (either Warning: Unknown toolsets: video
























╭─ ♡ version 0.12.0 (2026.4.30) ♡ upstream bf16d8ad ♡ local be950261 (+2 carri─╮
│                                      ♡ tools ♡                               │
│                   ♡                  browser: browser_back, browser_click,   │
│                   ♡                  ...                                     │
│                    ♡                 browser-cdp: browser_cdp,               │
│                    ♡                 browser_dialog                          │
│                     ♡                clarify: clarify                        │
│                     ♡                code_execution: execute_code            │
│                      ♡               cronjob: cronjob                        │
│                      ♡               delegation: delegate_task               │
│                       ♡              file: patch, read_file, search_files,   │
│                       ♡              write_file                              │
│                        ♡             hermes-yuanbao: yb_query_group_info,    │
│                        ♡             ...                                     │
│                        ♡             (and 18 more toolsets...)               │
│                       ♡                                                      │
│                       ♡              ♡ mcps ♡                                │
│                      ♡               memster (stdio) — 113 tool(s)           │
│                      ♡               nocobase (stdio) — 10 tool(s)           │
│                     ♡                code-indexer (stdio) — 12 tool(s)       │
│                     ♡                                                        │
│                    ♡                 ♡ skills ♡                              │
│                    ♡                 browser: browser-automation,            │
│                   ♡                  browser-captcha-automation,...          │
│                   ♡                  coding: base44, base44-cli, card-grid,  │
│                   ♡                  case-sensitivity...                     │
│                   ♡                  creative: animation, ascii-art,         │
│                   ♡                  ascii-video, baoyu-comic,...            │
│                    ♡                 development: Remote File Editing with   │
│                    ♡                 Ed, auto-git-update, b...               │
│                     ♡                general: cloudflare, edit, email,       │
│                     ♡                search                                  │
│                      ♡               hermes: cron-management,                │
│                                      customization-recovery, find-s...       │
│            ♡ kimi-k2.6 ♡             mcp: fastmcp, mcp-rest-bridge-pattern,  │
│             /home/house              mcp-stdio-bri...                        │
│  ♡ session 20260509_181420_f18cf2 ♡  media: audio-router, gif, heartmula,    │
│                                      image-loader, img...                    │
│                                      memster: llm-wiki,                      │
│                                      memster-activity-system,                │
│                                      memster-core...                         │
│                                      model-stuff: benchmark,                 │
│                                      context-compression-tool-pruning,       │
│                                      go...                                   │
│                                      orchestration: claude-code, codex,      │
│                                      opencode                                │
│                                      research: blog-watcher, wiki            │
│                                                                              │
│                                      155 tools ♡ 194 skills ♡ 3 mcps         │
╰──────────────────────────────────────────────────────────────────────────────╯

haii :3
✦ tip: Cron jobs run in completely fresh agent sessions — prompts must be 
self-contained.


byee :3 or a direct executable).

## Development

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Ensure the entrypoint script remains generic and does not contain hardcoded paths or values specific to your setup.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
