const NguoiDung = require("../models/NguoiDung");
const HeThong = require("../models/HeThong");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { convertMoney } = require("../utils/convertMoney");
const UserSocketService = require("../services/user.socket.service");
const TelegramService = require("../services/telegram.service");
const { default: mongoose } = require("mongoose");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");
const { STATUS_GAME, STATUS_HISTORY_GAME, LOAI_CUOC_GAME, DEFAULT_SETTING_GAME } = require("../configs/game.xoso");
const { TYPE_SEND_MESSAGE } = require("../configs/telegram.config");
const BienDongSoDuServiceFactory = require("../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const { convertChiTietCuoc, convertLoaiCuoc, getTiLeDefault, convertKeyTiLe } = require("../utils/game/xoso");
const _ = require("lodash");
const AdminSocketService = require("../services/admin.socket.service");
const GameXoSoMB = require("../models/GameXoSoMB");
const LichSuDatCuocXoSoMB = require("../models/LichSuDatCuocXoSoMB");
const GameXSMBService = require("../services/game.xsmb.service");
const dayjs = require("dayjs");
const NhatKyHoatDong = require("../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../configs/activity.config");
class GameXoSoMBController {
  static KEY_GAME = "xosomb";
  static getTiLeGame = catchAsync(async (req, res, next) => {
    const results = await HeThong.findOne({
      systemID: 1,
    });

    const bangTiLe = Object.fromEntries(
      Object.values(LOAI_CUOC_GAME).map((loaiCuoc) => [
        loaiCuoc,
        results?.gameConfigs?.xoSoConfigs?.xoSoMB?.[`${convertKeyTiLe(loaiCuoc)}`] ?? getTiLeDefault(loaiCuoc),
      ])
    );

    return new OkResponse({
      data: bangTiLe,
    }).send(res);
  });
  static getAllLichSuGame = catchAsync(async (req, res, next) => {
    const checkKetQuaNgayTruoc = await GameXoSoMB.findOne({
      ngay: dayjs().subtract(1, "d").format("DD/MM/YYYY"),
    }).lean();

    // Nếu chưa tìm thấy kết quả ngày trước thì thực hiện get lại kết quả
    if (!checkKetQuaNgayTruoc) {
      await GameXSMBService.getKetQuaXSMB();
    }
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-openTime"];
    sortValue = sortValue.join(" ");
    const list = await GameXoSoMB.find({
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

  static createDatCuoc = catchAsync(async (req, res, next) => {
    const { ngay, loaiCuoc, listSoCuoc, tienCuoc } = req.body;
    const currentDate = GameXSMBService.getCurrentDate();
    const { _id: userID } = req.user;
    const listSoCuocString = [];
    if (!tienCuoc || !_.isNumber(tienCuoc)) {
      throw new UnauthorizedError("Vui lòng chọn tiền cược hợp lệ");
    }
    if (parseInt(tienCuoc) <= 0) {
      throw new UnauthorizedError("Vui lòng chọn tiền cược hợp lệ");
    }
    if (!_.isArray(listSoCuoc)) {
      throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ");
    }
    listSoCuoc.forEach((soCuoc) => {
      if (!_.isNumber(soCuoc)) {
        throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ");
      } else {
        let convertToStringSoCuoc;
        if (loaiCuoc === LOAI_CUOC_GAME.BA_CANG) {
          convertToStringSoCuoc = soCuoc < 10 ? "00" + soCuoc : soCuoc < 100 ? "0" + soCuoc : "" + soCuoc;
        } else {
          convertToStringSoCuoc = soCuoc < 10 ? "0" + soCuoc : "" + soCuoc;
        }
        listSoCuocString.push(convertToStringSoCuoc);
      }
    });
    if (!Object.values(LOAI_CUOC_GAME).includes(loaiCuoc)) {
      throw new UnauthorizedError("Vui lòng chọn loại cược hợp lệ");
    }

    if (loaiCuoc === LOAI_CUOC_GAME.LO || loaiCuoc === LOAI_CUOC_GAME.DE || loaiCuoc === LOAI_CUOC_GAME.BA_CANG) {
      if (listSoCuoc.length < 1 || listSoCuoc.length > 10) {
        throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ");
      }
    }
    if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_2) {
      if (listSoCuoc.length !== 2) {
        throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ (tối thiểu 2 số)");
      }
    }
    if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_3) {
      if (listSoCuoc.length !== 3) {
        throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ (tối thiểu 3 số)");
      }
    }
    if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_4) {
      if (listSoCuoc.length !== 4) {
        throw new UnauthorizedError("Vui lòng chọn số cược hợp lệ (tối thiểu 4 số)");
      }
    }
    let retries = 3;
    while (retries > 0) {
      let isErrorUpdateMoneyConcurrency = false;
      const session = await mongoose.startSession();
      try {
        const findPhien = await GameXoSoMB.findOne({
          ngay: currentDate,
          tinhTrang: STATUS_GAME.DANG_CHO,
        }).session(session);
        if (!findPhien) {
          throw new BadRequestError("Vui lòng chờ phiên mới");
        }
        if (GameXSMBService.getStatusStopBet()) {
          throw new BadRequestError("Hết thời gian cược, hãy chờ phiên mới");
        }
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
        const tongTienCuoc = tienCuoc * listSoCuoc.length;

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
          isErrorUpdateMoneyConcurrency = true;
          throw new Error("Xảy ra lỗi, vui lòng thử lại sau");
        }

        // Insert lịch sử đặt cược
        const insertLichSuDatCuoc = await LichSuDatCuocXoSoMB.create(
          [
            {
              tinhTrang: STATUS_HISTORY_GAME.DANG_CHO,
              phien: findPhien._id,
              nguoiDung: userID,
              datCuoc: [
                {
                  loaiCuoc,
                  chiTietCuoc: listSoCuocString.map((soCuoc) => ({
                    so: soCuoc,
                    tienCuoc,
                  })),
                  tongTienCuoc,
                },
              ],
            },
          ],
          {
            session,
          }
        );

        // Insert Biến động số dư
        let noiDungBienDongSoDu = `Cược ${convertLoaiCuoc(loaiCuoc)}: `;

        listSoCuocString.forEach((soCuoc) => {
          noiDungBienDongSoDu += `Chọn số ${soCuoc} - ${convertMoney(tienCuoc)} | `;
        });
        noiDungBienDongSoDu = noiDungBienDongSoDu.slice(0, -2);

        const insertBienDongSoDu = BienDongSoDuServiceFactory.createBienDong({
          type: TYPE_BALANCE_FLUCTUATION.GAME,
          payload: {
            nguoiDung: userID,
            tienTruoc: findUser.money,
            tienSau: findUser.money - tongTienCuoc,
            noiDung: `Cược game XSMB ngày ${findPhien.ngay}: ${noiDungBienDongSoDu}`,
            loaiGame: this.KEY_GAME,
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
          description: `Đặt cược game Xổ số Miền Bắc phiên ${findPhien.ngay}`,
          metadata: {
            listSoCuocString,
            tongTienCuoc,
            taiKhoan: updateTienNguoiDung.taiKhoan,
            idDatCuoc: insertLichSuDatCuoc[0]._id,
          },

          options: {
            session,
          },
        });

        await Promise.all([insertBienDongSoDu, insertNhatKyHoatDong]);

        GameXSMBService.sendRoomAdminXoSo({
          key: `${this.KEY_GAME}:admin:refetch-data-lich-su-cuoc-game`,
          data: { phien: findPhien._id },
        });

        // Send event refetch users dashboard
        AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-game-transactionals-dashboard" });

        // Update số dư tài khoản realtime
        UserSocketService.updateUserBalance({ user: findUser.taiKhoan, updateBalance: -tongTienCuoc });

        // Send notification Telegram
        const noiDungBot = `${findUser.taiKhoan} vừa cược game XSMB ở phiên ${findPhien.ngay}: ${noiDungBienDongSoDu}`;
        TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.GAME });

        break;
      } catch (err) {
        if (isErrorUpdateMoneyConcurrency) {
          retries -= 1;
          if (retries === 0) {
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, 100 * (3 - retries)));
        } else {
          throw err;
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

  static getAllLichSuCuocGame = catchAsync(async (req, res, next) => {
    const { _id: userID } = req.user;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await LichSuDatCuocXoSoMB.find({
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

  static getLichSuCuocGameChiTiet = catchAsync(async (req, res, next) => {
    const { _id: userID } = req.user;
    const { phien } = req.params;
    const findPhien = await GameXoSoMB.findOne({
      ngay: phien,
    });
    if (!findPhien) {
      throw new NotFoundError("Không tìm thấy phiên game");
    }

    const list = await LichSuDatCuocXoSoMB.findOne({
      nguoiDung: userID,
      phien: findPhien._id,
    }).select("datCuoc");
    return new OkResponse({
      data: list,
    }).send(res);
  });
}
module.exports = GameXoSoMBController;
