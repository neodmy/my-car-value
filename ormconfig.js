const getEnvConfig = () => {
  const envs = {
    development: () => ({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    }),
    test: () => ({
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    }),
    production: () => ({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    default: () => {
      throw new Error('unknown environment');
    },
  };
  return envs[process.env.NODE_ENV || 'default']();
};

const dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  ...getEnvConfig(),
};

module.exports = dbConfig;
