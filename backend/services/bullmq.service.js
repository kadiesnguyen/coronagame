"use strict";
const { Queue, Worker } = require("bullmq");
const { LOAI_GAME } = require("../configs/game.config");
const Redis = require("ioredis");
const { redisConnectionString } = require("../configs/database");

const { ExpressAdapter } = require("@bull-board/express");
const NguoiDung = require("../models/NguoiDung");

class BullMQService {
  static _connection = null;
  static get connection() {
    if (!BullMQService._connection) {
      BullMQService._connection = new Redis(redisConnectionString, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });
    }
    return BullMQService._connection;
  }

  static serverAdapter = new ExpressAdapter();

  isInitializedRewardWorker = false;

  static LIST_QUEUE = {};
  static LIST_QUEUE_NAME = {
    TRA_THUONG_GAME_KENO: "traThuongGameKeno",
    TRA_THUONG_GAME_XOCDIA: "traThuongGameXocDia",
    TRA_THUONG_GAME_XUCXAC: "traThuongGameXucXac",
    TRA_THUONG_GAME_XOSO: "traThuongGameXoSo",
    TRA_THUONG_GAME_XOSO_MB: "traThuongGameXoSoMB",
    UPDATE_LAST_ONLINE_TIME: "updateLastOnlineTime",
  };

  /**
   *
   * @param {*} param0
   * @returns {Queue}
   */
  static initQueue = ({ queueName }) => {
    if (!this.LIST_QUEUE[queueName]) {
      this.LIST_QUEUE[queueName] = new Queue(queueName, {
        connection: this.connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });

      this.initWorker({ queueName });
    }

    return this.LIST_QUEUE[queueName];
  };

  static initWorker = async ({ queueName }) => {
    if (!this.LIST_QUEUE[queueName]) {
      return;
    }
    switch (queueName) {
      case this.LIST_QUEUE_NAME.TRA_THUONG_GAME_KENO:
        this.traThuongGameKenoWorker({ queueName });
        return;
      case this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XUCXAC:
        this.traThuongGameXucXacWorker({ queueName });
        return;
      case this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOCDIA:
        this.traThuongGameXocDiaWorker({ queueName });
        return;
      case this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOSO:
        this.traThuongGameXoSoWorker({ queueName });
        return;
      case this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOSO_MB:
        this.traThuongGameXoSoMBWorker({ queueName });
        return;
      case this.LIST_QUEUE_NAME.UPDATE_LAST_ONLINE_TIME:
        this.updateLastOnlineTimeWorker({ queueName });
        return;

      default:
        return;
    }
  };

  static traThuongGameKenoWorker = async ({ queueName, workerOptions = {} }) => {
    if (queueName !== this.LIST_QUEUE_NAME.TRA_THUONG_GAME_KENO) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const startTime = Date.now();
        console.log(`Processing job ${job.id} of type ${job.name}`);

        try {
          const { bangKetQua, nguoiDung, listCuoc, itemLichSuDatCuoc, tiLe, typeGame } = job.data;

          if (typeGame === LOAI_GAME.KENO1P) {
            const gameKeno1pService = require("./game.keno1p.service");
            await gameKeno1pService.traThuongWorker({
              bangKetQua,
              nguoiDung,
              listCuoc,
              itemLichSuDatCuoc,
              tiLe,
            });
          } else if (typeGame === LOAI_GAME.KENO3P) {
            const gameKeno3pService = require("./game.keno3p.service");
            await gameKeno3pService.traThuongWorker({
              bangKetQua,
              nguoiDung,
              listCuoc,
              itemLichSuDatCuoc,
              tiLe,
            });
          } else if (typeGame === LOAI_GAME.KENO5P) {
            const gameKeno5pService = require("./game.keno5p.service");
            await gameKeno5pService.traThuongWorker({
              bangKetQua,
              nguoiDung,
              listCuoc,
              itemLichSuDatCuoc,
              tiLe,
            });
          }
          console.log(`Job ${job.id} completed in ${Date.now() - startTime}ms`);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error;
        }
      },
      {
        connection: this.connection,
        concurrency: workerOptions.concurrency || 5,
        limiter: {
          max: workerOptions.limiterMax || 1000,
          duration: workerOptions.limiterDuration || 1000,
        },
        ...workerOptions,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

    console.log(`Worker ${queueName} started!`);
  };
  static traThuongGameXucXacWorker = async ({ queueName }) => {
    if (queueName !== this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XUCXAC) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const { nguoiDung, bangKetQua, listCuoc, tiLe, itemDatCuoc, typeGame } = job.data;

        if (typeGame === LOAI_GAME.XUCXAC1P) {
          const gameXucXac1PService = require("./game.xucxac1p.service");
          await gameXucXac1PService.traThuongWorker({
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemDatCuoc,
          });
        } else if (typeGame === LOAI_GAME.XUCXAC3P) {
          const gameXucXac3PService = require("./game.xucxac3p.service");
          await gameXucXac3PService.traThuongWorker({
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemDatCuoc,
          });
        }
      },
      {
        connection: this.connection,
        concurrency: 5,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    console.log(`Worker ${queueName} started!`);
  };
  static traThuongGameXoSoWorker = async ({ queueName }) => {
    if (queueName !== this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOSO) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const { nguoiDung, bangKetQua, listCuoc, tiLe, itemDatCuoc, typeGame } = job.data;

        if (typeGame === LOAI_GAME.XOSO3P) {
          const gameXoSo3PService = require("./game.xoso3p.service");
          await gameXoSo3PService.traThuongWorker({
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemDatCuoc,
          });
        } else if (typeGame === LOAI_GAME.XOSO5P) {
          const gameXoSo5PService = require("./game.xoso5p.service");
          await gameXoSo5PService.traThuongWorker({
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemDatCuoc,
          });
        }
      },
      {
        connection: this.connection,
        concurrency: 5,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    console.log(`Worker ${queueName} started!`);
  };
  static traThuongGameXoSoMBWorker = async ({ queueName }) => {
    if (queueName !== this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOSO_MB) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const { findKetQuaToDay, nguoiDung, bangKetQua, listCuoc, tiLe, itemDatCuoc, typeGame } = job.data;
        if (typeGame === LOAI_GAME.XOSOMB) {
          const GameXSMBService = require("./game.xsmb.service");
          await GameXSMBService.traThuongWorker({
            findKetQuaToDay,
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemDatCuoc,
          });
        }
      },
      {
        connection: this.connection,
        concurrency: 1,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    console.log(`Worker ${queueName} started!`);
  };
  static traThuongGameXocDiaWorker = async ({ queueName }) => {
    if (queueName !== this.LIST_QUEUE_NAME.TRA_THUONG_GAME_XOCDIA) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const { nguoiDung, bangKetQua, listCuoc, tiLe, itemLichSuDatCuoc, typeGame } = job.data;

        if (typeGame === LOAI_GAME.XOCDIA1P) {
          const gameXocDia1PService = require("./game.xocdia1p.service");
          await gameXocDia1PService.traThuongWorker({
            nguoiDung,
            bangKetQua,
            listCuoc,
            tiLe,
            itemLichSuDatCuoc,
          });
        }
      },
      {
        connection: this.connection,
        concurrency: 5,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    console.log(`Worker ${queueName} started!`);
  };

  static updateLastOnlineTimeWorker = async ({ queueName }) => {
    if (queueName !== this.LIST_QUEUE_NAME.UPDATE_LAST_ONLINE_TIME) {
      return;
    }

    const worker = new Worker(
      queueName,
      async (job) => {
        const { taiKhoan, lastOnlineTime } = job.data;

        await NguoiDung.findOneAndUpdate(
          {
            taiKhoan,
          },
          {
            lastOnlineTime,
          }
        );
      },
      {
        connection: this.connection,
        concurrency: 5,
      }
    );
    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });
    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
    console.log(`Worker ${queueName} started!`);
  };
}

module.exports = BullMQService;
