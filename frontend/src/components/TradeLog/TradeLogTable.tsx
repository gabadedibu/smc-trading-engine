import { useSignalStore } from '../../store/signalStore';

export const TradeLogTable = (): JSX.Element => {
  const trades = useSignalStore((state) => state.trades).slice(0, 10);

  return (
    <div className="card mt-4 overflow-x-auto p-3">
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="py-2">Signal</th>
            <th>Status</th>
            <th>PNL</th>
            <th>Opened</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-border">
              <td className="py-2">{trade.signal.symbol} {trade.signal.type}</td>
              <td>{trade.status}</td>
              <td>{trade.pnl ?? '-'}</td>
              <td>{new Date(trade.openedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
