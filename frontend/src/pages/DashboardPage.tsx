import { useEffect } from 'react';
import { TradingChart } from '../components/Chart/TradingChart';
import { TopBar } from '../components/Dashboard/TopBar';
import { CurrentSignalCard } from '../components/SignalPanel/CurrentSignalCard';
import { TradeLogTable } from '../components/TradeLog/TradeLogTable';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useChartStore } from '../store/chartStore';
import { useSignals } from '../hooks/useSignals';
import { useWebSocket } from '../hooks/useWebSocket';

export const DashboardPage = (): JSX.Element => {
  const token = useAuthStore((state) => state.accessToken);
  const { symbol, timeframe, setCandles } = useChartStore();
  useSignals();
  useWebSocket();

  useEffect(() => {
    if (!token) return;
    api.fetchMarketCandles(token, symbol, timeframe)
      .then((data) => setCandles(data.candles as never))
      .catch(() => setCandles([]));
  }, [token, symbol, timeframe, setCandles]);

  return (
    <div>
      <TopBar />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <TradingChart />
        <CurrentSignalCard />
      </div>
      <TradeLogTable />
    </div>
  );
};
