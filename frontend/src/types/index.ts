export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  id?: string;
  symbol: string;
  timeframe: string;
  type: 'BUY' | 'SELL' | 'WAIT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  confidenceScore: number;
  structureType: 'internal' | 'external';
  htfTrend: 'bullish' | 'bearish';
  htfConfirmed: boolean;
  ltfConfirmed: boolean;
  poiExplanation: string;
  tradeReason: string;
  rejectionReason?: string;
  timestamp: string | number;
}

export interface Trade {
  id: string;
  status: string;
  pnl?: number;
  openedAt: string;
  closedAt?: string;
  signal: Signal;
}
