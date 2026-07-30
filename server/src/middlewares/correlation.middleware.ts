// src/common/middlewares/correlation.middleware.ts
import { correlationStore } from '@/utils/correlationStore';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';


export const correlationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // استخدام Correlation ID القادم من العميل إن وجد أو توليد واحد جديد
  const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();

  // إرفاقه بالـ Response Headers لسهولة الـ Tracing من جهة العميل
  res.setHeader('X-Correlation-ID', correlationId);

  // تخزينه في الـ AsyncLocalStorage طوال دورة حياة الـ Request
  correlationStore.run({ correlationId }, () => {
    next();
  });
};