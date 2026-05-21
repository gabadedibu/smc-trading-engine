import { BosResult, Candle, ProtectedLevel } from '../types';

export const detectProtectedLevel = (
  candles: Candle[],
  sweep: { index: number; direction: 'up' | 'down'; level: number } | undefined,
  bos: BosResult | null
): ProtectedLevel | null => {
  if (!sweep || !bos) {
    return null;
  }

  if (sweep.direction === 'up' && bos.bearish) {
    return {
      type: 'high',
      level: candles[sweep.index].high,
      pointA: sweep.index,
      pointB: Math.max(0, sweep.index - 1),
      pointC: bos.index
    };
  }

  if (sweep.direction === 'down' && bos.bullish) {
    return {
      type: 'low',
      level: candles[sweep.index].low,
      pointA: sweep.index,
      pointB: Math.max(0, sweep.index - 1),
      pointC: bos.index
    };
  }

  return null;
};
