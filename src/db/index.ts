import { connect, Mongoose } from 'mongoose';
import sleep from 'sleep-promise';
import Task from './models/task';
import { mockTask } from '../client/common/mock-data/challenge';

export const DB_NAME = 'alg';
export const RETRY_DELAY = 2000;
export const MAX_RETRIES = 5;

export const connectDatabase = async (host: string, port: number): Promise<Mongoose> => {
  const uri = `mongodb://${host}:${port}/${DB_NAME}`;
  let tries = 0;
  while (true) {
    try {
      const db = await connect(uri);
      console.log('Database connection established');
      return db;
    } catch (err) {
      if (++tries >= MAX_RETRIES) {
        throw err;
      }
    }
    console.log('Database connection failed, waiting to retry...');
    await sleep(RETRY_DELAY);
  }
};

export const populateDatabaseWithMockData = async () => {
  const sampleTask = new Task(mockTask);
  await sampleTask.save();
};
