import { Candle, FvgZone } from '../types';

export const detectInducement = (candles: Candle[], nearestFvg: FvgZone | null): { isInducement: boolean; reason: string } => {
  if (candles.length < 3) {
    return { isInducement: false, reason: 'Not enough candles.' };
  }

  const recent = candles.slice(-3);
  const legHigh = Math.max(...recent.map((c) => c.high));
  const legLow = Math.min(...recent.map((c) => c.low));
  const move = legHigh - legLow;
  const pullback = legHigh - recent[2].close;
  const retracement = move === 0 ? 0 : pullback / move;

  if (retracement < 0.382) {
    return { isInducement: true, reason: 'Weak retracement below 38.2%.' };
  }

  if (retracement < 0.5) {
    return { isInducement: true, reason: 'Pullback failed to reach 50% retracement.' };
  }

  if (nearestFvg) {
    const filled = recent[2].low <= nearestFvg.top && recent[2].high >= nearestFvg.bottom;
    if (!filled) {
      return { isInducement: true, reason: 'Pullback failed to fill nearest FVG.' };
    }
  }

  return { isInducement: false, reason: 'No inducement trap found.' };
};
