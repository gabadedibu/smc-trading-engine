import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequestUser } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: AuthRequestUser;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = { userId: String(payload.userId), email: String(payload.email) };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};
