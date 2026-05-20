export const wsUrl = (token: string): string => {
  const configuredBase = (import.meta.env.VITE_WS_URL as string | undefined)?.replace(/\/$/, '');
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const base = configuredBase ?? `${protocol}://localhost:8080`;
  return `${base}?token=${encodeURIComponent(token)}`;
};
