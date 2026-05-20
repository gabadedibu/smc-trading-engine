import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { authRouter } from './routes/auth';
import { signalsRouter } from './routes/signals';
import { tradesRouter } from './routes/trades';
import { marketRouter } from './routes/market';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { TradingWsServer } from './websocket/wsServer';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/signals', authMiddleware, signalsRouter);
app.use('/api/trades', authMiddleware, tradesRouter);
app.use('/api/market', authMiddleware, marketRouter);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
const wsPort = Number(process.env.WS_PORT ?? 8080);

const httpServer = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`REST API running on ${port}`);
});

const wsServer = http.createServer();
const tradingWs = new TradingWsServer(wsServer);
wsServer.listen(wsPort, () => {
  // eslint-disable-next-line no-console
  console.log(`WS server running on ${wsPort}`);
});

setInterval(() => {
  tradingWs.broadcast({
    type: 'structure_update',
    symbol: 'BTCUSDT',
    bos: { bullish: Math.random() > 0.5, level: 100000 + Math.random() * 1000 }
  });
}, 10000);
