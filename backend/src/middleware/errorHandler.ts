import { NextFunction, Request, Response } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    code: err.code ?? 'INTERNAL_ERROR'
  });
};
