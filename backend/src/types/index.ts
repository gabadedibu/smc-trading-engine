export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SwingPoint {
  index: number;
  price: number;
  type: 'high' | 'low';
  scope: 'internal' | 'external';
}

export interface LiquidityZone {
  level: number;
  type: 'equalHigh' | 'equalLow';
  scope: 'internal' | 'external';
  indices: number[];
}

export interface BosResult {
  bullish: boolean;
  bearish: boolean;
  index: number;
  level: number;
}

export interface FvgZone {
  startIndex: number;
  endIndex: number;
  top: number;
  bottom: number;
  type: 'bullish' | 'bearish';
  filled: boolean;
}

export interface ProtectedLevel {
  type: 'high' | 'low';
  level: number;
  pointA: number;
  pointB: number;
  pointC: number;
}

export interface POI {
  top: number;
  bottom: number;
  type: 'bullish' | 'bearish';
}

export interface EngineSignal {
  type: 'BUY' | 'SELL' | 'WAIT';
  symbol: string;
  timeframe: string;
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
  timestamp: number;
}

export interface AuthRequestUser {
  userId: string;
  email: string;
}
