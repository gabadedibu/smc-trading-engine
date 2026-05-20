import { Candle, FvgZone } from '../types';

export const detectFVGs = (candles: Candle[]): FvgZone[] => {
  const fvgs: FvgZone[] = [];

  for (let i = 1; i < candles.length - 1; i += 1) {
    const prev = candles[i - 1];
    const next = candles[i + 1];

    if (prev.high < next.low) {
      fvgs.push({
        startIndex: i - 1,
        endIndex: i + 1,
        top: next.low,
        bottom: prev.high,
        type: 'bullish',
        filled: false
      });
    }

    if (prev.low > next.high) {
      fvgs.push({
        startIndex: i - 1,
        endIndex: i + 1,
        top: prev.low,
        bottom: next.high,
        type: 'bearish',
        filled: false
      });
    }
  }

  for (const fvg of fvgs) {
    for (let i = fvg.endIndex + 1; i < candles.length; i += 1) {
      const candle = candles[i];
      const touched = candle.low <= fvg.top && candle.high >= fvg.bottom;
      if (touched) {
        fvg.filled = true;
        break;
      }
    }
  }

  const price = candles[candles.length - 1]?.close ?? 0;
  return fvgs.filter((fvg) => !fvg.filled && ((fvg.type === 'bullish' && fvg.top < price) || (fvg.type === 'bearish' && fvg.bottom > price)));
};
