"use strict";
const NguoiDung = require("../models/NguoiDung");
const HeThong = require("../models/HeThong");
const { getKetQua, convertKeyTiLe, getTiLeDefault } = require("../utils/game/xoso");
const { generateRandomNumberString } = require("../utils/game/xoso");
const numeral = require("numeral");
const {
  STATUS_GAME,
  STATUS_HISTORY_GAME,

  DEFAULT_SETTING_GAME,
  STATUS_BET_GAME,
} = require("../configs/game.xoso");
const UserSocketService = require("./user.socket.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const BienDongSoDuServiceFactory = require("./biendongsodu.service");
const { default: mongoose } = require("mongoose");
const TelegramService = require("./telegram.service");
const { LOAI_CUOC_GAME } = require("../configs/game.xoso");
const AdminSocketService = require("./admin.socket.service");
const BullMQService = require("./bullmq.service");
const _ = require("lodash");
const XoSoGameState = require("./state.game.xoso");
const { createBroadcastMiddleware } = require("../middlewares/broadcast.logger");
const dayjs = require("dayjs");

let CURRENT_GAME = {
  _id: null,
  phien: 0,
  tinhTrang: STATUS_GAME.DANG_CHO,
};
class GameXoSoService {
  static QUEUE_TRA_THUONG = "traThuongGameXoSo";
  static LIST_TIMEOUT_SEND_SOCKET = {};

  constructor({ KEY_GAME, SETTING_GAME }) {
    this.gameState = new XoSoGameState();

    this.SETTING_GAME = SETTING_GAME;
    this.KEY_GAME = KEY_GAME;
    this.CURRENT_GAME = CURRENT_GAME;
    this.broadcastMiddleware = createBroadcastMiddleware();
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

  generateRandomResults() {
    return [
      {
        type: "DB",
        data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
      },
      {
        type: "1",
        data: Array.from({ length: 1 }).map((_, index) => generateRandomNumberString(5)),
      },
      {
        type: "2",
        data: Array.from({ length: 2 }).map((_, index) => generateRandomNumberString(5)),
      },
      {
        type: "3",
        data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(5)),
      },
      {
        type: "4",
        data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(4)),
      },
      {
        type: "5",
        data: Array.from({ length: 6 }).map((_, index) => generateRandomNumberString(4)),
      },
      {
        type: "6",
        data: Array.from({ length: 3 }).map((_, index) => generateRandomNumberString(3)),
      },
      {
        type: "7",
        data: Array.from({ length: 4 }).map((_, index) => generateRandomNumberString(2)),
      },
    ];
  }

  /**
   * Random kết quả

   */
  randomKetQua = async () => {
    if (this.SETTING_GAME.IS_MODIFIED_RESULT) {
      return this.SETTING_GAME.MODIFIED_RESULT;
    }

    return this.generateRandomResults();
  };
  /**
   * Lấy danh sách tổng tiền cược game

   */

  getTongTienCuocGame = async () => {};

  /**
   * Lấy phiên game hiện tại
   * @returns {Promise<number>} Phiên hiện tại
   */
  getCurrentPhien = async () => {
    let currentPhien;
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
      findHeThong?.gameConfigs?.xoSoConfigs?.[`xoSo${this.KEY_GAME.TYPE_GAME}`]?.autoGame ?? DEFAULT_SETTING_GAME.STATUS_AUTO_GAME;
    this.SETTING_GAME.MODIFIED_RESULT = [0, 0, 0];
    this.SETTING_GAME.IS_MODIFIED_RESULT = false;

    return this.gameState.getState().phien;
  };

  /**
   * Trả thưởng
   */

  traThuong = async () => {
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
    const findHeThong = await HeThong.findOne({
      systemID: 1,
    });

    const bangTiLe = Object.fromEntries(
      Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => [
        loaiCuoc,
        findHeThong?.gameConfigs?.xoSoConfigs?.[`xoSo${this.KEY_GAME.TYPE_GAME}`]?.[`${convertKeyTiLe(loaiCuoc)}`] ??
          getTiLeDefault(loaiCuoc),
      ])
    );

    const getQueueTraThuong = BullMQService.initQueue({
      queueName: GameXoSoService.QUEUE_TRA_THUONG,
    });
    // Add to queue

    await getQueueTraThuong.addBulk(
      lichSuDatCuoc.map((itemDatCuoc) => {
        const nameJob = `${this.KEY_GAME.KEY_SOCKET}-${itemDatCuoc.phien._id}`;
        return {
          name: nameJob,
          data: {
            bangKetQua: getKetQua(itemDatCuoc.phien.ketQua),
            nguoiDung: itemDatCuoc.nguoiDung,
            listCuoc: itemDatCuoc.datCuoc,
            itemDatCuoc,
            tiLe: bangTiLe,
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

    ////
  };
  traThuongWorker = async ({ nguoiDung, bangKetQua, listCuoc, tiLe, itemDatCuoc }) => {
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
        const bangTiLe = tiLe;

        let thongBaoBienDongSoDu = "";
        let tongTienThang = 0;
        let indexItemCuoc = 0;
        // listKetQuaCuocUpdate = ["dangCho", "dangCho", ...]
        const listKetQuaCuocUpdate = listCuoc.map((_) => STATUS_BET_GAME.DANG_CHO);
        for (const itemCuoc of listCuoc) {
          const { chiTietCuoc, loaiCuoc } = itemCuoc;

          // Game lô
          if (loaiCuoc === LOAI_CUOC_GAME.LO) {
            /// LOOP Chi tiet cuoc
            for (const { so, tienCuoc } of chiTietCuoc) {
              // Thắng
              if (bangKetQua[LOAI_CUOC_GAME.LO].includes(so)) {
                listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
                const tienThang = Math.floor(tienCuoc * bangTiLe[LOAI_CUOC_GAME.LO]);
                tongTienThang += tienThang;
                const tienThangStr = numeral(tienThang).format("0,0");
                thongBaoBienDongSoDu += `Lô: số ${so}: +${tienThangStr}đ | `;
              }
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.DE) {
            /// LOOP Chi tiet cuoc
            for (const { so, tienCuoc } of chiTietCuoc) {
              // Thắng
              if (bangKetQua[LOAI_CUOC_GAME.DE].includes(so)) {
                listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
                const tienThang = Math.floor(tienCuoc * bangTiLe[LOAI_CUOC_GAME.DE]);
                tongTienThang += tienThang;
                const tienThangStr = numeral(tienThang).format("0,0");
                thongBaoBienDongSoDu += `Đề: số ${so}: +${tienThangStr}đ | `;
              }
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.BA_CANG) {
            /// LOOP Chi tiet cuoc
            for (const { so, tienCuoc } of chiTietCuoc) {
              // Thắng
              if (bangKetQua[LOAI_CUOC_GAME.BA_CANG].includes(so)) {
                listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
                const tienThang = Math.floor(tienCuoc * bangTiLe[LOAI_CUOC_GAME.BA_CANG]);
                tongTienThang += tienThang;
                const tienThangStr = numeral(tienThang).format("0,0");
                thongBaoBienDongSoDu += `Ba càng: số ${so}: +${tienThangStr}đ | `;
              }
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_2) {
            const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
            const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
            if (bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) && bangKetQua[LOAI_CUOC_GAME.LO].includes(so2)) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
              const tienThang = Math.floor((tienCuoc1 + tienCuoc2) * bangTiLe[LOAI_CUOC_GAME.LO_XIEN_2]);
              tongTienThang += tienThang;
              const tienThangStr = numeral(tienThang).format("0,0");
              thongBaoBienDongSoDu += `Lô xiên 2: số ${so1} - số ${so2}: +${tienThangStr}đ | `;
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_3) {
            const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
            const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
            const { so: so3, tienCuoc: tienCuoc3 } = chiTietCuoc[2];
            if (
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) &&
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so2) &&
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so3)
            ) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
              const tienThang = Math.floor((tienCuoc1 + tienCuoc2 + tienCuoc3) * bangTiLe[LOAI_CUOC_GAME.LO_XIEN_3]);
              tongTienThang += tienThang;
              const tienThangStr = numeral(tienThang).format("0,0");
              thongBaoBienDongSoDu += `Lô xiên 3: số ${so1} - số ${so2} - số ${so3}: +${tienThangStr}đ | `;
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_4) {
            const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
            const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
            const { so: so3, tienCuoc: tienCuoc3 } = chiTietCuoc[2];
            const { so: so4, tienCuoc: tienCuoc4 } = chiTietCuoc[3];
            if (
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) &&
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so2) &&
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so3) &&
              bangKetQua[LOAI_CUOC_GAME.LO].includes(so4)
            ) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
              const tienThang = Math.floor((tienCuoc1 + tienCuoc2 + tienCuoc3 + tienCuoc4) * bangTiLe[LOAI_CUOC_GAME.LO_XIEN_4]);
              tongTienThang += tienThang;
              const tienThangStr = numeral(tienThang).format("0,0");
              thongBaoBienDongSoDu += `Lô xiên 4: số ${so1} - số ${so2} - số ${so3} - số ${so4}: +${tienThangStr}đ | `;
            }
          }
        }
        // Các trường hợp còn lại thì update trạng thái thua
        if (listKetQuaCuocUpdate[indexItemCuoc] === STATUS_BET_GAME.DANG_CHO) {
          listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THUA;
        }

        // Update tiền người chơi và lịch sử cược
        await this.SETTING_GAME.DATABASE_MODEL.HISTORY.findOneAndUpdate(
          {
            _id: itemDatCuoc._id,
            tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
          },
          {
            $set: {
              "datCuoc.0.trangThai": listKetQuaCuocUpdate[indexItemCuoc],
              tinhTrang: STATUS_HISTORY_GAME.HOAN_TAT,
              "datCuoc.0.tongThang": tongTienThang,
            },
          },
          {
            session,
          }
        );

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

        if (thongBaoBienDongSoDu) {
          thongBaoBienDongSoDu = thongBaoBienDongSoDu.slice(0, -2);

          await BienDongSoDuServiceFactory.createBienDong({
            type: TYPE_BALANCE_FLUCTUATION.GAME,
            payload: {
              nguoiDung: findUser._id,
              tienTruoc: findUser.money,
              tienSau: findUser.money + tongTienThang,
              noiDung: `Cược game Xổ số ${this.KEY_GAME.TYPE_GAME} thắng: ${thongBaoBienDongSoDu}`,
              loaiGame: this.KEY_GAME.KEY_SOCKET,
            },
            options: {
              session,
            },
          });
          // Send event refetch users dashboard
          AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-game-transactionals-dashboard" });
        }

        UserSocketService.updateUserBalance({
          user: findUser.taiKhoan,
          updateBalance: tongTienThang,
        });
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
      const errorMessage = `Trả thưởng lỗi game ${this.KEY_GAME.KEY_SOCKET} phiên ${itemDatCuoc?.phien?.phien}: ${JSON.stringify(err)}`;

      TelegramService.sendNotification({
        content: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      await session.endSession();
    }

    const keyTimeout = `${this.KEY_GAME.KEY_SOCKET}-${nguoiDung.taiKhoan}`;

    const handleSendSocketEvent = () => {
      const timeoutRef = setTimeout(() => {
        this.broadcastGameUpdateForUser("update-lich-su-cuoc-ca-nhan");
        this.broadcastGameUpdateForAdmin("admin:refetch-data-lich-su-cuoc-game", { phien: itemDatCuoc?.phien?._id });
        this.broadcastGameUpdateForAdmin("admin:refetch-data-chi-tiet-phien-game", { phien: itemDatCuoc?.phien?._id });

        delete GameXoSoService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout];
      }, 3000);
      return timeoutRef;
    };
    const isHasKeyTimeout = !!GameXoSoService.LIST_TIMEOUT_SEND_SOCKET?.[keyTimeout];
    if (!isHasKeyTimeout) {
      const timeoutRef = handleSendSocketEvent();
      GameXoSoService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout] = timeoutRef;
    } else {
      clearTimeout(GameXoSoService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout]);
      const timeoutRef = handleSendSocketEvent();
      GameXoSoService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout] = timeoutRef;
    }

    ////
  };

  async initializeNewGame() {
    BullMQService.initQueue({
      queueName: GameXoSoService.QUEUE_TRA_THUONG,
    });

    const currentPhien = await this.getCurrentPhien();
    const phienHoanTatMoiNhat = await this.getPhienHoanTatMoiNhat({ currentPhien });

    this.broadcastGameUpdateForUser(`phienHoanTatMoiNhat`, { phienHoanTatMoiNhat });

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
      // Đợi animation quay
      this.broadcastGameUpdateForUser(`batDauQuay`);
      this.broadcastGameUpdateForAdmin(`admin:batDauQuay`, { phien });
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

  broadcastEndGameEvents(phien) {
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
        this.broadcastEndGameEvents(phien);

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
    this.broadcastMiddleware.broadcastGameUpdateForUser(this.SETTING_GAME.SOCKET_SERVICE_METHOD.SEND_ROOM_XOSO)(
      `${this.KEY_GAME.KEY_SOCKET}:${key}`,
      data
    );
  }
  broadcastGameUpdateForAdmin(key, data) {
    this.broadcastMiddleware.broadcastGameUpdateForUser(this.SETTING_GAME.SOCKET_SERVICE_METHOD.SEND_ROOM_ADMIN_XOSO)(
      `${this.KEY_GAME.KEY_SOCKET}:${key}`,
      data
    );
  }
}

module.exports = GameXoSoService;
