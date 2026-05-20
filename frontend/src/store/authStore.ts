import { create } from 'zustand';
import { api } from '../services/api';

interface AuthState {
  user: { email: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: false,
  error: null,
  async login(email, password) {
    set({ loading: true, error: null });
    try {
      const tokens = await api.login(email, password);
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: { email }, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },
  async register(email, password) {
    set({ loading: true, error: null });
    try {
      await api.register(email, password);
      await get().login(email, password);
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null });
  },
  async refresh() {
    const refreshToken = get().refreshToken;
    if (!refreshToken) return;
    const token = await api.refresh(refreshToken);
    localStorage.setItem('accessToken', token.accessToken);
    set({ accessToken: token.accessToken });
  }
}));
