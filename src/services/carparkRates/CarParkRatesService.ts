import { Pool } from 'pg';

import { insertIntoTable } from '../../utils';

export class CarparkRatesService {
  static getAll = async (pool: Pool) => {
    try {
      const query = {
        text: 'SELECT * FROM carpark.carpark_rates;',
      };
      const data = await pool.query(query);

      return data.rows;
    } catch (e) {
      throw e;
    }
  };

  static addAll = async (pool: Pool) => {
    try {
      await insertIntoTable(pool);
    } catch (e) {
      throw e;
    }
  };
}
