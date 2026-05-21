import { Candle, BosResult, SwingPoint } from '../types';

export const detectBOS = (candles: Candle[], swings: SwingPoint[]): BosResult | null => {
  if (candles.length < 2 || swings.length === 0) {
    return null;
  }

  const latest = candles[candles.length - 1];
  const swingHigh = [...swings].reverse().find((s) => s.type === 'high');
  const swingLow = [...swings].reverse().find((s) => s.type === 'low');

  if (swingHigh && latest.close > swingHigh.price) {
    return { bullish: true, bearish: false, index: candles.length - 1, level: swingHigh.price };
  }
  if (swingLow && latest.close < swingLow.price) {
    return { bullish: false, bearish: true, index: candles.length - 1, level: swingLow.price };
  }

  return null;
};
