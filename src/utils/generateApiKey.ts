import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const generateKey = (size = 32, format = 'base64') => {
  const buffer = randomBytes(size);
  return buffer.toString(format as 'base64');
};

export const _generateSalt = () => {
  return randomBytes(32).toString('hex').slice(0, 10);
};

export const generateSecretHash = (apiKey: string) => {
  return scryptSync(apiKey, process.env.SALT!, 64).toString('hex');
};

export const generateNewApiKey = () => {
  const apiKey = generateKey();
  const hashedKey = generateSecretHash(apiKey);

  return [apiKey, hashedKey];
};

export const validateApiKey = (hashedKey: string, suppliedKey: string) => {
  const buffer = scryptSync(suppliedKey, process.env.SALT!, 64) as Buffer;
  return timingSafeEqual(Buffer.from(hashedKey), buffer);
};
