// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: process.env['SQLITE3_DB_FILENAME']
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env['DB_NAME'],
      user:     process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD']
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env['DB_NAME'],
      user:     process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD']
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
        filename: process.env['SQLITE3_DB_FILENAME']
    }
  }
};
