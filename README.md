# ███████╗███╗   ███╗ ██████╗    ████████╗██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗ 
# ██╔════╝████╗ ████║██╔════╝    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ 
# ███████╗██╔████╔██║██║            ██║   ██████╔╝███████║██║  ██║██║██╔██╗ ██║██║  ███╗
# ╚════██║██║╚██╔╝██║██║            ██║   ██╔══██╗██╔══██║██║  ██║██║██║╚██╗██║██║   ██║
# ███████║██║ ╚═╝ ██║╚██████╗       ██║   ██║  ██║██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝
# ╚══════╝╚═╝     ╚═╝ ╚═════╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ 

Professional Smart Money Concepts (SMC) trading engine with a production-focused TypeScript monorepo: React/Vite frontend, Express backend, PostgreSQL/Prisma persistence, and real-time WebSocket updates.

## Features
- Full SMC modular engine (structure, liquidity, BOS, FVG, inducement, protected levels, POI, HTF/LTF confluence, volume violation, signal generation)
- JWT + refresh-token auth
- Protected market/signals/trades APIs
- Binance + OANDA feed adapters
- Trading dashboard with lightweight-charts overlays
- Mobile-responsive dark fintech UI
- Dockerized frontend/backend/postgres stack

## Tech Stack
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)

## Architecture
```text
[Binance WS] [OANDA REST]
      \          /
       \        /
      [SMC Engine + Express API] --- [WebSocket Server]
                 |
           [Prisma + PostgreSQL]
                 |
       [React Dashboard + Zustand]
```

## Quick Start (Docker)
```bash
cp .env.example .env
docker compose up --build
open http://localhost:5173
```

## Manual Setup
### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run build
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run dev
```

## API Reference
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Logout and clear refresh token |
| GET | /api/signals | List user signals |
| GET | /api/signals/:id | Get single signal |
| POST | /api/signals/analyze | Analyze and generate signal |
| GET | /api/trades | List user trades |
| POST | /api/trades | Open trade from signal |
| PATCH | /api/trades/:id | Update trade status or pnl |
| GET | /api/market/symbols | Supported symbols |
| GET | /api/market/candles | Candle history by symbol/timeframe |

## SMC Engine
Engine modules are in `backend/src/engine`. Signal generation strictly combines trend confluence, protected level logic, liquidity sweep + BOS, inducement validation, FVG checks, volume violation retests, and LTF confirmations before BUY/SELL output.

## Environment Variables
| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Access token secret |
| JWT_REFRESH_SECRET | Refresh token secret |
| OANDA_API_KEY | OANDA API token |
| OANDA_ACCOUNT_ID | OANDA account id |
| BINANCE_API_KEY | Binance API key |
| BINANCE_SECRET | Binance API secret |
| PORT | REST server port |
| WS_PORT | WS server port |

## Contributing
1. Fork and create a feature branch
2. Run build checks for backend and frontend
3. Open PR with clear testing notes and screenshots
