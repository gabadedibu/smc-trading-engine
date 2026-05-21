import { Router } from 'express';
import { prisma } from '../db';
import { AuthenticatedRequest } from '../middleware/auth';

export const tradesRouter = Router();

tradesRouter.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const trades = await prisma.trade.findMany({ where: { userId }, include: { signal: true }, orderBy: { openedAt: 'desc' } });
    return res.json(trades);
  } catch (error) {
    return next(error);
  }
});

tradesRouter.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { signalId } = req.body as { signalId?: string };
    if (!signalId) return res.status(400).json({ error: 'Missing signalId', code: 'VALIDATION_ERROR' });

    const trade = await prisma.trade.create({ data: { userId, signalId, status: 'OPEN' } });
    return res.status(201).json(trade);
  } catch (error) {
    return next(error);
  }
});

tradesRouter.patch('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { status, pnl } = req.body as { status?: string; pnl?: number };

    const existing = await prisma.trade.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) return res.status(404).json({ error: 'Trade not found', code: 'NOT_FOUND' });

    const trade = await prisma.trade.update({
      where: { id: req.params.id },
      data: {
        status,
        pnl,
        closedAt: status === 'CLOSED' ? new Date() : null
      }
    });

    return res.json(trade);
  } catch (error) {
    return next(error);
  }
});
