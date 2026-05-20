import { Candle, SwingPoint } from '../types';

const LOOKBACK = 5;

export const detectStructure = (candles: Candle[]): {
  swings: SwingPoint[];
  sequence: Array<'HH' | 'HL' | 'LH' | 'LL'>;
} => {
  const swings: SwingPoint[] = [];
  for (let i = LOOKBACK; i < candles.length - LOOKBACK; i += 1) {
    const slice = candles.slice(i - LOOKBACK, i + LOOKBACK + 1);
    const highs = slice.map((c) => c.high);
    const lows = slice.map((c) => c.low);
    const current = candles[i];

    if (current.high === Math.max(...highs)) {
      swings.push({
        index: i,
        price: current.high,
        type: 'high',
        scope: i > candles.length - 30 ? 'internal' : 'external'
      });
    }

    if (current.low === Math.min(...lows)) {
      swings.push({
        index: i,
        price: current.low,
        type: 'low',
        scope: i > candles.length - 30 ? 'internal' : 'external'
      });
    }
  }

  const sequence: Array<'HH' | 'HL' | 'LH' | 'LL'> = [];
  const highs = swings.filter((s) => s.type === 'high');
  const lows = swings.filter((s) => s.type === 'low');

  for (let i = 1; i < highs.length; i += 1) {
    sequence.push(highs[i].price > highs[i - 1].price ? 'HH' : 'LH');
  }
  for (let i = 1; i < lows.length; i += 1) {
    sequence.push(lows[i].price > lows[i - 1].price ? 'HL' : 'LL');
  }

  return { swings: swings.sort((a, b) => a.index - b.index), sequence };
};
