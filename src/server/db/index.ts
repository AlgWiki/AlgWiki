import { connect, Mongoose } from 'mongoose';
import MongoInMemory from 'mongo-in-memory';
import Task from './models/task';
import { mockTask } from '../../mocks/challenge';
import { isDev } from '../../utils/env';

export const DB_NAME = 'edgecase';

export const connectDatabase = async (connectionUri: string): Promise<Mongoose> => {
  const db = await connect(connectionUri);
  console.log('Database connection established');

  if (isDev()) {
    populateDatabaseWithMockData(db);
  }

  return db;
};

export const startTestDatabase = async (port: number): Promise<string> => {
  const server = new MongoInMemory(port);
  await server.start();
  console.log(`In-memory database started on port ${port}`);

  const stopTestDatabase = async () => {
    console.log('Stopping database server...');
    await server.stop();
    console.log('Database stopped.');
  };
  process.once('exit', stopTestDatabase);
  process.once('SIGUSR2', async () => {
    // Stop on nodemon restart
    await stopTestDatabase();
    process.kill(process.pid, 'SIGUSR2');
  });
  process.once('SIGINT', async () => {
    // Stop on CTRL-C
    await stopTestDatabase();
    process.kill(process.pid, 'SIGINT');
  });

  return server.getMongouri(DB_NAME);
};

export const populateDatabaseWithMockData = async (db: Mongoose) => {
  const sampleTask = new Task(mockTask);
  await sampleTask.save();
};
