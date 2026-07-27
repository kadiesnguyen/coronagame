const hash = require("object-hash");
const redisService = require("../services/redis.service");
const requestToKey = (req) => {
  // build a custom object to use as part of the Redis key
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  };
  return `${req.originalUrl}@${hash.sha1(reqDataToHash)}`;
};

const isRedisWorking = async () => {
  return !!(await redisService);
};
const readData = async (key) => {
  let cachedValue = undefined;

  // try to get the cached response from redis
  cachedValue = await (await redisService).get(key);
  if (cachedValue) {
    return cachedValue;
  }
};
const writeData = async (key, data, options) => {
  try {
    // write data to the Redis cache
    await (await redisService).set(key, data, options);
  } catch (e) {
    console.error(`Failed to cache data for key=${key}`, e);
  }
};

const redisCacheMiddleware = (
  options = {
    EX: 21600, // 6h
  }
) => {
  return async (req, res, next) => {
    if (await isRedisWorking()) {
      const key = requestToKey(req);
      // if there is some cached data, retrieve it and return it
      const cachedValue = await readData(key);
      if (cachedValue) {
        try {
          // if it is JSON data, then return it
          return res.json(JSON.parse(cachedValue));
        } catch {
          // if it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        // override how res.send behaves
        // to introduce the caching logic
        const oldSend = res.send;
        res.send = function (data) {
          // set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // cache the response only if it is successful
          if (res.statusCode.toString().startsWith("2")) {
            writeData(key, data, options).then();
          }

          return res.send(data);
        };

        // continue to the controller function
        next();
      }
    } else {
      // proceed with no caching
      next();
    }
  };
};

module.exports = {
  redisCacheMiddleware,
};
