import { Router } from 'express';
import { authService } from '../services/authService';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Missing email/password', code: 'VALIDATION_ERROR' });
    const user = await authService.register(email, password);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Missing email/password', code: 'VALIDATION_ERROR' });
    const tokens = await authService.login(email, password);
    return res.json(tokens);
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken', code: 'VALIDATION_ERROR' });
    const token = await authService.refresh(refreshToken);
    return res.json(token);
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/logout', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    await authService.logout(req.user.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});
