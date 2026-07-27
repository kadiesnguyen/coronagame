"use strict";
const { createClient } = require("redis");
const { RedisClientType } = require("@redis/client");
const { redisConnectionString } = require("../configs/database");
const { BadRequestError } = require("../utils/app_error");
const STATUS_CONNECTION_REDIS = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

const TIMEOUT_CONNECT_REDIS = 10000;

let connectRef = null;

const handleTimeoutConnectError = () => {
  // Retry after 10s -> throw error
  connectRef = setTimeout(() => {
    throw new BadRequestError("Không thể kết nối tới Redis");
  }, TIMEOUT_CONNECT_REDIS);
};

class RedisService {
  constructor() {
    this.instance = null;
  }

  static handleConnectRedis({ redisClient }) {
    if (redisClient) {
      redisClient.on(STATUS_CONNECTION_REDIS.CONNECT, () => {
        console.log("Redis connected");
        clearTimeout(connectRef);
      });
      redisClient.on(STATUS_CONNECTION_REDIS.RECONNECT, () => {
        console.log("Redis reconnecting");
      });
      redisClient.on(STATUS_CONNECTION_REDIS.END, () => {
        console.log("Redis disconnected");
        // handle retry connect
        handleTimeoutConnectError();
      });
      redisClient.on(STATUS_CONNECTION_REDIS.ERROR, (err) => {
        console.log("Redis connect error: ", err);
        // handle retry connect
        handleTimeoutConnectError();
      });
    }
  }
  static async connect() {
    const client = createClient({
      url: redisConnectionString,
    });
    this.handleConnectRedis({ redisClient: client });
    await client.connect();
    return client;
  }
  /**
   *
   * @returns {RedisClientType}
   */

  static async getInstance() {
    if (!this.instance) {
      this.instance = await this.connect();
    }
    return this.instance;
  }
}
module.exports = RedisService.getInstance();
