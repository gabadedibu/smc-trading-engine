import { Candle, POI } from '../types';
import { detectStructure } from './structureDetector';

export const evaluateHTFConfluence = (
  candles: Candle[],
  majorPOI: POI | null
): { trend: 'bullish' | 'bearish'; majorPOI: POI | null; confidence: number } => {
  const { sequence } = detectStructure(candles);
  const recent = sequence.slice(-6);
  const bullishCount = recent.filter((s) => s === 'HH' || s === 'HL').length;
  const bearishCount = recent.filter((s) => s === 'LH' || s === 'LL').length;
  const trend = bullishCount >= bearishCount ? 'bullish' : 'bearish';
  const confidence = Math.min(100, 50 + Math.abs(bullishCount - bearishCount) * 10 + (majorPOI ? 20 : 0));

  return { trend, majorPOI, confidence };
};
