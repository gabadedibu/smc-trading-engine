export const wsUrl = (token: string): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://localhost:8080?token=${encodeURIComponent(token)}`;
};
