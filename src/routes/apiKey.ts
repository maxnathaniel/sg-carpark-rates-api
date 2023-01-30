import express, { Request, Response } from 'express';

import { ApiKeyService } from '../services';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { email_address } = req.body;
  const pool = req.app.locals.connectionPool;

  try {
    const emailExists = await ApiKeyService.checkIfEmailExists(
      pool,
      email_address
    );
    if (!emailExists) {
      const apiKey = await ApiKeyService.generateApiKey(pool, email_address);
      res.send({
        data: apiKey,
        status: 0,
        err: '',
      });
    } else {
      res.send({
        data: [],
        status: -1,
        err: 'API Key already issued!',
      });
    }
  } catch (e: any) {
    console.error('Unable to generate new API key', e);
    res.send({
      data: '',
      status: -1,
      err: e.message,
    });
  }
});

router.get('/salt', (_req: Request, res: Response) => {
  try {
    const salt = ApiKeyService.generateSalt();
    res.send({
      data: { salt },
      status: 0,
      err: '',
    });
  } catch (e: any) {
    console.error('Error generating salt');
  }
});

router.post('/blacklist', async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const pool = req.app.locals.connectionPool;
  let apiKey = '';
  if (authorization && typeof authorization === 'string') {
    apiKey = authorization.split('apiKey ')[2];
  }
  try {
    await ApiKeyService.blacklistApiKey(pool, apiKey);
    res.send({
      data: [],
      status: 0,
      err: '',
    });
  } catch (e: any) {
    console.error('Unable to blacklist API key');
    res.send({
      data: '',
      status: -1,
      err: e.message,
    });
  }
});

export { router as ApiKeyRoute };
