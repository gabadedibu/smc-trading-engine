import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Candle } from '../types';

export class BinanceFeed extends EventEmitter {
  private socket: WebSocket | null = null;
  private retry = 0;

  constructor(private readonly symbol: string, private readonly interval: string) {
    super();
  }

  connect(): void {
    const stream = `${this.symbol.toLowerCase()}@kline_${this.interval}`;
    this.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

    this.socket.on('message', (data) => {
      const payload = JSON.parse(data.toString());
      if (!payload.k) return;
      const candle: Candle = {
        time: Math.floor(payload.k.t / 1000),
        open: Number(payload.k.o),
        high: Number(payload.k.h),
        low: Number(payload.k.l),
        close: Number(payload.k.c),
        volume: Number(payload.k.v)
      };
      this.emit('candle', candle);
    });

    this.socket.on('close', () => {
      this.reconnect();
    });

    this.socket.on('error', () => {
      this.socket?.close();
    });
  }

  private reconnect(): void {
    const delay = Math.min(30000, 1000 * 2 ** this.retry);
    this.retry += 1;
    setTimeout(() => this.connect(), delay);
  }
}
