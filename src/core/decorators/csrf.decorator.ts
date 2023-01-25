
import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';

import { csrf } from '@/core/csrf';
import { NextTijaRequest, NextTijaResponse } from '@/core/types';

export const CsrfToken = createMiddlewareDecorator(
  async (req: NextTijaRequest, res: NextTijaResponse, next: NextFunction) => {
    await csrf(req, res);
    next();
  }
)