import { Router } from 'express';
import { Candle } from '../types';

const symbols = ['BTCUSDT', 'ETHUSDT', 'EUR_USD', 'GBP_USD', 'USD_JPY', 'XAU_USD'];

const generateCandles = (symbol: string): Candle[] => {
  const candles: Candle[] = [];
  let base = symbol.includes('USD') ? 100 : 1;
  for (let i = 0; i < 200; i += 1) {
    const volatility = symbol.includes('BTC') ? 2 : 0.5;
    const drift = Math.sin(i / 10) * volatility + (Math.random() - 0.5) * volatility;
    const open = base;
    const close = base + drift;
    candles.push({
      time: Math.floor(Date.now() / 1000) - (200 - i) * 60,
      open,
      high: Math.max(open, close) + Math.random() * volatility,
      low: Math.min(open, close) - Math.random() * volatility,
      close,
      volume: Math.round(500 + Math.random() * 1000)
    });
    base = close;
  }
  return candles;
};

export const marketRouter = Router();

marketRouter.get('/symbols', (_req, res) => {
  res.json(symbols);
});

marketRouter.get('/candles', (req, res) => {
  const { symbol = 'BTCUSDT', timeframe = '1h' } = req.query as { symbol?: string; timeframe?: string };
  res.json({ symbol, timeframe, candles: generateCandles(symbol) });
});
