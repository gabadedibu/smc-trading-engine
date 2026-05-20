import { Candle, LiquidityZone } from '../types';

const TOLERANCE = 0.001;

export const detectLiquidity = (candles: Candle[]): {
  zones: LiquidityZone[];
  swept: Array<{ index: number; direction: 'up' | 'down'; level: number; scope: 'internal' | 'external' }>;
} => {
  const zones: LiquidityZone[] = [];
  const swept: Array<{ index: number; direction: 'up' | 'down'; level: number; scope: 'internal' | 'external' }> = [];

  for (let i = 1; i < candles.length; i += 1) {
    const prev = candles[i - 1];
    const curr = candles[i];
    const isInternal = i > candles.length - 30;
    if (Math.abs(curr.high - prev.high) / prev.high <= TOLERANCE) {
      zones.push({
        level: (curr.high + prev.high) / 2,
        type: 'equalHigh',
        scope: isInternal ? 'internal' : 'external',
        indices: [i - 1, i]
      });
    }
    if (Math.abs(curr.low - prev.low) / prev.low <= TOLERANCE) {
      zones.push({
        level: (curr.low + prev.low) / 2,
        type: 'equalLow',
        scope: isInternal ? 'internal' : 'external',
        indices: [i - 1, i]
      });
    }

    if (curr.high > prev.high && curr.close < prev.high) {
      swept.push({ index: i, direction: 'up', level: prev.high, scope: isInternal ? 'internal' : 'external' });
    }
    if (curr.low < prev.low && curr.close > prev.low) {
      swept.push({ index: i, direction: 'down', level: prev.low, scope: isInternal ? 'internal' : 'external' });
    }
  }

  return { zones, swept };
};
