# AGENTS.md — OnChain-Aviation (onchain.aero)

Public marketing site for OnChain Aviation LLC. GitHub Pages + `CNAME` → `onchain.aero`.
This is **not** the maintenance product (`OCAviation/amt-agent`) and **not** the private context pack (`OCAviation/onchain-context`).

Business facts: `OCAviation/onchain-context` → `00_START_HERE.md` then `00_SHARED_SURFACES.md`.
Prefer a PR for copy changes. `main` is live.

## What this repo is

Static HTML:

- `index.html` — homepage
- `gulfstreamguru.html` — personal / founder page
- `login.html`, `privacy.html`, `eula.html`
- `assets/` — brand files

No app server. Do not turn this into amt-agent.

## Public lock (do not drift)

From the 31 Aug 2026 lock:

- Tagline: **Elite Gulfstream Maintenance. Future-Forward.**
- Triad: **Transparency / Provenance / Truth.** Punch: **Truth over trust.**
- Provenance = records discipline (work, parts, who signed). Not a live chain. No cryptographic proof on shop pages.
- **VOSB** on the consumer homepage. Years of experience: **22+** until Mike changes it. USMC, not “combat veteran” on the shop homepage.
- Do **not** claim: IA, Part 145 held, hangar, staffed CAMO/135, fleet DoM.
- Owner-is-the-tech is true — **About only**, not as a fleet-DoM pitch.
- IronFleet / RSA / Carta stay off the shop site and off the X pin.

If copy conflicts with the lock, the lock wins. Ask Mike before changing the lock.

## Agent seats

| Seat | Use |
|---|---|
| Grok app | Messaging, positioning, draft copy. |
| Cursor / Grok CLI | Edit HTML in this folder only. `grok -c` from this clone. |
| Grok Bot | GitHub `OCAviation/OnChain-Aviation` PRs. |

Do not edit site copy inside `~/Documents/Claude/Projects/OnChain Aviation` and call it shipped. Ship is this repo.

## Do

- Match existing voice and layout. Small diffs.
- Keep legal pages (`privacy.html`, `eula.html`) boring and accurate.
- After a change, fill `HANDOFF.md` or the same skeleton in the PR.

## Do not

- Add blockchain / tokenization / live-ledger claims to shop pages.
- Publish customer tails, contract dollars, or books.
- Point homepage CTAs at unfinished product as if it were generally available.
- Mix amt-agent Python into this tree.

## Done looks like

- Pages still open as static HTML.
- Lock lines above still true on `index.html`.
- CNAME still `onchain.aero`.
