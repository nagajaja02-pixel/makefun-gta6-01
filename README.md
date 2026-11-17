# SUNBREAK — A Port Solenne Story

[![make.fun](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01)
[![Rank](https://make.fun/badge/gta6-01/nagajaja02-pixel/makefun-gta6-01/rank.svg)](https://make.fun/bounty/gta6-01)
[![Reward](https://make.fun/badge/gta6-01/nagajaja02-pixel/makefun-gta6-01/reward.svg)](https://make.fun/bounty/gta6-01)

A fully original, sunlit 3D crime sandbox in Port Solenne. Courier Lenn and radio operator Ines expose a harbor land scandal through three contracts: deliver a tape, steal a ledger coupe, and escape the city patrol. Explore 64 blocks, the waterfront and palm gardens on foot or in stolen vehicles.

Run `node serve.ts`, then visit http://localhost:8080 in desktop Chrome. No installation, build step or external game requests. HTTP serving is required for browser ES modules; direct file URLs are not supported by Chrome's module security policy.

WASD moves or drives; Shift sprints; Space jumps or brakes; E enters/exits; mouse drag turns the camera; click fires; F punches; H honks; M toggles synthesized music; P saves; Esc pauses; R retries a timed-out delivery. Continue loads browser-local progress. Follow gold beacons and the minimap. Escape police search to clear heat.

`MAKEFUN_OUTPUT_DIR=out node main.ts` creates the deterministic static artifact and dossier using the unmodified kit helper. `shots.json` defines four reproducible in-game browser scenes.

All world geometry, characters, vehicles, story, interface and synthesized sound are original. Three.js is vendored under its MIT license; its license notice is preserved in the minified distribution. Built for [make.fun](https://make.fun).
