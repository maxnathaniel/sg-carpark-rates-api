import { Pool } from 'pg';
import { scryptSync } from 'crypto';

import {
  generateNewApiKey,
  generateSecretHash,
  _generateSalt,
} from '../../utils';

export class ApiKeyService {
  static checkIfEmailExists = async (pool: Pool, emailAddress: string) => {
    const query = {
      text: 'SELECT email_address FROM carpark.api_keys WHERE email_address = $1 AND is_blacklisted = $2',
      values: [emailAddress, false],
    };

    try {
      const data = await pool.query(query);
      if (data.rowCount === 1) {
        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  };

  static generateApiKey = async (pool: Pool, emailAddress: string) => {
    const [apiKey, hashedKey] = generateNewApiKey();
    const dateTime = new Date(Date.now()).toISOString();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const query = {
      text: 'INSERT INTO carpark.api_keys (hash, email_address, created_at, modified_at, expiry, is_blacklisted) VALUES($1, $2, $3, $4, $5, $6)',
      values: [
        hashedKey,
        emailAddress,
        dateTime,
        dateTime,
        expiry.toISOString(),
        false,
      ],
    };

    try {
      await pool.query(query);
      return apiKey;
    } catch (e: any) {
      throw e;
    }
  };

  static generateSalt = () => {
    return _generateSalt();
  };

  static validateApiKey = async (pool: Pool, apiKey: string) => {
    const hashedKey = scryptSync(apiKey, process.env.SALT!, 64).toString('hex');
    const now = new Date();
    const query = {
      text: 'SELECT hash, expiry, is_blacklisted from carpark.api_keys WHERE hash = $1',
      values: [hashedKey],
    };

    try {
      const data = await pool.query(query);
      if (
        data.rowCount > 0 &&
        !data.rows[0].is_blacklisted &&
        now < data.rows[0].expiry
      ) {
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      throw e;
    }
  };

  static blacklistApiKey = async (pool: Pool, apiKey: string) => {
    const query = {
      text: 'UPDATE carpark.api_keys SET is_blacklisted = $1 WHERE apiKey = $2',
      values: [true, generateSecretHash(apiKey)],
    };

    try {
      await pool.query(query);
      return true;
    } catch (e) {
      throw e;
    }
  };
}
