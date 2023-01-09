import { NextFunction, Request, Response } from 'express';

export function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(`${new Date()}: ${req.method} ${req.url}`);
  next();
}
