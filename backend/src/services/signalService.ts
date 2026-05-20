import { prisma } from '../db';
import { EngineSignal } from '../types';

export const signalService = {
  getAll(userId: string) {
    return prisma.signal.findMany({ where: { userId }, orderBy: { timestamp: 'desc' } });
  },
  getById(userId: string, id: string) {
    return prisma.signal.findFirst({ where: { id, userId } });
  },
  async create(userId: string, signal: EngineSignal) {
    return prisma.signal.create({
      data: {
        userId,
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        type: signal.type,
        entryPrice: signal.entryPrice,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        riskRewardRatio: signal.riskRewardRatio,
        confidenceScore: Math.round(signal.confidenceScore),
        structureType: signal.structureType,
        htfTrend: signal.htfTrend,
        htfConfirmed: signal.htfConfirmed,
        ltfConfirmed: signal.ltfConfirmed,
        poiExplanation: signal.poiExplanation,
        tradeReason: signal.tradeReason,
        rejectionReason: signal.rejectionReason,
        timestamp: new Date(signal.timestamp)
      }
    });
  }
};
