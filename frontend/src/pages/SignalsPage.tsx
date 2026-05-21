import { useMemo, useState } from 'react';
import { useSignalStore } from '../store/signalStore';

export const SignalsPage = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const signals = useSignalStore((state) => state.signals);

  const filtered = useMemo(() => signals.filter((signal) => signal.symbol.toLowerCase().includes(query.toLowerCase())), [signals, query]);

  return (
    <div className="card overflow-x-auto p-4">
      <input
        className="mb-4 w-full rounded border border-border bg-bg px-3 py-2 md:w-72"
        placeholder="Search symbol"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th>Symbol</th><th>Type</th><th>Confidence</th><th>Entry</th><th>SL</th><th>TP</th><th>RR</th><th>HTF</th><th>LTF</th><th>Timestamp</th><th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((signal) => (
            <tr key={`${signal.symbol}-${signal.timestamp}`} className="border-t border-border">
              <td className="py-2">{signal.symbol}</td>
              <td>{signal.type}</td>
              <td>{signal.confidenceScore}</td>
              <td>{signal.entryPrice.toFixed(4)}</td>
              <td>{signal.stopLoss.toFixed(4)}</td>
              <td>{signal.takeProfit.toFixed(4)}</td>
              <td>{signal.riskRewardRatio.toFixed(2)}</td>
              <td>{signal.htfConfirmed ? 'Yes' : 'No'}</td>
              <td>{signal.ltfConfirmed ? 'Yes' : 'No'}</td>
              <td>{new Date(signal.timestamp).toLocaleString()}</td>
              <td className="max-w-xs truncate">{signal.tradeReason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
