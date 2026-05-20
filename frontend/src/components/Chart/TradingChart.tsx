import { useEffect, useRef } from 'react';
import { ColorType, createChart } from 'lightweight-charts';
import { useChartStore } from '../../store/chartStore';
import { useSignalStore } from '../../store/signalStore';

export const TradingChart = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const candles = useChartStore((state) => state.candles);
  const signal = useSignalStore((state) => state.currentSignal);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#111118' }, textColor: '#e2e8f0' },
      grid: { vertLines: { color: '#1e1e2e' }, horzLines: { color: '#1e1e2e' } },
      width: containerRef.current.clientWidth,
      height: 460
    });
    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderVisible: false
    });

    series.setData(candles.map((c) => ({ time: c.time as never, open: c.open, high: c.high, low: c.low, close: c.close })));

    if (signal) {
      series.createPriceLine({ price: signal.entryPrice, color: '#6366f1', lineStyle: 2, title: 'POI' });
      series.createPriceLine({ price: signal.stopLoss, color: '#ef4444', lineStyle: 1, title: 'SL' });
      series.createPriceLine({ price: signal.takeProfit, color: '#22c55e', lineStyle: 1, title: 'TP' });
      series.createPriceLine({ price: signal.entryPrice * 1.002, color: '#3b82f6', lineStyle: 2, title: 'BOS' });
      series.createPriceLine({ price: signal.entryPrice * 0.998, color: '#facc15', lineStyle: 2, title: 'Liquidity' });
    }

    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [candles, signal]);

  return <div ref={containerRef} className="card h-[460px] w-full" />;
};
