import { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';

export const useSignals = (): void => {
  const fetchSignals = useSignalStore((state) => state.fetchSignals);
  const fetchTrades = useSignalStore((state) => state.fetchTrades);

  useEffect(() => {
    void fetchSignals();
    void fetchTrades();
  }, [fetchSignals, fetchTrades]);
};
