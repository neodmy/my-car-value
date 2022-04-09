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
    }),
    production: () => ({
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    }),
    default: () => {
      throw new Error('unknown environment');
    },
  };
  return envs[process.env.NODE_ENV || 'default']();
};

const dbConfig = {
  synchronize: false,
  ...getEnvConfig(),
};

module.exports = dbConfig;
