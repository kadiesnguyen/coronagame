"use strict";
const NguoiDung = require("../models/NguoiDung");
const HeThong = require("../models/HeThong");
const { randomBiTheoLoai, getKetQua } = require("../utils/game/keno");
const getRandomArbitrary = require("../utils/randomRangeNumber");
const numeral = require("numeral");
const {
  STATUS_HISTORY_GAME,
  STATUS_GAME,
  MIN_RANGE_NUMBER,
  MAX_RANGE_NUMBER,
  STATUS_BET_GAME,
  DEFAULT_SETTING_GAME,
} = require("../configs/game.keno");
const UserSocketService = require("./user.socket.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const BienDongSoDuServiceFactory = require("./biendongsodu.service");
const TelegramService = require("./telegram.service");
const AdminSocketService = require("./admin.socket.service");
const BullMQService = require("./bullmq.service");
const KenoGameState = require("./state.game.keno");
const dayjs = require("dayjs");
const { createBroadcastMiddleware } = require("../middlewares/broadcast.logger");
const { default: mongoose } = require("mongoose");

let CURRENT_GAME = {
  _id: null,
  phien: 0,
  tinhTrang: STATUS_GAME.DANG_CHO,
};
class GameKenoService {
  static QUEUE_TRA_THUONG = "traThuongGameKeno";
  constructor({ KEY_GAME, SETTING_GAME }) {
    this.gameState = new KenoGameState();
    this.SETTING_GAME = SETTING_GAME;
    this.KEY_GAME = KEY_GAME;
    this.CURRENT_GAME = CURRENT_GAME;

    // Initialize error handling
    this.initializeErrorHandling();

    this.broadcastMiddleware = createBroadcastMiddleware();
  }

  async handleGameError(error) {
    console.error("Game Error:", error);
    this.SETTING_GAME.IS_PLAY_GAME = false;

    TelegramService.sendNotification({
      content: `Game Error in ${this.KEY_GAME.KEY_SOCKET}: ${error.message}`,
    });
  }
  async handleGracefulShutdown() {
    this.SETTING_GAME.IS_PLAY_GAME = false;
    process.exit(0);
  }

  initializeErrorHandling() {
    process.on("unhandledRejection", this.handleGameError.bind(this));
    process.on("SIGTERM", this.handleGracefulShutdown.bind(this));
  }
  getDataGame = () => {
    return this.gameState.getState();
  };
  getSettingGame = () => {
    return this.SETTING_GAME;
  };

  setDataGame = (data) => {
    this.gameState.updateState(data);
  };
  setRemainTime = (time) => {
    this.gameState.updateState({ timer: time });
  };

  setPhienHoanTatMoiNhat = (data) => {
    this.gameState.updateState({ phienHoanTatMoiNhat: data });
  };
  setModifiedResult = (data) => {
    this.SETTING_GAME = { ...this.SETTING_GAME, MODIFIED_RESULT: data, IS_MODIFIED_RESULT: true };
  };
  setIsModifiedResult = (data) => {
    this.SETTING_GAME = { ...this.SETTING_GAME, IS_MODIFIED_RESULT: data };
  };
  setIsAutoGame = (data) => {
    this.SETTING_GAME = { ...this.SETTING_GAME, IS_AUTO_RESULT: data };
  };

  setIsPlayGame = (data) => {
    this.SETTING_GAME = { ...this.SETTING_GAME, IS_PLAY_GAME: data };
    if (data) {
      setTimeout(() => {
        this.startGame();
      }, 1000);
    }
  };

  /**
   * Update kết quả vào database
   * @param {[0, 0, 0, 0, 0]} ketQua List kết quả đã được random
   *
   */
  updateDataGame = async ({ ketQua }) => {
    const updateGame = await this.SETTING_GAME.DATABASE_MODEL.GAME.findOneAndUpdate(
      {
        phien: this.gameState.getState().phien,
      },
      {
        tinhTrang: STATUS_GAME.HOAN_TAT,
        ketQua: ketQua,
      },
      {
        new: true,
      }
    );
    this.setDataGame(updateGame);
    this.broadcastGameUpdateForUser(`ketQuaPhienHienTai`, updateGame);
  };

  generateAutoResults(tongTienCuocGame) {
    return Array.from({ length: 5 }, (_, i) => {
      const index = i + 1;
      if (tongTienCuocGame[index].C > tongTienCuocGame[index].L) {
        return randomBiTheoLoai({ loai: "L" });
      }
      if (tongTienCuocGame[index].C < tongTienCuocGame[index].L) {
        return randomBiTheoLoai({ loai: "C" });
      }
      return getRandomArbitrary(MIN_RANGE_NUMBER, MAX_RANGE_NUMBER);
    });
  }

  generateRandomResults() {
    return Array.from({ length: 5 }, () => getRandomArbitrary(MIN_RANGE_NUMBER, MAX_RANGE_NUMBER));
  }

  /**
   * Random kết quả
   * @returns {Promise<[0, 0, 0, 0, 0]>} List kết quả từ 0 -> 9
   */
  randomKetQua = async () => {
    // Lấy kết quả đã được admin điều chỉnh
    if (this.SETTING_GAME.IS_MODIFIED_RESULT) {
      return this.SETTING_GAME.MODIFIED_RESULT;
    }
    // Tự động can thiệp kết quả, bên nhiều hơn sẽ thua
    if (this.SETTING_GAME.IS_AUTO_RESULT) {
      const tongTienCuocGame = await this.getTongTienCuocGame();
      return this.generateAutoResults(tongTienCuocGame);
    }

    return this.generateRandomResults();
  };
  /**
   * Lấy danh sách tổng tiền cược game
   * @returns {Promise<{  1: {
        C: 0,
        L: 0,
      },
      2: {
        C: 0,
        L: 0,
      },
      3: {
        C: 0,
        L: 0,
      },
      4: {
        C: 0,
        L: 0,
      },
      5: {
        C: 0,
        L: 0,
      },}>}
   */

  getTongTienCuocGame = async () => {
    const tongTienCuoc = {
      1: {
        C: 0,
        L: 0,
      },
      2: {
        C: 0,
        L: 0,
      },
      3: {
        C: 0,
        L: 0,
      },
      4: {
        C: 0,
        L: 0,
      },
      5: {
        C: 0,
        L: 0,
      },
    };
    const lichSuDatCuoc = await this.SETTING_GAME.DATABASE_MODEL.HISTORY.find({
      phien: this.gameState.getState()._id,
      tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
    }).lean();
    lichSuDatCuoc.forEach((item) => {
      item.datCuoc.forEach((cuoc) => {
        tongTienCuoc[cuoc.loaiBi][cuoc.loaiCuoc] += cuoc.tienCuoc;
      });
    });
    return tongTienCuoc;
  };

  /**
   * Lấy phiên game hiện tại
   * @returns {Promise<number>} Phiên hiện tại
   */
  getCurrentPhien = async () => {
    const findGameUnComplete = await this.SETTING_GAME.DATABASE_MODEL.GAME.findOne({
      tinhTrang: STATUS_GAME.DANG_CHO,
    }).lean();

    if (findGameUnComplete) {
      return findGameUnComplete.phien;
    }

    const lastGame = await this.SETTING_GAME.DATABASE_MODEL.GAME.findOne().sort({ phien: -1 }).lean();
    return (lastGame?.phien || 0) + 1;
  };

  /**
   * Lấy kết quả phiên trước đó
   * @param {number} currentPhien
   * @returns Object
   */
  getPhienHoanTatMoiNhat = async ({ currentPhien }) => {
    if (currentPhien === 1) {
      this.setPhienHoanTatMoiNhat({});
      return {};
    }
    const getData = await this.SETTING_GAME.DATABASE_MODEL.GAME.findOne({ phien: currentPhien - 1 }).lean();
    this.setPhienHoanTatMoiNhat(getData);
    return getData;
  };
  /**
   * Insert database ván game mới
   * @param {number} currentPhien
   * @returns {object} Trả data game
   */
  createDataGame = async ({ currentPhien }) => {
    const data = await this.SETTING_GAME.DATABASE_MODEL.GAME.findOneAndUpdate(
      {
        phien: currentPhien,
      },
      {
        phien: currentPhien,
      },
      {
        new: true,
        upsert: true,
      }
    );
    return data._doc;
  };
  /**
   * Tạo database và cài đặt cấu hình khởi đầu game
   * @param {number} currentPhien
   * @returns {Promise<number>} Trả về phiên
   */
  createPhien = async ({ currentPhien }) => {
    const dataGame = await this.createDataGame({ currentPhien });
    const findHeThong = await HeThong.findOne({
      systemID: 1,
    });
    this.setDataGame(dataGame);
    this.setRemainTime(this.SETTING_GAME.TIMER);
    this.SETTING_GAME.IS_AUTO_RESULT =
      findHeThong?.gameConfigs?.kenoConfigs?.[`keno${this.KEY_GAME.TYPE_GAME}`]?.autoGame ?? DEFAULT_SETTING_GAME.STATUS_AUTO_GAME;
    this.SETTING_GAME.MODIFIED_RESULT = [0, 0, 0, 0, 0];
    this.SETTING_GAME.IS_MODIFIED_RESULT = false;

    return this.gameState.getState().phien;
  };

  /**
   * Trả thưởng
   */

  traThuong = async () => {
    // const session = await mongoose.startSession()
    const findHeThong = await HeThong.findOne({
      systemID: 1,
    });

    // Lấy tỉ lệ trả thưởng khi thắng
    const tiLe =
      findHeThong?.gameConfigs?.kenoConfigs?.[`keno${this.KEY_GAME.TYPE_GAME}`]?.tiLeCLTX ?? DEFAULT_SETTING_GAME.BET_PAYOUT_PERCENT;

    // Tìm lịch sử đặt cược của phiên game
    const lichSuDatCuoc = await this.SETTING_GAME.DATABASE_MODEL.HISTORY.find({
      phien: this.gameState.getState()._id,
      tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
    })
      .populate({
        path: "phien",
        select: "_id ketQua phien",
      })
      .populate({
        path: "nguoiDung",
        select: "_id taiKhoan",
      })
      .lean();

    const getQueueTraThuong = BullMQService.initQueue({
      queueName: GameKenoService.QUEUE_TRA_THUONG,
    });
    // Add to queue
    await getQueueTraThuong.addBulk(
      lichSuDatCuoc.map((itemLichSuDatCuoc) => {
        return {
          name: `${this.KEY_GAME.KEY_SOCKET}-${itemLichSuDatCuoc.phien._id}`,
          data: {
            bangKetQua: getKetQua(itemLichSuDatCuoc.phien.ketQua),
            nguoiDung: itemLichSuDatCuoc.nguoiDung,
            listCuoc: itemLichSuDatCuoc.datCuoc,
            itemLichSuDatCuoc,
            tiLe,
            typeGame: this.KEY_GAME.KEY_SOCKET,
          },
          options: {
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 5,
          },
        };
      })
    );
  };

  /**
   * Trả thưởng worker bull mq
   * @param {*} param0
   */
  traThuongWorker = async ({ nguoiDung, bangKetQua, listCuoc, tiLe, itemLichSuDatCuoc }) => {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const findUser = await NguoiDung.findOneAndUpdate(
          {
            _id: nguoiDung._id,
            isProcessing: { $ne: true },
          },
          {
            $set: {
              isProcessing: true,
              lockTimestamp: Date.now(),
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!findUser) {
          throw new Error("User is being processed by another transaction");
        }

        let thongBaoBienDongSoDu = "";
        let tongTienThang = 0;
        let indexItemCuoc = 0;
        // listKetQuaCuocUpdate = ["dangCho", "dangCho", ...]
        const listKetQuaCuocUpdate = listCuoc.map((_) => STATUS_BET_GAME.DANG_CHO);
        for (const itemCuoc of listCuoc) {
          const { tienCuoc, loaiBi, loaiCuoc } = itemCuoc;
          // Nếu thắng
          if (bangKetQua[`${loaiBi}`][loaiCuoc] === true) {
            listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
            const tienThang = Math.floor(tienCuoc * tiLe);
            tongTienThang += tienThang;
            thongBaoBienDongSoDu += `bi ${loaiBi} - ${loaiCuoc}: +${numeral(tienThang).format("0,0")}đ | `;
          } else {
            listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THUA;
          }
          indexItemCuoc++;
        }
        /*
       updateKetQuaCuocQuery = {
        datCuoc.0.trangThai: "thang",
        datCuoc.1.trangThai: "thua",
      }
            */
        const updateKetQuaCuocQuery = listKetQuaCuocUpdate.reduce(
          (prev, curValue, curIndex) => ({ ...prev, [`datCuoc.${curIndex}.trangThai`]: curValue }),
          {}
        );
        // Cập nhật database của item đặt cược
        // Update bet history
        const updateLichSuCuocItem = await this.SETTING_GAME.DATABASE_MODEL.HISTORY.findOneAndUpdate(
          {
            _id: itemLichSuDatCuoc._id,
            tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
          },
          {
            $set: {
              ...updateKetQuaCuocQuery,
              tinhTrang: STATUS_HISTORY_GAME.HOAN_TAT,
            },
          },
          { new: true, session }
        );

        // Update tiền người chơi
        const updateTienNguoiDung = await NguoiDung.findOneAndUpdate(
          {
            _id: findUser._id,
            isProcessing: true,
          },
          {
            $inc: { money: tongTienThang, tienThang: tongTienThang },
            $set: {
              isProcessing: false,
            },
          },
          {
            new: true,
            session,
          }
        );
        if (!updateTienNguoiDung) {
          throw new Error("Failed to update user balance");
        }
        // Nếu thắng thì cập nhật biến động số dư
        if (thongBaoBienDongSoDu) {
          thongBaoBienDongSoDu = thongBaoBienDongSoDu.slice(0, -2);
          await BienDongSoDuServiceFactory.createBienDong({
            type: TYPE_BALANCE_FLUCTUATION.GAME,
            payload: {
              nguoiDung: findUser._id,
              tienTruoc: findUser.money,
              tienSau: findUser.money + tongTienThang,
              noiDung: `Cược game Keno${this.KEY_GAME.TYPE_GAME} thắng: ${thongBaoBienDongSoDu}`,
              loaiGame: this.KEY_GAME.KEY_SOCKET,
            },
            options: {
              session,
            },
          });
          // Send event refetch users dashboard
          AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-game-transactionals-dashboard" });
        }
        // Cập nhật tiền người chơi real-time
        UserSocketService.updateUserBalance({
          user: findUser.taiKhoan,
          updateBalance: tongTienThang,
        });

        this.broadcastGameUpdateForUser("update-lich-su-cuoc-ca-nhan");
        this.broadcastGameUpdateForAdmin("admin:refetch-data-lich-su-cuoc-game", { phien: itemLichSuDatCuoc?.phien?._id });
        this.broadcastGameUpdateForAdmin("admin:refetch-data-chi-tiet-phien-game", { phien: itemLichSuDatCuoc?.phien?._id });
      });
    } catch (err) {
      await NguoiDung.updateOne(
        {
          _id: nguoiDung._id,
        },
        {
          $set: {
            isProcessing: false,
          },
        },
        {
          session,
        }
      );

      const errorMessage = `Trả thưởng lỗi game ${this.KEY_GAME.KEY_SOCKET} phiên ${itemLichSuDatCuoc?.phien?.phien}: ${JSON.stringify(err)}`;
      TelegramService.sendNotification({
        content: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      await session.endSession();
    }
  };

  async initializeNewGame() {
    BullMQService.initQueue({
      queueName: GameKenoService.QUEUE_TRA_THUONG,
    });

    const currentPhien = await this.getCurrentPhien();
    const phienHoanTatMoiNhat = await this.getPhienHoanTatMoiNhat({ currentPhien });

    this.broadcastGameUpdateForUser(`phienHoanTatMoiNhat`, phienHoanTatMoiNhat);

    const phien = await this.createPhien({ currentPhien });
    this.broadcastGameUpdateForUser(`batDauGame`);
    this.broadcastGameUpdateForAdmin(`admin:batDauGame`, { phien });
    this.broadcastGameUpdateForAdmin(`admin:refetch-data-game`);

    return { currentPhien, phien };
  }

  async syncGameTimer(currentTime, phien) {
    this.setRemainTime(currentTime);

    this.broadcastGameUpdateForUser(`timer`, { current_time: currentTime });
    this.broadcastGameUpdateForUser(`hienThiPhien`, { phien });
    this.broadcastGameUpdateForAdmin(`admin:timer`, { current_time: currentTime, phien });
    this.broadcastGameUpdateForAdmin(`admin:hienThiPhien`, { phien });
  }

  async runGameCycle(currentTime, phien) {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (!this.SETTING_GAME.IS_PLAY_GAME) {
          clearInterval(timer);
          resolve();
          return;
        }

        currentTime -= 1;
        this.setRemainTime(currentTime);

        this.broadcastGameUpdateForUser(`timer`, { current_time: currentTime });
        this.broadcastGameUpdateForAdmin(`admin:timer`, { current_time: currentTime, phien });

        if (this.SETTING_GAME.IS_MODIFIED_RESULT) {
          this.broadcastGameUpdateForAdmin(`admin:hien-thi-ket-qua-dieu-chinh`, {
            ketQua: this.SETTING_GAME.MODIFIED_RESULT,
            phienHienTai: phien,
          });
        }

        if (currentTime <= 0) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  }

  async handleGameEnd(phien) {
    try {
      // Bắt đầu animation
      this.broadcastGameUpdateForUser(`batDauQuay`);
      this.broadcastGameUpdateForAdmin(`admin:batDauQuay`, { phien });
      // Đợi animation quay

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Xử lý và broadcast kết quả
      const ketQuaRandom = await this.randomKetQua();
      await this.updateDataGame({ ketQua: ketQuaRandom });

      this.broadcastGameUpdateForUser(`ketqua`, { ketQuaRandom });
      this.broadcastGameUpdateForAdmin(`admin:ketqua`, { ketQuaRandom, phien });
    } catch (error) {
      console.error("Error handling game end:", error);
      throw error;
    }
  }

  async broadcastEndGameEvents(phien) {
    // Đảm bảo các sự kiện này phải hoàn thành trước khi bắt đầu ván mới
    this.broadcastGameUpdateForUser(`dungQuay`);
    this.broadcastGameUpdateForAdmin(`admin:dungQuay`, { phien });

    this.broadcastGameUpdateForUser(`batDauTraThuong`);
    this.broadcastGameUpdateForAdmin(`admin:batDauTraThuong`, { phien });
  }
  broadcastCompleteGameEvents(phien) {
    this.broadcastGameUpdateForUser(`hoanTatGame`);
    this.broadcastGameUpdateForAdmin(`admin:hoanTatGame`, { phien });
  }

  startGame = async () => {
    try {
      while (this.SETTING_GAME.IS_PLAY_GAME) {
        // 1. Tính toán thời gian chính xác cho phiên tiếp theo
        const now = dayjs();
        const nextTime = now.add(this.SETTING_GAME.TIMER, "second").startOf("minute");

        // 2. Khởi tạo game mới
        const gameData = await this.initializeNewGame();
        const { phien } = gameData;

        // 3. Đồng bộ timer với thời gian thực
        let currentTime = this.SETTING_GAME.TIMER;
        await this.syncGameTimer(currentTime, phien);

        // 4. Chạy game cycle
        await this.runGameCycle(currentTime, phien);

        // 5. Xử lý kết thúc game
        await this.handleGameEnd(phien);

        // 6. Broadcast các sự kiện kết thúc
        await this.broadcastEndGameEvents(phien);

        // 7. Thực hiện trả thưởng và đợi hoàn thành
        await this.traThuong();

        // 8. Broadcast hoàn tất game
        this.broadcastCompleteGameEvents(phien);

        // 10. Đợi đến đúng thời điểm bắt đầu phiên mới
        const timeToNext = nextTime.valueOf() - dayjs().valueOf();
        if (timeToNext > 0) {
          await new Promise((resolve) => setTimeout(resolve, timeToNext));
        }
      }
    } catch (err) {
      this.SETTING_GAME.IS_PLAY_GAME = false;
      console.log(err);
      throw err;
    }
  };
  broadcastGameUpdateForUser(key, data) {
    this.broadcastMiddleware.broadcastGameUpdateForUser(this.SETTING_GAME.SOCKET_SERVICE_METHOD.SEND_ROOM_KENO)(
      `${this.KEY_GAME.KEY_SOCKET}:${key}`,
      data
    );
  }
  broadcastGameUpdateForAdmin(key, data) {
    this.broadcastMiddleware.broadcastGameUpdateForUser(this.SETTING_GAME.SOCKET_SERVICE_METHOD.SEND_ROOM_ADMIN_KENO)(
      `${this.KEY_GAME.KEY_SOCKET}:${key}`,
      data
    );
  }
}

module.exports = GameKenoService;
