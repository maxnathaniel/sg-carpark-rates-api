import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { ApiKeyRoute, CarparkRoute } from './routes';
import { createConnectionPool } from './utils';

dotenv.config();

const connectionPool = createConnectionPool();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.locals.connectionPool = connectionPool;

app.use('/carpark-rates', CarparkRoute);
app.use('/api-keys', ApiKeyRoute);

app.listen(port, () => {
  console.log(`Carpark Rates API server listening on port ${port}`);
});
