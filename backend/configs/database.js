const database = {
  development: {
    mongodbConnectionString: process.env.DATABASE_DEV,
    redisConnectionString: process.env.REDIS_DEV,
  },
  production: {
    mongodbConnectionString: process.env.DATABASE,
    redisConnectionString: process.env.REDIS,
  },
};

module.exports = database[process.env.NODE_ENV || "development"];
