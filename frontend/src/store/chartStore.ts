import { create } from 'zustand';
import { Candle } from '../types';

interface ChartState {
  candles: Candle[];
  symbol: string;
  timeframe: string;
  setSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: string) => void;
  setCandles: (candles: Candle[]) => void;
  addCandle: (candle: Candle) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  candles: [],
  symbol: 'BTCUSDT',
  timeframe: '1h',
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setCandles: (candles) => set({ candles }),
  addCandle: (candle) => set((state) => {
    const candles = [...state.candles];
    const last = candles[candles.length - 1];
    if (last && last.time === candle.time) {
      candles[candles.length - 1] = candle;
    } else {
      candles.push(candle);
    }
    return { candles: candles.slice(-300) };
  })
}));
