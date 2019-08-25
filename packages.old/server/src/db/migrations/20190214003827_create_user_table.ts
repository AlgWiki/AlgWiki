import Knex from 'knex';

export const up = async (knex: Knex) => {
  knex.schema.createTable('user', table => {
    table
      .integer('id')
      .primary()
      .notNullable();
    table.string('email').notNullable();
    table.string('display_name').notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  knex.schema.dropTableIfExists('user');
};
