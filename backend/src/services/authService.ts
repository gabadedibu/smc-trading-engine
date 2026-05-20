import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

const signAccessToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  return jwt.sign({ userId, email }, secret, { expiresIn: ACCESS_EXPIRES_IN });
};

const signRefreshToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET missing');
  return jwt.sign({ userId, email }, secret, { expiresIn: REFRESH_EXPIRES_IN });
};

export const authService = {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hash } });
    return { id: user.id, email: user.email };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id, user.email);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error('JWT_REFRESH_SECRET missing');

    const payload = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: String(payload.userId) } });
    if (!user || user.refreshToken !== refreshToken) throw new Error('Invalid refresh token');

    return { accessToken: signAccessToken(user.id, user.email) };
  },

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }
};
