import fs from 'node:fs';
import path from 'node:path';

export const resolveMockFilePath = (dirname: string, fileName: string) => {
  const filePath = path.resolve(dirname, `./__mocks__/${fileName}`);
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  throw new Error(`File ${fileName} not found`);
};
