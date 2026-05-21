const parse = async <T>(response: Response): Promise<T> => {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error ?? 'Request failed');
  }
  return body as T;
};

export const api = {
  register: (email: string, password: string) => fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(parse),

  login: (email: string, password: string) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(parse<{ accessToken: string; refreshToken: string }>),

  refresh: (refreshToken: string) => fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  }).then(parse<{ accessToken: string }>),

  fetchSignals: (token: string) => fetch('/api/signals', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(parse),

  analyzeSymbol: (token: string, symbol: string, htfTimeframe: string, ltfTimeframe: string) => fetch('/api/signals/analyze', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, htfTimeframe, ltfTimeframe })
  }).then(parse),

  fetchTrades: (token: string) => fetch('/api/trades', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(parse),

  fetchMarketCandles: (token: string, symbol: string, timeframe: string) => fetch(`/api/market/candles?symbol=${symbol}&timeframe=${timeframe}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(parse<{ symbol: string; timeframe: string; candles: unknown[] }>),

  fetchSymbols: (token: string) => fetch('/api/market/symbols', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(parse<string[]>)
};
