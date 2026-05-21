import { useEffect, useState } from 'react';
import { useChartStore } from '../../store/chartStore';
import { useSignalStore } from '../../store/signalStore';

const frames = ['1m', '5m', '15m', '1h', '4h'];

export const TopBar = (): JSX.Element => {
  const { symbol, timeframe, setSymbol, setTimeframe } = useChartStore();
  const analyze = useSignalStore((state) => state.analyzeSymbol);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const id = window.setInterval(() => setPrice((v) => Number((v || 100 + Math.random() * 5).toFixed(2))), 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="card mb-4 flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="rounded border border-border bg-bg px-3 py-2">
          {['BTCUSDT', 'ETHUSDT', 'EUR_USD', 'GBP_USD', 'USD_JPY', 'XAU_USD'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {frames.map((f) => (
            <button
              key={f}
              onClick={() => setTimeframe(f)}
              className={`rounded px-3 py-1 text-sm ${timeframe === f ? 'bg-accent text-white' : 'bg-bg border border-border'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted">Live: {symbol}</p>
        <p className="font-semibold">{price.toFixed(2)}</p>
        <button className="rounded bg-accent px-3 py-2 text-sm text-white" onClick={() => void analyze(symbol, '4h', timeframe)}>
          Analyze
        </button>
      </div>
    </div>
  );
};
