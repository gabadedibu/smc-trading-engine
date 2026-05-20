import { Candle, POI } from '../types';

export const detectVolumeViolation = (candles: Candle[], poi: POI | null): { violated: boolean; retestHeld: boolean; entryZone: { top: number; bottom: number } | null } => {
  if (!poi || candles.length < 12) {
    return { violated: false, retestHeld: false, entryZone: null };
  }

  const avgBody = candles.slice(-11, -1).reduce((acc, c) => acc + Math.abs(c.close - c.open), 0) / 10;
  const impulseIndex = candles.findIndex((c) => Math.abs(c.close - c.open) > avgBody * 1.5 && (c.high > poi.top || c.low < poi.bottom));

  if (impulseIndex === -1) {
    return { violated: false, retestHeld: false, entryZone: null };
  }

  const zone = { top: poi.top, bottom: poi.bottom };
  const retestCandles = candles.slice(impulseIndex + 1, impulseIndex + 11);
  const retest = retestCandles.find((c) => c.low <= zone.top && c.high >= zone.bottom);
  const retestHeld = Boolean(retest && retest.close <= zone.top && retest.close >= zone.bottom);

  return { violated: true, retestHeld, entryZone: zone };
};
