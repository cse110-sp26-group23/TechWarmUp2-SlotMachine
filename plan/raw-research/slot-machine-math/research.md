# Slot Machine Math / RNG

This folder is for research on how slot machine outcomes are generated and how the game math affects the player experience.

For our project, the main takeaway is that the result of each spin should come from code-based randomness, while the reel animation should only show the result after it has already been decided. Real slot systems are built this way too: the math and RNG determine the outcome first, and the visuals come after. 

## Main things we should design for

- [ ] **RNG decides the spin result**
  - Each spin should be determined by a random or pseudo-random function in the code.
  - The player should not be able to affect the result by clicking faster, stopping the reel early, or timing anything.

- [ ] **Every spin should be independent**
  - A slot machine is not “due” for a win after many losses.
  - Previous spins should not change the odds of the next one.

- [ ] **Animation should not control the outcome**
  - The reel animation is just presentation.
  - The result should already be chosen before the animation finishes.

- [ ] **Keep the RNG/game logic separate from the UI**
  - This will make the project easier to test.
  - It also makes the code cleaner and easier to update later.

## Math terms we should know

### RTP (Return to Player)
RTP is the long-run percentage of money that gets paid back to players over time. For example, a 95% RTP means that over a very large number of spins, the machine is designed to return about 95 cents for every dollar bet on average. The other 5% is the house edge. 

### House Edge
House edge is just the opposite side of RTP. If RTP is 95%, then the house edge is 5%. This is useful because it gives us a clear way to balance the game instead of picking rewards randomly. 

### Hit Frequency
Hit frequency is how often the player wins *something* on a spin. This does **not** mean the player is profitable overall. A game can have lots of small wins and still lose money over time. 

### Volatility
Volatility is about how the wins are distributed.
- **Low volatility:** more frequent, smaller wins
- **High volatility:** fewer wins, but bigger payouts when they happen

Two games can have the same RTP but feel very different because of volatility. 

## What this means for our project

- [ ] **Pick a target feel for the game**
  - Do we want it to feel generous?
  - Chaotic?
  - Difficult?
  - Funny but fair?
  - Suspenseful with rare big wins?

- [ ] **Decide the paytable before coding too much**
  - We should decide what symbols exist and how much each combination pays.
  - This helps us control RTP, hit frequency, and volatility more intentionally.

- [ ] **Use weighted probabilities**
  - Not every symbol has to be equally likely.
  - Some rare symbols can appear less often so that jackpots stay special.
  - This is closer to how real slot math is structured. 

- [ ] **Show the paytable clearly**
  - Players should be able to understand what combinations pay and why they won.
  - This also makes the game feel more polished.

## What we should test later

Once the game is working, we should simulate a large number of spins and measure:

- [ ] **Estimated RTP**
  - Run thousands of spins and see how much the machine returns on average.

- [ ] **Hit frequency**
  - Check how often the player gets any payout at all.

- [ ] **Reward distribution**
  - Count how often small, medium, and large wins happen.

- [ ] **Symbol balance**
  - Make sure some symbols are not showing up way too often because of a bug.

This matters because a game can look fine visually but still have broken math underneath. Testing a big batch of spins will help us catch that early. 

## Practical ideas for implementation

- [ ] Make one function/module that generates the spin result
- [ ] Make a separate function/module that calculates payout
- [ ] Let the animation reveal the result after it has been chosen
- [ ] Write a small simulation script so we can test thousands of spins quickly
- [ ] Keep a visible display for credits, bet amount, and payout

## Files we could include in this folder

- [ ] `math-notes.md`
- [ ] `paytable-sketch.md`
- [ ] `simulation-plan.md`
- [ ] `glossary.md`
- [ ] `reference-images/`

## Helpful glossary

- **RNG / PRNG:** the code that produces the random outcome
- **RTP:** the long-run average amount paid back to players
- **House Edge:** the part not returned to the player
- **Hit Frequency:** how often a spin gives any win
- **Volatility:** whether wins are smaller/more frequent or bigger/rarer
- **Paytable:** the list of winning combinations and payouts

## Sources

- [UK Gambling Commission – RTS 7: Generation of Random Outcomes](https://www.gamblingcommission.gov.uk/manual/guidance-to-licensing-authorities/rts-7-generation-of-random-outcomes)
- [UK Gambling Commission – Return to Player](https://www.gamblingcommission.gov.uk/public-and-players/guide/return-to-player-how-much-gaming-machines-payout)
- [Gaming Laboratories International – RTP Analysis](https://gaminglabs.com/services/igaming/game-mathematics-percentage-return-to-player-rtp-analysis/)
- [GLI-19 Interactive Gaming Systems](https://gaminglabs.com/wp-content/uploads/2024/06/GLI-19-Interactive-Gaming-Systems-v3.0.pdf)
- [Kevin Harrigan & Mike Dixon – PAR Sheets, Probability and Slot Machine Play](https://cdspress.ca/wp-content/uploads/2022/08/Kevin-A.-Harrigan-Mike-Dixon-.pdf)