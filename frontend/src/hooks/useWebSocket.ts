import { useEffect, useRef } from 'react';
import { wsUrl } from '../services/websocket';
import { useAuthStore } from '../store/authStore';
import { useChartStore } from '../store/chartStore';
import { useSignalStore } from '../store/signalStore';

export const useWebSocket = (): void => {
  const token = useAuthStore((state) => state.accessToken);
  const addCandle = useChartStore((state) => state.addCandle);
  const setCurrentSignal = useSignalStore((state) => state.setCurrentSignal);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!token) return;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const connect = () => {
      socket = new WebSocket(wsUrl(token));

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as { type: string; candle?: unknown; signal?: unknown };
        if (message.type === 'candle_update' && message.candle) {
          addCandle(message.candle as never);
        }
        if (message.type === 'signal_generated' && message.signal) {
          setCurrentSignal(message.signal as never);
        }
      };

      socket.onclose = () => {
        const delay = Math.min(30000, 1000 * 2 ** retryRef.current);
        retryRef.current += 1;
        reconnectTimer = window.setTimeout(connect, delay);
      };

      socket.onopen = () => {
        retryRef.current = 0;
      };
    };

    connect();

    return () => {
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [token, addCandle, setCurrentSignal]);
};
