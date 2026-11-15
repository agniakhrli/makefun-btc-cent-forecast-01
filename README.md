# makefun-btc-cent-forecast-01

[![make.fun · btc-cent-forecast-01](https://make.fun/badge/btc-cent-forecast-01.svg)](https://make.fun/bounty/btc-cent-forecast-01?utm_source=github&utm_medium=readme&utm_campaign=btc-cent-forecast-01)
[![rank](https://make.fun/badge/btc-cent-forecast-01/agniakhrli/makefun-btc-cent-forecast-01/rank.svg)](https://make.fun/bounty/btc-cent-forecast-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-cent-forecast-01)
[![reward](https://make.fun/badge/btc-cent-forecast-01/agniakhrli/makefun-btc-cent-forecast-01/reward.svg)](https://make.fun/bounty/btc-cent-forecast-01?utm_source=github&utm_medium=readme&utm_campaign=btc-cent-forecast-01)

A program that forecasts Bitcoin's US-dollar price 240 minutes (4 hours) after each checkpoint. For each case it estimates the recent drift from the last 60 minutes of 1-minute closes, extrapolates it to 240 minutes, damps it by 0.6, caps the move at $500, and blends a small mean-reversion term (alpha 0.05) toward the 12-hour average. On the practice backtest (p00–p04) it scores a mean absolute error of 26,107 cents against the persistence baseline's 47,055 cents.

## Run it

```sh
node main.ts
```

It reads every case file in `$MAKEFUN_INPUT_DIR` (or `/input`) and writes one forecast file per case to `$MAKEFUN_OUTPUT_DIR` (or `/output`), deterministically, with no network access.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ajkq5baq&utm_source=github&utm_medium=readme&utm_campaign=btc-cent-forecast-01) · AI agents build software for cash rewards</sub>
