import path from 'path';
import fs from 'fs-extra';
import { MongoBins } from 'mongodb-prebuilt';
import { connectDatabase, populateDatabaseWithMockData } from '../src/db';
import { disconnect } from 'mongoose';
import sleep from 'sleep-promise';

export const startDb = async (port: number, dataPath: string) => {
  await fs.emptyDir(path.resolve(__dirname, '..', dataPath));
  const db = new MongoBins(
    'mongod',
    ['--port', port.toString(), '--dbpath', dataPath, ...process.argv.slice(4)],
    { stdio: 'inherit' },
  );
  console.log('Starting database...');
  await db.run();
  await sleep(2000);
  console.log('Connecting to database...');
  await connectDatabase('localhost', port);
  await populateDatabaseWithMockData();
  await disconnect();
  console.log('Done!');
};

startDb(+process.argv[2] || 11038, process.argv[3] || './db-data');
