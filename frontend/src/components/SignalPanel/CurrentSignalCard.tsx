import { useSignalStore } from '../../store/signalStore';

const color = { BUY: 'bg-buy', SELL: 'bg-sell', WAIT: 'bg-wait' } as const;

export const CurrentSignalCard = (): JSX.Element => {
  const signal = useSignalStore((state) => state.currentSignal);
  const loading = useSignalStore((state) => state.loading);

  if (loading) {
    return <div className="card h-72 animate-pulse" />;
  }

  if (!signal) {
    return <div className="card p-4 text-sm text-muted">No signal yet.</div>;
  }

  return (
    <div className="card w-full p-4 md:w-[320px]">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded px-3 py-1 text-xs font-semibold text-white ${color[signal.type]}`}>{signal.type}</span>
        <span className="text-sm">{signal.confidenceScore}%</span>
      </div>
      <div className="space-y-2 text-sm">
        <p>Entry: <span className="text-accent">{signal.entryPrice.toFixed(4)}</span></p>
        <p>SL: <span className="text-sell">{signal.stopLoss.toFixed(4)}</span></p>
        <p>TP: <span className="text-buy">{signal.takeProfit.toFixed(4)}</span></p>
        <p>RR: {signal.riskRewardRatio.toFixed(2)}</p>
        <p className="text-muted">{signal.tradeReason}</p>
      </div>
    </div>
  );
};
