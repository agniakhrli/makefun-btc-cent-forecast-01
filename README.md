# BTC Cent Forecaster

[![make.fun](https://make.fun/badge.svg)](https://make.fun)

A program that forecasts Bitcoin's US-dollar price 240 minutes (4 hours) after each checkpoint. For each case it estimates the recent drift from the last 60 minutes of 1-minute closes, extrapolates it to 240 minutes, damps it by 0.6, caps the move at $500, and blends a small mean-reversion term (alpha 0.05) toward the 12-hour average. Written for the make.fun bounty "Forecast Bitcoin's price 4 hours ahead, 12 times over 48 hours".

Run with Node 22: `node main.ts`. It reads every case file in `$MAKEFUN_INPUT_DIR` (or `/input`) and writes one forecast file per case to `$MAKEFUN_OUTPUT_DIR` (or `/output`), deterministically, with no network access. On the practice backtest (p00–p04) it scores a mean absolute error of 26,107 cents against the persistence baseline's 47,055 cents.
