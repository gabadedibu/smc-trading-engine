import { create } from 'zustand';
import { api } from '../services/api';
import { Signal, Trade } from '../types';
import { useAuthStore } from './authStore';

interface SignalState {
  signals: Signal[];
  currentSignal: Signal | null;
  trades: Trade[];
  loading: boolean;
  fetchSignals: () => Promise<void>;
  analyzeSymbol: (symbol: string, htfTimeframe: string, ltfTimeframe: string) => Promise<void>;
  fetchTrades: () => Promise<void>;
  setCurrentSignal: (signal: Signal) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  currentSignal: null,
  trades: [],
  loading: false,
  async fetchSignals() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;
    set({ loading: true });
    const signals = await api.fetchSignals(token) as Signal[];
    set({ signals, currentSignal: signals[0] ?? null, loading: false });
  },
  async analyzeSymbol(symbol, htfTimeframe, ltfTimeframe) {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;
    set({ loading: true });
    const signal = await api.analyzeSymbol(token, symbol, htfTimeframe, ltfTimeframe) as Signal;
    set((state) => ({ signals: [signal, ...state.signals], currentSignal: signal, loading: false }));
  },
  async fetchTrades() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;
    const trades = await api.fetchTrades(token) as Trade[];
    set({ trades });
  },
  setCurrentSignal: (signal) => set({ currentSignal: signal })
}));
