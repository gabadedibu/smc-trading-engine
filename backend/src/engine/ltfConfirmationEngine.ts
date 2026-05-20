import { BosResult, Candle } from '../types';

export const confirmLTF = (
  candles: Candle[],
  params: {
    sweep: boolean;
    bos: BosResult | null;
    inducement: boolean;
    retest: boolean;
    direction: 'bullish' | 'bearish';
  }
): { confirmed: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  const last = candles[candles.length - 1];
  const range = last.high - last.low;
  const body = Math.abs(last.close - last.open);
  const momentum = range > 0 && body / range > 0.7;

  if (!params.sweep) reasons.push('Liquidity sweep missing.');
  if (!params.bos) reasons.push('BOS missing.');
  if (!params.inducement) reasons.push('Inducement missing.');
  if (!params.retest) reasons.push('Retest missing.');
  if (!momentum) reasons.push('Momentum shift missing.');
  if (params.direction === 'bullish' && last.close < last.open) reasons.push('Momentum candle is not bullish.');
  if (params.direction === 'bearish' && last.close > last.open) reasons.push('Momentum candle is not bearish.');

  return { confirmed: reasons.length === 0, reasons };
};
