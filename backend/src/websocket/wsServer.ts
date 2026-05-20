import http from 'http';
import jwt from 'jsonwebtoken';
import WebSocket, { WebSocketServer } from 'ws';

interface WSClient extends WebSocket {
  userId?: string;
}

export class TradingWsServer {
  private wss: WebSocketServer;

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server, path: '/' });
    this.wss.on('connection', (socket: WSClient, req) => {
      const url = new URL(req.url ?? '', `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      const secret = process.env.JWT_SECRET;

      if (!token || !secret) {
        socket.close();
        return;
      }

      try {
        const payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
        socket.userId = String(payload.userId);
      } catch {
        socket.close();
      }
    });
  }

  broadcast(event: { type: 'candle_update' | 'signal_generated' | 'structure_update' | 'poi_detected'; [key: string]: unknown }): void {
    const payload = JSON.stringify(event);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
