import express, { Request, Response } from 'express';

import { ApiKeyService, CarparkRatesService } from '../services/';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const pool = req.app.locals.connectionPool;
  const { authorization } = req.headers;
  let apiKey = '';
  if (authorization && typeof authorization === 'string') {
    apiKey = authorization.split('apiKey ')[1];
  }

  try {
    const isAuthenticated = await ApiKeyService.validateApiKey(pool, apiKey);
    if (isAuthenticated) {
      const data = await CarparkRatesService.getAll(pool);
      res.send({
        data,
        status: 0,
        err: '',
      });
    } else {
      res.send({
        data: [],
        status: -1,
        err: 'Not Authorized!',
      });
    }
  } catch (e: any) {
    console.error('Error getting Carpark rates', e);
    res.send({
      data: [],
      status: -1,
      err: e.message,
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const pool = req.app.locals.connectionPool;
  try {
    await CarparkRatesService.addAll(pool);
    res.send({
      data: [],
      status: 0,
      err: '',
    });
  } catch (e: any) {
    console.error('Error inserting Carpark rates', e);
    res.send({
      data: [],
      status: -1,
      err: e.message,
    });
  }
});

export { router as CarparkRoute };
