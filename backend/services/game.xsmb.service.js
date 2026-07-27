"use strict";

const { default: axios } = require("axios");
const GameXoSoMB = require("../models/GameXoSoMB");
const LichSuDatCuocXoSoMB = require("../models/LichSuDatCuocXoSoMB");
const { STATUS_GAME, STATUS_HISTORY_GAME, LOAI_CUOC_GAME, STATUS_BET_GAME } = require("../configs/game.xoso");
const dayjs = require("dayjs");

const { BadRequestError } = require("../utils/app_error");
const HeThong = require("../models/HeThong");
const { convertKeyTiLe, getTiLeDefault, getKetQua } = require("../utils/game/xoso");
const LoggingService = require("./logging.service");
const { default: mongoose } = require("mongoose");
const { convertMoney } = require("../utils/convertMoney");
const NguoiDung = require("../models/NguoiDung");
const BienDongSoDuServiceFactory = require("./biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const AdminSocketService = require("./admin.socket.service");
const UserSocketService = require("./user.socket.service");
const TelegramService = require("./telegram.service");
const BullMQService = require("./bullmq.service");

/**
 *
 * @param {string[]} detail list kết quả từ api
 * @returns list kết quả đã được xử lý
 */

const handleKetQua = (detail) => {
  const parseDetail = JSON.parse(detail);
  const listData = parseDetail.map((item, index) => ({
    type: index > 0 ? String(index) : "DB",
    data: item.split(","),
  }));

  return listData;
};

const NAMESPACE = "GetGameXSMBService";
class GameXSMBService {
  static LIST_TIMEOUT_SEND_SOCKET = {};

  static QUEUE_TRA_THUONG = "traThuongGameXoSoMB";

  static LIMIT_ITEMS = 10;
  static KEY_GAME = "xosomb";
  static BASE_URL = `https://mu88.live/api/front/open/lottery/history/list/${this.LIMIT_ITEMS}/miba`;
  static #STATE_GAME = {
    CURRENT_DATE: null,
    LATEST_COMPLETE_DATE: null,
    TIMER_OPEN: 0,
    TIMER_STOP_BET: 0,
    IS_STOP_BET: false,
    IS_WAITING_RANDOM_RESULT: false,
    STATUS_GAME: STATUS_GAME.DANG_CHO,
    IS_PLAY_GAME: true,
  };

  static setStatusGame = (status) => {
    this.#STATE_GAME.STATUS_GAME = status;
  };
  static setCurrentDate = (currentDate) => {
    this.#STATE_GAME.CURRENT_DATE = currentDate;
  };
  static setLatestCompleteDate = (latestCompleteDate) => {
    this.#STATE_GAME.LATEST_COMPLETE_DATE = latestCompleteDate;
  };
  static setTimerOpen = (timerOpen) => {
    this.#STATE_GAME.TIMER_OPEN = timerOpen;
  };
  static setTimerStopBet = (timerStopBet) => {
    this.#STATE_GAME.TIMER_STOP_BET = timerStopBet;
  };
  static setStatusStopBet = (status) => {
    this.#STATE_GAME.IS_STOP_BET = status;
  };
  static setStatusWaitingResult = (status) => {
    this.#STATE_GAME.IS_WAITING_RANDOM_RESULT = status;
  };

  static setIsPlayGame = (status) => {
    this.#STATE_GAME.IS_PLAY_GAME = status;
    if (status) {
      setTimeout(() => {
        this.startGame();
      }, 1000);
    }
  };

  static getStatusStopBet = () => {
    return this.#STATE_GAME.IS_STOP_BET;
  };
  static getStatusWaitingResult = () => {
    return this.#STATE_GAME.IS_WAITING_RANDOM_RESULT;
  };
  static getIsPlayGame = () => {
    return this.#STATE_GAME.IS_PLAY_GAME;
  };

  static getCurrentDate = () => {
    return this.#STATE_GAME.CURRENT_DATE;
  };
  static getLatestCompleteDate = () => {
    return this.#STATE_GAME.LATEST_COMPLETE_DATE;
  };
  static getTimerOpen = () => {
    return this.#STATE_GAME.TIMER_OPEN;
  };
  static getTimerStopBet = () => {
    return this.#STATE_GAME.TIMER_STOP_BET;
  };
  static getDataGame = () => {
    return this.#STATE_GAME;
  };
  static getSettingGame = () => {
    return this.#STATE_GAME;
  };

  static sendRoomXoSo = ({ key, data = null }) => {
    global._io.to(this.KEY_GAME).emit(key, data);
  };

  static sendRoomAdminXoSo = ({ key, data = null }) => {
    global._io.to(this.KEY_GAME).emit(key, data);
  };

  static startGame = async () => {
    let gameInterval;
    clearInterval(gameInterval);
    try {
      if (this.getIsPlayGame()) {
        BullMQService.initQueue({
          queueName: GameXSMBService.QUEUE_TRA_THUONG,
        });

        // Get kết quả mới nhất
        await this.getKetQuaXSMB();
        this.sendRoomXoSo({ key: `${this.KEY_GAME}:batDauGame` });
        this.sendRoomXoSo({ key: `${this.KEY_GAME}:admin:batDauGame`, data: { phien: this.getCurrentDate() } });

        this.setStatusGame(STATUS_GAME.DANG_CHO);
        const findLatestGameDangCho = await GameXoSoMB.findOne({
          tinhTrang: STATUS_GAME.DANG_CHO,
        })
          .sort("-openTime")
          .lean();
        const findLatestGameHoantTat = await GameXoSoMB.findOne({
          tinhTrang: STATUS_GAME.HOAN_TAT,
        })
          .sort("-openTime")
          .lean();
        const { ngay } = findLatestGameDangCho;

        this.setCurrentDate(ngay);
        this.setLatestCompleteDate(findLatestGameHoantTat.ngay);

        const currentTimestamp = dayjs().unix();
        const openTimestamp = dayjs(ngay, "DD/MM/YYYY").set("hour", 18).set("minute", 40).unix();
        const stopBetTimestamp = dayjs(ngay, "DD/MM/YYYY").set("hour", 18).set("minute", 10).unix();
        this.setTimerOpen(openTimestamp - currentTimestamp);
        this.setTimerStopBet(stopBetTimestamp - currentTimestamp);

        this.sendRoomXoSo({
          key: `${this.KEY_GAME}:admin:refetch-data-game`,
        });

        this.sendRoomXoSo({
          key: `${this.KEY_GAME}:timer`,
          data: { timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
        });
        this.sendRoomXoSo({
          key: `${this.KEY_GAME}:admin:timer`,
          data: { phien: this.getCurrentDate(), timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
        });
        this.sendRoomXoSo({
          key: `${this.KEY_GAME}:hienThiPhien`,
          data: { currentDate: this.getCurrentDate(), latestCompleteDate: this.getLatestCompleteDate() },
        });

        gameInterval = setInterval(async () => {
          this.setStatusGame(STATUS_GAME.DANG_CHO);
          this.sendRoomXoSo({ key: `${this.KEY_GAME}:batDauGame` });
          this.sendRoomXoSo({ key: `${this.KEY_GAME}:admin:batDauGame`, data: { phien: this.getCurrentDate() } });

          // Dừng cược
          if (this.getTimerStopBet() <= 0) {
            console.log("Dừng cược");
            this.setStatusStopBet(true);
          } else {
            this.setStatusStopBet(false);
          }
          // Trả thưởng
          if (this.getTimerOpen() <= 0) {
            console.log("Trả thưởng");
            console.log({
              currentDate: this.getCurrentDate(),
              latestCompleteDate: this.getLatestCompleteDate(),
              state: this.#STATE_GAME,
            });
            TelegramService.sendNotification({
              content: `Đang trả thưởng XSMB`,
            });
            clearInterval(gameInterval);

            this.setStatusWaitingResult(true);
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:timer`,
              data: { timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
            });
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:admin:timer`,
              data: { phien: this.getCurrentDate(), timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
            });
            this.setStatusGame(STATUS_GAME.DANG_QUAY);
            this.sendRoomXoSo({ key: `${this.KEY_GAME}:batDauQuay` });
            this.sendRoomXoSo({ key: `${this.KEY_GAME}:admin:batDauQuay`, data: { phien: this.getCurrentDate() } });

            // Cập nhật kết quả mới nhất
            await this.getKetQuaXSMB();
            const findKetQuaToDay = await GameXoSoMB.findOne({
              ngay: this.getCurrentDate(),
              tinhTrang: STATUS_GAME.HOAN_TAT,
            }).lean();
            if (!findKetQuaToDay) {
              throw new BadRequestError("Không tìm thấy kết quả xổ số MB ngày: " + this.getCurrentDate());
            }
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:ketqua`,
              data: {
                ketQuaRandom: findKetQuaToDay.ketQua,
              },
            });

            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:admin:ketqua`,
              data: { phien: this.getCurrentDate(), ketQuaRandom: findKetQuaToDay.ketQua },
            });

            // Khi dừng quay thì cập nhật ngày xổ
            this.setLatestCompleteDate(this.getCurrentDate());
            this.setCurrentDate(dayjs().add(1, "day").format("DD/MM/YYYY"));

            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:hienThiPhien`,
              data: { currentDate: this.getCurrentDate(), latestCompleteDate: this.getLatestCompleteDate() },
            });
            this.sendRoomXoSo({ key: `${this.KEY_GAME}:dungQuay` });
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:admin:dungQuay`,
              data: { phien: this.getCurrentDate() },
            });
            this.setStatusGame(STATUS_GAME.DANG_TRA_THUONG);
            this.sendRoomXoSo({ key: `${this.KEY_GAME}:batDauTraThuong` });
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:admin:batDauTraThuong`,
              data: { phien: this.getCurrentDate() },
            });
            await this.traThuong();
            this.setStatusGame(STATUS_GAME.HOAN_TAT);
            this.sendRoomXoSo({ key: `${this.KEY_GAME}:hoanTatGame` });
            this.sendRoomXoSo({
              key: `${this.KEY_GAME}:admin:hoanTatGame`,
              data: { phien: this.getCurrentDate() },
            });

            this.startGame();
            return;
          }

          this.sendRoomXoSo({
            key: `${this.KEY_GAME}:timer`,
            data: { timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
          });
          this.sendRoomXoSo({
            key: `${this.KEY_GAME}:admin:timer`,
            data: { phien: this.getCurrentDate(), timerOpen: this.getTimerOpen(), timerStopBet: this.getTimerStopBet() },
          });
          this.sendRoomXoSo({
            key: `${this.KEY_GAME}:hienThiPhien`,
            data: { currentDate: this.getCurrentDate(), latestCompleteDate: this.getLatestCompleteDate() },
          });

          this.setTimerOpen(this.getTimerOpen() - 1);
          if (!this.getStatusStopBet()) {
            this.setTimerStopBet(this.getTimerStopBet() - 1);
          }
        }, 1000);
      }
    } catch (err) {
      this.setIsPlayGame(false);
      clearInterval(gameInterval);
      console.log(err);
    }
  };

  static getKetQuaXSMB = async () => {
    try {
      const res = await axios.get(this.BASE_URL);
      const { turnNum, openTime, issueList: listData } = res.data.t;
      await GameXoSoMB.findOneAndUpdate(
        {
          ngay: turnNum,
        },
        {
          ngay: turnNum,
          openTime,
        },
        {
          upsert: true,
        }
      );

      await Promise.all(
        listData.map(async (data) => {
          const { turnNum, openTime, detail } = data;
          await GameXoSoMB.findOneAndUpdate(
            {
              ngay: turnNum,
            },
            {
              ngay: turnNum,
              openTime,
              ketQua: handleKetQua(detail),
              tinhTrang: STATUS_GAME.HOAN_TAT,
            },
            {
              upsert: true,
            }
          );
        })
      );
    } catch (err) {
      console.log(`Không thể get kết quả XSMB: `, err);
      TelegramService.sendNotification({
        content: `Không thể get kết quả XSMB: ${JSON.stringify(err)}`,
      });
    }
  };

  static traThuong = async () => {
    try {
      await this.getKetQuaXSMB();
      const currentDate = dayjs().format("DD/MM/YYYY");
      const findKetQuaToDay = await GameXoSoMB.findOne({
        ngay: currentDate,
        tinhTrang: STATUS_GAME.HOAN_TAT,
      });
      if (!findKetQuaToDay) {
        throw new BadRequestError("Không tìm thấy kết quả xổ số MB ngày: " + currentDate);
      }
      const lichSuDatCuoc = await LichSuDatCuocXoSoMB.find({
        phien: findKetQuaToDay._id,
        tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
      })
        .populate({
          path: "phien",
          select: "_id ketQua ngay",
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
          findHeThong?.gameConfigs?.xoSoConfigs?.xoSoMB?.[`${convertKeyTiLe(loaiCuoc)}`] ?? getTiLeDefault(loaiCuoc),
        ])
      );

      const getQueueTraThuong = BullMQService.initQueue({
        queueName: GameXSMBService.QUEUE_TRA_THUONG,
      });
      // Add to queue

      await getQueueTraThuong.addBulk(
        lichSuDatCuoc.map((itemDatCuoc) => {
          const nameJob = `${this.KEY_GAME}-${itemDatCuoc.phien._id}`;
          return {
            name: nameJob,
            data: {
              findKetQuaToDay,
              bangKetQua: getKetQua(itemDatCuoc.phien.ketQua),
              nguoiDung: itemDatCuoc.nguoiDung,
              listCuoc: itemDatCuoc.datCuoc,
              itemDatCuoc,
              tiLe: bangTiLe,
              typeGame: this.KEY_GAME,
            },
            options: {
              removeOnComplete: true,
              removeOnFail: false,
              attempts: 5,
            },
          };
        })
      );
    } catch (err) {
      LoggingService.error(NAMESPACE, "traThuong", err);
      console.log(err);
      TelegramService.sendNotification({
        content: `Trả thưởng lỗi game xsmb: ${JSON.stringify(err)}`,
      });
    }
  };
  static traThuongWorker = async ({ findKetQuaToDay, nguoiDung, bangKetQua, listCuoc, tiLe, itemDatCuoc }) => {
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
                const tienThangStr = convertMoney(tienThang);
                thongBaoBienDongSoDu += `Lô: số ${so}: +${tienThangStr} | `;
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
                const tienThangStr = convertMoney(tienThang);
                thongBaoBienDongSoDu += `Đề: số ${so}: +${tienThangStr} | `;
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
                const tienThangStr = convertMoney(tienThang);
                thongBaoBienDongSoDu += `Ba càng: số ${so}: +${tienThangStr} | `;
              }
            }
          } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_2) {
            const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
            const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
            if (bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) && bangKetQua[LOAI_CUOC_GAME.LO].includes(so2)) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
              const tienThang = Math.floor((tienCuoc1 + tienCuoc2) * bangTiLe[LOAI_CUOC_GAME.LO_XIEN_2]);
              tongTienThang += tienThang;
              const tienThangStr = convertMoney(tienThang);
              thongBaoBienDongSoDu += `Lô xiên 2: số ${so1} - số ${so2}: +${tienThangStr} | `;
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
              const tienThangStr = convertMoney(tienThang);
              thongBaoBienDongSoDu += `Lô xiên 3: số ${so1} - số ${so2} - số ${so3}: +${tienThangStr} | `;
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
              const tienThangStr = convertMoney(tienThang);
              thongBaoBienDongSoDu += `Lô xiên 4: số ${so1} - số ${so2} - số ${so3} - số ${so4}: +${tienThangStr} | `;
            }
          }
        }
        // Các trường hợp còn lại thì update trạng thái thua
        if (listKetQuaCuocUpdate[indexItemCuoc] === STATUS_BET_GAME.DANG_CHO) {
          listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THUA;
        }

        // Update tiền người chơi và lịch sử cược
        await LichSuDatCuocXoSoMB.findOneAndUpdate(
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
              noiDung: `Cược game Xổ số MB thắng: ${thongBaoBienDongSoDu}`,
              loaiGame: "xosomb",
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
      const errorMessage = `Trả thưởng lỗi game xsmb phiên ${itemDatCuoc?.phien?.ngay}: ${JSON.stringify(err)}`;

      TelegramService.sendNotification({
        content: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      await session.endSession();
    }

    const keyTimeout = `${this.KEY_GAME}-${nguoiDung.taiKhoan}`;

    const handleSendSocketEvent = () => {
      const timeoutRef = setTimeout(() => {
        this.sendRoomXoSo({
          key: `${this.KEY_GAME}:update-lich-su-cuoc-ca-nhan`,
        });

        this.sendRoomAdminXoSo({
          key: `${this.KEY_GAME}:admin:refetch-data-lich-su-cuoc-game`,

          data: { phien: findKetQuaToDay._id },
        });
        this.sendRoomAdminXoSo({
          key: `${this.KEY_GAME}:admin:refetch-data-chi-tiet-phien-game`,
          data: { phien: findKetQuaToDay._id },
        });
        delete GameXSMBService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout];
      }, 3000);
      return timeoutRef;
    };
    const isHasKeyTimeout = !!GameXSMBService.LIST_TIMEOUT_SEND_SOCKET?.[keyTimeout];
    if (!isHasKeyTimeout) {
      const timeoutRef = handleSendSocketEvent();
      GameXSMBService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout] = timeoutRef;
    } else {
      clearTimeout(GameXSMBService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout]);
      const timeoutRef = handleSendSocketEvent();
      GameXSMBService.LIST_TIMEOUT_SEND_SOCKET[keyTimeout] = timeoutRef;
    }
  };
}
module.exports = GameXSMBService;
