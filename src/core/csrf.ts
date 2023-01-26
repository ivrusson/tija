import csurf from 'csurf';

import { NextTijaRequest, NextTijaResponse } from '@/core/types';

export function csrf(req: NextTijaRequest, res: NextTijaResponse) {
  return new Promise((resolve, reject) => {
    csurf({ cookie: true })(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
