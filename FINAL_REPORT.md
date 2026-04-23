# FINAL REPORT

## Overview
This project was about building a browser-based basketball slot machine app from scratch using Claude Code as the primary development tool. The goal was to see how far AI-assisted engineering could take a real full-stack project (not just a toy, but something with server-side game math, a REST API, a tested client, accessibility, and iterative refinement across multiple sessions).

## Setup
We used Claude Code with Claude Sonnet 4.6 medium model across 20 logged sessions. Each session started from the current state of the codebase (STRICTLY no hand-editing between runs.) The first session built the entire project from a written spec. Every session after that was either a planned refinement pass or a targeted fix. All generated code was linted and tested before moving on.

## What We Found in the Initial Build
The first session was the most surprising. The full project (Express server, game math, REST API, HTML/SCSS/JS client, Web Audio, and 35+ unit and e2e tests) came out in 15 minutes. The game math was off on the first attempt (RTP came in around 10% instead of 93%) but the AI caught it through its own simulation test and redesigned the paytable analytically before moving on. No hand-editing was needed. That said, it was clearly a first attempt. The visual design was generic and the audio was all synthesized oscillator tones, not real sound files.

## What Happened During Refinement
Refinement is where most of the real work happened. Across sessions 2 through 18, the app went from a working skeleton to something that looked and felt intentional. The basketball theme, 5×3 reel grid, scrolling reel animation, GSAP-powered effects, canvas-confetti, Howler audio, Zod validation, and a skeuomorphic UI all came from refinement passes.

The pattern that worked best was: explore the codebase first, write a plan, then implement. Sessions that jumped straight to implementation tended to introduce bugs that showed up two or three sessions later. The CSP conflict blocking CDN scripts, the missing background music call site, and the DEV_MODE field name mismatch were all examples of that (each introduced in one session, noticed much later).

## Final State
?????

## Main Takeaway
AI is fast at building things but bad at catching its own mistakes across sessions. Getting a full project scaffolded in 15 minutes is genuinely useful. The problem is that bugs introduced in one session often don't show up until a few sessions later, and by then they're harder to trace. Running the full app end-to-end (not just unit tests) is the only way to actually know things are working.

## Limitations
This log covers one project with one AI tool. The way we worked here won't apply to everything, and other teams will find different approaches that work better for them. What we can say is that staying disciplined with prompts and planning made a real difference. Without that structure, the results would have been a lot harder to manage.
## Conclusion
The project shipped. Game math, tests, mobile layout, and linting all came out clean. Claude Code moved faster than manual development would have, but it needed a human to direct it, keep it structured, and catch the things that looked fine until they weren't. Think of it less like "AI writes the code" and more like "AI does the typing, you do the thinking."
