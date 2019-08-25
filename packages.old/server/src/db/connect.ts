import path from 'path';
import Knex from 'knex';
import {
  DEFAULT_HOST,
  DEFAULT_USER,
  DEFAULT_PASSWORD,
  DEFAULT_DB,
  MIGRATIONS_TABLE_NAME,
} from 'common/dist/config/db/server';

export const migrationsDir = path.resolve(
  __dirname,
  '..',
  '..',
  'node_modules',
  'common',
  'dist',
  'migrations',
);

export const createKnex = (host: string, user: string, password: string, database: string) =>
  Knex({
    client: 'pg',
    connection: {
      host,
      user,
      password,
      database,
    },
    migrations: {
      directory: migrationsDir,
      tableName: MIGRATIONS_TABLE_NAME,
    },
  });

export const getDbConnection = () =>
  createKnex(DEFAULT_HOST, DEFAULT_USER, DEFAULT_PASSWORD, DEFAULT_DB);

export const runMigrations = async () => {
  const db = getDbConnection();
  await db.migrate.latest();
};
