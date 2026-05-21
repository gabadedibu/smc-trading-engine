import { EventEmitter } from 'events';
import { Candle } from '../types';

const GRANULARITY: Record<string, string> = {
  M1: 'M1',
  M5: 'M5',
  M15: 'M15',
  H1: 'H1',
  H4: 'H4'
};

export class OandaFeed extends EventEmitter {
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly instrument: string, private readonly timeframe: keyof typeof GRANULARITY) {
    super();
  }

  start(): void {
    this.poll();
    this.timer = setInterval(() => this.poll(), 5000);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async poll(): Promise<void> {
    const token = process.env.OANDA_API_KEY;
    if (!token) return;

    const url = `https://api-fxtrade.oanda.com/v3/instruments/${this.instrument}/candles?granularity=${GRANULARITY[this.timeframe]}&count=200`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return;

    const data = (await response.json()) as {
      candles: Array<{ time: string; volume: number; mid: { o: string; h: string; l: string; c: string } }>;
    };

    for (const c of data.candles) {
      const candle: Candle = {
        time: Math.floor(new Date(c.time).getTime() / 1000),
        open: Number(c.mid.o),
        high: Number(c.mid.h),
        low: Number(c.mid.l),
        close: Number(c.mid.c),
        volume: c.volume
      };
      this.emit('candle', candle);
    }
  }
}
