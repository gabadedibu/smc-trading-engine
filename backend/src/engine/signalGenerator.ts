import { Candle, EngineSignal } from '../types';
import { detectBOS } from './bosDetector';
import { detectFVGs } from './fvgDetector';
import { evaluateHTFConfluence } from './htfConfluenceEngine';
import { detectInducement } from './inducementDetector';
import { detectLiquidity } from './liquidityDetector';
import { confirmLTF } from './ltfConfirmationEngine';
import { validatePOI } from './poiEngine';
import { detectProtectedLevel } from './protectedLevelDetector';
import { detectStructure } from './structureDetector';
import { detectVolumeViolation } from './volumeViolationDetector';

export const generateSignal = (symbol: string, timeframe: string, htfCandles: Candle[], ltfCandles: Candle[]): EngineSignal => {
  const structure = detectStructure(ltfCandles);
  const liquidity = detectLiquidity(ltfCandles);
  const bos = detectBOS(ltfCandles, structure.swings);
  const fvgs = detectFVGs(ltfCandles);
  const inducement = detectInducement(ltfCandles, fvgs[0] ?? null);
  const protectedLevel = detectProtectedLevel(ltfCandles, liquidity.swept.at(-1), bos);
  const poi = validatePOI(protectedLevel, inducement, fvgs);
  const htf = evaluateHTFConfluence(htfCandles, poi.poi);
  const volume = detectVolumeViolation(ltfCandles, poi.poi);

  const direction = htf.trend;
  const ltf = confirmLTF(ltfCandles, {
    sweep: Boolean(liquidity.swept.length),
    bos,
    inducement: inducement.isInducement,
    retest: volume.retestHeld,
    direction
  });

  const current = ltfCandles.at(-1);
  if (!current) {
    throw new Error('No candle data available for signal generation.');
  }

  const rejectReasons: string[] = [];
  const lowVolume = ltfCandles.length > 10
    ? Math.abs(current.close - current.open) < ltfCandles.slice(-11, -1).reduce((acc, c) => acc + Math.abs(c.close - c.open), 0) / 10
    : false;

  if (!inducement.isInducement) rejectReasons.push('No valid inducement.');
  if (!poi.valid) rejectReasons.push('No valid FVG in POI.');
  if (!liquidity.swept.length) rejectReasons.push('No liquidity sweep.');
  if (!bos) rejectReasons.push('No BOS confirmed.');
  if (lowVolume) rejectReasons.push('Low volume breakout.');
  if (!volume.violated || !volume.retestHeld) rejectReasons.push('Volume violation retest not confirmed.');
  if (!ltf.confirmed) rejectReasons.push(...ltf.reasons);

  const isBuy = htf.trend === 'bullish' && protectedLevel?.type === 'low' && bos?.bullish;
  const isSell = htf.trend === 'bearish' && protectedLevel?.type === 'high' && bos?.bearish;

  let type: 'BUY' | 'SELL' | 'WAIT' = 'WAIT';
  if (rejectReasons.length === 0 && isBuy) type = 'BUY';
  if (rejectReasons.length === 0 && isSell) type = 'SELL';

  const stopLoss = type === 'BUY' ? current.low : current.high;
  const liquidityTargets = liquidity.zones
    .filter((z) => (type === 'BUY' ? z.type === 'equalHigh' : z.type === 'equalLow'))
    .sort((a, b) => type === 'BUY' ? a.level - b.level : b.level - a.level);
  const takeProfit = liquidityTargets[0]?.level ?? (type === 'BUY' ? current.close * 1.01 : current.close * 0.99);
  const rr = Math.abs((takeProfit - current.close) / (current.close - stopLoss || 1));

  const explanation = type === 'BUY'
    ? `Bullish protected low formed after internal liquidity sweep and BOS confirmation. HTF trend bullish. Bullish FVG respected at ${poi.poi?.bottom ?? current.close}.`
    : type === 'SELL'
      ? `Bearish protected high formed after internal liquidity sweep and BOS confirmation. HTF trend bearish. Bearish FVG respected at ${poi.poi?.top ?? current.close}.`
      : 'Trade rejected due to failing mandatory confluence checks.';

  return {
    type,
    symbol,
    timeframe,
    entryPrice: current.close,
    stopLoss,
    takeProfit,
    riskRewardRatio: Number(rr.toFixed(2)),
    confidenceScore: Math.max(0, Math.min(100, htf.confidence - rejectReasons.length * 8)),
    structureType: structure.swings.at(-1)?.scope ?? 'internal',
    htfTrend: htf.trend,
    htfConfirmed: true,
    ltfConfirmed: ltf.confirmed,
    poiExplanation: poi.reasons.join(' '),
    tradeReason: explanation,
    rejectionReason: type === 'WAIT' ? `Trade rejected: ${rejectReasons.join(' ')}` : undefined,
    timestamp: Date.now()
  };
};
