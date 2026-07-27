const NguoiDung = require("../models/NguoiDung");
const HeThong = require("../models/HeThong");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { convertMoney } = require("../utils/convertMoney");
const UserSocketService = require("../services/user.socket.service");
const TelegramService = require("../services/telegram.service");
const { default: mongoose } = require("mongoose");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");
const { STATUS_GAME, STATUS_HISTORY_GAME } = require("../configs/game.keno");
const { TYPE_SEND_MESSAGE } = require("../configs/telegram.config");
const BienDongSoDuServiceFactory = require("../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const AdminSocketService = require("../services/admin.socket.service");
const NhatKyHoatDong = require("../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../configs/activity.config");

class GameKenoController {
  constructor({ CONFIG }) {
    this.CONFIG = CONFIG;
  }
  getTiLeGame = catchAsync(async (req, res, next) => {
    const results = await HeThong.findOne({
      systemID: 1,
    });
    const tiLeCLTX = results.gameConfigs.kenoConfigs[`${this.CONFIG.KEY_SYSTEM_DB}`].tiLeCLTX;
    return new OkResponse({
      data: tiLeCLTX,
    }).send(res);
  });
  getAllLichSuGame = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await this.CONFIG.MODEL.GAME_KENO.find({
      tinhTrang: STATUS_GAME.HOAN_TAT,
    })
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });
  /**
   * Cải tiến phân trang
   */
  getAllLichSuGameNew = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 20;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    let firstPhien = req.query.firstPhien * 1 || 0;
    if (!firstPhien) {
      if (sortValue === "-createdAt") {
        firstPhien = await this.CONFIG.MODEL.GAME_KENO.countDocuments({
          tinhTrang: STATUS_GAME.HOAN_TAT,
        });
      } else {
        firstPhien = 1;
      }
    }
    let lastPhien = sortValue === "-createdAt" ? firstPhien - results : firstPhien + results;
    console.log({
      firstPhien,
      lastPhien,
    });
    const list = await this.CONFIG.MODEL.GAME_KENO.find({
      tinhTrang: STATUS_GAME.HOAN_TAT,
      $and: [
        {
          phien: {
            $gte: sortValue === "-createdAt" ? lastPhien : firstPhien,
          },
        },
        {
          phien: {
            $lt: sortValue === "-createdAt" ? firstPhien : lastPhien,
          },
        },
      ],
    })
      .sort(sortValue)
      .lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        firstPhien,
        lastPhien,
        nextFistPhien: lastPhien + 1,
      },
    }).send(res);
  });

  createDatCuoc = catchAsync(async (req, res, next) => {
    const { phien, chiTietCuoc } = req.body;
    const { _id: userID } = req.user;

    let retries = 3;

    while (retries > 0) {
      let isErrorUpdateMoneyConcurrency = false;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          // 1. Lock và kiểm tra phiên với remaining time
          const findPhien = await this.CONFIG.MODEL.GAME_KENO.findOne({
            phien,
            tinhTrang: STATUS_GAME.DANG_CHO,
          }).session(session);
          if (!findPhien) {
            throw new BadRequestError("Vui lòng chờ phiên mới");
          }
          // 2. Lock và kiểm tra user
          const findUser = await NguoiDung.findOneAndUpdate(
            {
              _id: userID,
              isProcessing: { $ne: true },
            },
            { $set: { isProcessing: true, lockTimestamp: Date.now() } },
            { new: true, session }
          );

          if (!findUser) {
            isErrorUpdateMoneyConcurrency = true;
            throw new BadRequestError("Xảy ra lỗi, vui lòng thử lại sau");
          }

          const lichSuCuoc = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.findOne({
            phien: findPhien._id,
            nguoiDung: userID,
            tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
          }).session(session);

          if (!lichSuCuoc) {
            const tongTienCuoc = chiTietCuoc.reduce((a, b) => a + b.tienCuoc, 0);

            // check tiền người dùng
            if (findUser.money < tongTienCuoc) {
              throw new BadRequestError("Không đủ tiền cược");
            }
            // Cập nhật tiền người dùng
            const updateTienNguoiDung = await NguoiDung.findOneAndUpdate(
              {
                _id: userID,
                isProcessing: true,
                money: { $gte: tongTienCuoc },
              },
              {
                $inc: { money: -tongTienCuoc, tienCuoc: tongTienCuoc },
                $set: { isProcessing: false },
              },
              {
                new: true,
                session,
              }
            );
            if (!updateTienNguoiDung) {
              isErrorUpdateMoneyConcurrency = true;
              throw new Error("Xảy ra lỗi, vui lòng thử lại sau");
            }
            // Insert lịch sử đặt cược
            const insertLichSuDatCuoc = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.create(
              [
                {
                  tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
                  phien: findPhien._id,
                  nguoiDung: userID,
                  datCuoc: chiTietCuoc,
                },
              ],
              {
                session,
              }
            );

            // Insert Biến động số dư
            let noiDungBienDongSoDu = "";

            chiTietCuoc.forEach((item) => {
              noiDungBienDongSoDu += `Cược bi ${item.loaiBi} - ${item.loaiCuoc} - ${convertMoney(item.tienCuoc)} | `;
            });
            noiDungBienDongSoDu = noiDungBienDongSoDu.slice(0, -2);

            const insertBienDongSoDu = BienDongSoDuServiceFactory.createBienDong({
              type: TYPE_BALANCE_FLUCTUATION.GAME,
              payload: {
                nguoiDung: userID,
                tienTruoc: findUser.money,
                tienSau: findUser.money - tongTienCuoc,
                noiDung: `Cược game ${this.CONFIG.TYPE_GAME}: ${noiDungBienDongSoDu}`,
                loaiGame: this.CONFIG.ROOM,
              },
              options: {
                session,
              },
            });

            const insertNhatKyHoatDong = NhatKyHoatDong.insertNhatKyHoatDong({
              taiKhoan: req.user.taiKhoan,
              userId: req.user._id,
              typeActivity: TYPE_ACTIVITY.GAME,
              actionActivity: ACTION_ACTIVITY.GAME.DAT_CUOC,
              description: `Đặt cược game Keno ${this.CONFIG.TYPE_GAME} phiên ${findPhien.phien}`,
              metadata: {
                chiTietCuoc,
                tongTienCuoc,
                taiKhoan: updateTienNguoiDung.taiKhoan,
                idDatCuoc: insertLichSuDatCuoc[0]._id,
              },
              options: {
                session,
              },
            });
            await Promise.all([insertBienDongSoDu, insertNhatKyHoatDong]);
            this.CONFIG.METHOD.SEND_ROOM_ADMIN_KENO({
              key: `${this.CONFIG.ROOM}:admin:refetch-data-lich-su-cuoc-game`,
              data: { phien: findPhien._id },
            });
            // Send event refetch users dashboard
            AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-game-transactionals-dashboard" });

            // Update số dư tài khoản realtime
            UserSocketService.updateUserBalance({ user: findUser.taiKhoan, updateBalance: -tongTienCuoc });

            // Send notification Telegram
            const noiDungBot = `${findUser.taiKhoan} vừa cược game ${this.CONFIG.TYPE_GAME} ở phiên ${phien}: ${noiDungBienDongSoDu}`;
            TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.GAME });
          } else {
            // Check tồn tại một loại cược khác loại cược ban đầu

            const lichSuDatCuoc = lichSuCuoc.datCuoc;
            const lichSuDacCuocMoi = chiTietCuoc;
            let tongTienCuoc = 0;
            let noiDungBienDongSoDu = "";

            let isDuplicateCuoc = false;

            for (const itemMoi of lichSuDacCuocMoi) {
              const findCuocByBi = lichSuDatCuoc.find((item) => item.loaiBi === itemMoi.loaiBi);
              if (!findCuocByBi) {
                isDuplicateCuoc = false;
              } else {
                if (findCuocByBi.loaiCuoc === itemMoi.loaiCuoc) {
                  isDuplicateCuoc = false;
                } else {
                  isDuplicateCuoc = true;
                }
              }
            }
            if (isDuplicateCuoc) {
              throw new BadRequestError("Bạn chỉ được phép đặt cược 1 bên");
            }

            for (const itemCu of lichSuDatCuoc) {
              const getItemMoi = lichSuDacCuocMoi.find((item) => item.loaiBi === itemCu.loaiBi && item.loaiCuoc === itemCu.loaiCuoc);
              if (getItemMoi) {
                const tienCuocThayDoi = getItemMoi.tienCuoc - itemCu.tienCuoc;
                if (tienCuocThayDoi !== 0) {
                  tongTienCuoc += tienCuocThayDoi;
                  noiDungBienDongSoDu += `Cược thêm bi ${getItemMoi.loaiBi} - ${getItemMoi.loaiCuoc} - ${convertMoney(tienCuocThayDoi)} | `;
                }
              }
            }
            for (const itemMoi of lichSuDacCuocMoi) {
              const checkIsExist = lichSuDatCuoc.find((item) => item.loaiCuoc === itemMoi.loaiCuoc && item.loaiBi === itemMoi.loaiBi);
              if (!checkIsExist) {
                tongTienCuoc += itemMoi.tienCuoc;
                noiDungBienDongSoDu += `Cược bi ${itemMoi.loaiBi} - ${itemMoi.loaiCuoc} - ${convertMoney(itemMoi.tienCuoc)} | `;
              }
            }
            noiDungBienDongSoDu = noiDungBienDongSoDu.slice(0, -2);
            if (tongTienCuoc <= 0) {
              throw new UnauthorizedError("Vui lòng chọn cược");
            }

            if (findUser.money < tongTienCuoc) {
              throw new BadRequestError("Không đủ tiền cược");
            }
            const updateTienNguoiDung = await NguoiDung.findOneAndUpdate(
              {
                _id: userID,
                isProcessing: true,
                money: { $gte: tongTienCuoc },
              },
              {
                $inc: { money: -tongTienCuoc, tienCuoc: tongTienCuoc },
                $set: { isProcessing: false },
              },
              {
                new: true,
                session,
              }
            );
            if (!updateTienNguoiDung) {
              isErrorUpdateMoneyConcurrency = true;
              throw new Error("Xảy ra lỗi, vui lòng thử lại sau");
            }

            const insertLichSuDatCuoc = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.findOneAndUpdate(
              { tinhTrang: STATUS_HISTORY_GAME.DANG_CHO, phien: findPhien._id, nguoiDung: userID },
              {
                datCuoc: lichSuDacCuocMoi,
              },
              {
                new: false,
                session,
              }
            );

            const insertBienDongSoDu = BienDongSoDuServiceFactory.createBienDong({
              type: TYPE_BALANCE_FLUCTUATION.GAME,
              payload: {
                nguoiDung: userID,
                tienTruoc: findUser.money,
                tienSau: findUser.money - tongTienCuoc,
                noiDung: `Cược game ${this.CONFIG.TYPE_GAME}: ${noiDungBienDongSoDu}`,
                loaiGame: this.CONFIG.ROOM,
              },
              options: {
                session,
              },
            });

            const insertNhatKyHoatDong = NhatKyHoatDong.insertNhatKyHoatDong({
              taiKhoan: req.user.taiKhoan,
              userId: req.user._id,
              typeActivity: TYPE_ACTIVITY.GAME,
              actionActivity: ACTION_ACTIVITY.GAME.DAT_CUOC,
              description: `Đặt cược game Keno ${this.CONFIG.TYPE_GAME} phiên ${findPhien.phien}`,
              metadata: {
                lichSuDatCuocCu: insertLichSuDatCuoc.datCuoc,
                lichSuDacCuocMoi,
                tongTienCuoc,
                taiKhoan: updateTienNguoiDung.taiKhoan,
                idDatCuoc: insertLichSuDatCuoc._id,
              },
              options: {
                session,
              },
            });

            await Promise.all([insertBienDongSoDu, insertNhatKyHoatDong]);
            this.CONFIG.METHOD.SEND_ROOM_ADMIN_KENO({
              key: `${this.CONFIG.ROOM}:admin:refetch-data-lich-su-cuoc-game`,
              data: { phien: findPhien._id },
            });
            // Send event refetch users dashboard
            AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-game-transactionals-dashboard" });

            // Update số dư tài khoản realtime
            UserSocketService.updateUserBalance({ user: findUser.taiKhoan, updateBalance: -tongTienCuoc });

            // Send notification Telegram
            const noiDungBot = `${findUser.taiKhoan} vừa cược game ${this.CONFIG.TYPE_GAME} ở phiên ${phien}: ${noiDungBienDongSoDu}`;
            TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.GAME });
          }
        });
        break;
      } catch (error) {
        if (isErrorUpdateMoneyConcurrency) {
          retries -= 1;
          if (retries === 0) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 100 * (3 - retries)));
        } else {
          throw error;
        }
      } finally {
        await NguoiDung.findOneAndUpdate(
          {
            _id: userID,
          },
          {
            $set: { isProcessing: false },
          },
          {
            session,
          }
        );
        await session.endSession();
      }
    }

    return new CreatedResponse({
      message: "Đặt cược thành công",
    }).send(res);
  });

  getAllLichSuCuocGame = catchAsync(async (req, res, next) => {
    const { _id: userID } = req.user;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.find({
      nguoiDung: userID,
    })
      .skip(skip)
      .limit(results)
      .sort(sortValue)
      .populate("phien")
      .lean();

    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });

  getLichSuCuocGameChiTiet = catchAsync(async (req, res, next) => {
    const { _id: userID } = req.user;
    const { phien } = req.params;
    const findPhien = await this.CONFIG.MODEL.GAME_KENO.findOne({
      phien,
    });
    if (!findPhien) {
      throw new NotFoundError("Không tìm thấy phiên game");
    }

    const list = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.findOne({
      nguoiDung: userID,
      phien: findPhien._id,
    }).select("datCuoc");
    return new OkResponse({
      data: list,
    }).send(res);
  });
}
module.exports = GameKenoController;
