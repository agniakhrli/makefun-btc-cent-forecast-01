import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/** The smallest positive price on the grid: one unit of its 5 decimals. */
const MIN_PRICE = 0.00001;
/** The largest grid price below the scorer's exclusive 10,000,000-dollar cap. */
const MAX_PRICE = 9_999_999.99999;

interface CaseMarket {
  id: string;
  prices: number[];
}

interface Case {
  markets: CaseMarket[];
}

/** x kept on the grid's 5 decimals and inside the scorer's (0, 10,000,000). */
const price5 = (x: number): number => Math.round(Math.min(MAX_PRICE, Math.max(MIN_PRICE, x)) * 1e5) / 1e5;

/**
 * Damped trend forecaster with volatility capping and mean-reversion blend.
 * Window w = 60 min, Damping f = 0.6, Cap = $500, Mean reversion alpha = 0.05, mw = 720 min.
 */
function forecast(m: CaseMarket): number {
  if (!Array.isArray(m.prices) || m.prices.length === 0) throw new Error(`market ${m.id} has no prices`);
  const prices = m.prices;
  const last = prices[prices.length - 1] as number;
  if (typeof last !== 'number' || !Number.isFinite(last)) throw new Error(`market ${m.id}'s last price is not a finite number`);

  const w = 60; // 60-minute window for recent drift
  const f = 0.6; // Damping/scaling factor (tuned from 0.4 to 0.6)
  const maxDelta = 500; // Cap maximum absolute price change in USD

  if (prices.length <= w) return price5(last);

  const prev = prices[prices.length - 1 - w] as number;
  if (typeof prev !== 'number' || !Number.isFinite(prev)) return price5(last);

  let drift = (last - prev) * (240 / w) * f;
  if (Math.abs(drift) > maxDelta) {
    drift = Math.sign(drift) * maxDelta;
  }

  // Small mean-reversion blend toward 12h average (mw = 720)
  const mw = 720;
  const alpha = 0.05;
  const slice = prices.slice(Math.max(0, prices.length - mw));
  const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
  const meanRev = (mean - last) * alpha;

  return price5(last + drift + meanRev);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
// Every case file, in name order, so two runs write the same bytes.
const inputs = readdirSync(INPUT_DIR).filter((f) => f.endsWith('.in')).sort();
for (const file of inputs) {
  const id = file.slice(0, -'.in'.length);
  const c = JSON.parse(readFileSync(join(INPUT_DIR, file), 'utf8')) as Case;
  if (!Array.isArray(c.markets) || c.markets.length !== 1) throw new Error(`${file} does not hold exactly one market`);
  writeFileSync(
    join(OUTPUT_DIR, `${id}.out`),
    `${JSON.stringify({ forecasts: [{ case: id, price: forecast(c.markets[0] as CaseMarket) }] })}\n`
  );
}
