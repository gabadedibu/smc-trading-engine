import { Router } from 'express';
import { signalService } from '../services/signalService';
import { AuthenticatedRequest } from '../middleware/auth';
import { Candle } from '../types';
import { generateSignal } from '../engine/signalGenerator';

const sampleCandles = (): Candle[] => {
  const candles: Candle[] = [];
  let base = 100;
  for (let i = 0; i < 150; i += 1) {
    const drift = Math.sin(i / 5) * 1.2 + (Math.random() - 0.5) * 0.8;
    const open = base;
    const close = base + drift;
    const high = Math.max(open, close) + Math.random() * 0.7;
    const low = Math.min(open, close) - Math.random() * 0.7;
    candles.push({ time: Math.floor(Date.now() / 1000) - (150 - i) * 60, open, high, low, close, volume: 100 + Math.random() * 100 });
    base = close;
  }
  return candles;
};

export const signalsRouter = Router();

signalsRouter.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const signals = await signalService.getAll(userId);
    return res.json(signals);
  } catch (error) {
    return next(error);
  }
});

signalsRouter.get('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const signal = await signalService.getById(userId, req.params.id);
    if (!signal) return res.status(404).json({ error: 'Signal not found', code: 'NOT_FOUND' });
    return res.json(signal);
  } catch (error) {
    return next(error);
  }
});

signalsRouter.post('/analyze', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { symbol = 'BTCUSDT', htfTimeframe = '4h', ltfTimeframe = '15m' } = req.body as {
      symbol?: string;
      htfTimeframe?: string;
      ltfTimeframe?: string;
    };

    const htfCandles = sampleCandles();
    const ltfCandles = sampleCandles();
    const signal = generateSignal(symbol, ltfTimeframe, htfCandles, ltfCandles);
    const saved = await signalService.create(userId, signal);

    return res.json(saved);
  } catch (error) {
    return next(error);
  }
});
