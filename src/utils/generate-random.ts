import { randomUUID } from 'node:crypto';

const generateRandomString = (length: number) => {
  return randomUUID().replace(/-/g, '').substring(0, length);
};

export { generateRandomString };
