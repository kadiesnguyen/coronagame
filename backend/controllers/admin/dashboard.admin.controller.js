"use strict";

const catchAsync = require("../../utils/catch_async");
const { OkResponse } = require("../../utils/successResponse");
const _ = require("lodash");
const dayjs = require("dayjs");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);
const NguoiDung = require("../../models/NguoiDung");
const LichSuNap = require("../../models/LichSuNap");
const BienDongSoDu = require("../../models/BienDongSoDu");
const { TYPE_BALANCE_FLUCTUATION } = require("../../configs/balance.fluctuation.config");
const { BadRequestError } = require("../../utils/app_error");
const { STATUS_DEPOSIT } = require("../../configs/deposit.config");
const { USER_ROLE } = require("../../configs/user.config");

class DashboardAdminController {
  static getUserDashboard = catchAsync(async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    const listPromises = [];

    let totalUsers = 0;
    const fetchData = async (currentFormDate) => {
      const keyDisplayDate = currentFormDate.get("date") + "/" + (currentFormDate.get("month") + 1);
      try {
        const result = await NguoiDung.countDocuments({
          createdAt: {
            $gte: currentFormDate.toDate(),
            $lt: currentFormDate.add(1, "day").toDate(),
          },
        });
        return {
          name: keyDisplayDate,
          value: result,
        };
      } catch (err) {
        throw new BadRequestError("Có lỗi khi lấy dữ liệu: ", keyDisplayDate);
      }
    };

    for (
      let currentFormDate = dayjs(fromDate);
      currentFormDate.isSameOrBefore(dayjs(toDate));
      currentFormDate = currentFormDate.add(1, "day")
    ) {
      listPromises.push(fetchData(currentFormDate));
    }

    const listData = await Promise.all(listPromises);

    listData.forEach(({ value }) => {
      totalUsers += value;
    });

    return new OkResponse({
      data: listData,
      metadata: {
        ...req.query,
        totalUsers,
      },
    }).send(res);
  });
  static getDepositDashboard = catchAsync(async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    const listPromises = [];
    let total = 0;

    const fetchData = async (currentFormDate) => {
      const keyDisplayDate = currentFormDate.get("date") + "/" + (currentFormDate.get("month") + 1);

      try {
        const result = await LichSuNap.find({
          tinhTrang: STATUS_DEPOSIT.SUCCESS,
          createdAt: {
            $gte: currentFormDate.toDate(),
            $lt: currentFormDate.add(1, "day").toDate(),
          },
        }).lean();
        const totalMoney = _.sumBy(result, "soTien");
        return {
          name: keyDisplayDate,
          value: totalMoney,
        };
      } catch (err) {
        throw new BadRequestError("Có lỗi khi lấy dữ liệu: ", keyDisplayDate);
      }
    };
    for (
      let currentFormDate = dayjs(fromDate);
      currentFormDate.isSameOrBefore(dayjs(toDate));
      currentFormDate = currentFormDate.add(1, "day")
    ) {
      listPromises.push(fetchData(currentFormDate));
    }

    const listData = await Promise.all(listPromises);

    listData.forEach(({ value }) => {
      total += value;
    });

    return new OkResponse({
      data: listData,
      metadata: {
        ...req.query,
        total,
      },
    }).send(res);
  });
  static getGameTransactionalsDashboard = catchAsync(async (req, res, next) => {
    const { fromDate, toDate } = req.query;
    const listPromises = [];
    let total = 0;

    const fetchData = async (currentFormDate) => {
      const keyDisplayDate = currentFormDate.get("date") + "/" + (currentFormDate.get("month") + 1);

      try {
        const result = await BienDongSoDu.find({
          type: TYPE_BALANCE_FLUCTUATION.GAME,
          createdAt: {
            $gte: currentFormDate.toDate(),
            $lt: currentFormDate.add(1, "day").toDate(),
          },
        }).lean();
        const totalMoney = _.sumBy(result, (o) => {
          const thayDoi = o.tienSau - o.tienTruoc;
          return thayDoi < 0 ? thayDoi * -1 : thayDoi;
        });
        return {
          name: keyDisplayDate,
          value: totalMoney,
        };
      } catch (err) {
        throw new BadRequestError("Có lỗi khi lấy dữ liệu: ", keyDisplayDate);
      }
    };
    for (
      let currentFormDate = dayjs(fromDate);
      currentFormDate.isSameOrBefore(dayjs(toDate));
      currentFormDate = currentFormDate.add(1, "day")
    ) {
      listPromises.push(fetchData(currentFormDate));
    }

    const listData = await Promise.all(listPromises);

    listData.forEach(({ value }) => {
      total += value;
    });

    return new OkResponse({
      data: listData,
      metadata: {
        ...req.query,
        total,
      },
    }).send(res);
  });

  /**
   * Top 5 thắng / Top 5 cược (7 ngày) từ BienDongSoDu type=game.
   * thắng = tổng delta dương; cược = tổng |delta| khi trừ tiền.
   */
  static getTopGameDashboard = catchAsync(async (req, res, next) => {
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 31);
    const fromDate = dayjs().subtract(days, "day").startOf("day").toDate();
    const toDate = dayjs().endOf("day").toDate();

    const adminIds = await NguoiDung.find({ role: USER_ROLE.ADMIN }).distinct("_id");

    const grouped = await BienDongSoDu.aggregate([
      {
        $match: {
          type: TYPE_BALANCE_FLUCTUATION.GAME,
          createdAt: { $gte: fromDate, $lte: toDate },
          nguoiDung: { $nin: adminIds },
        },
      },
      {
        $project: {
          nguoiDung: 1,
          delta: { $subtract: ["$tienSau", "$tienTruoc"] },
        },
      },
      {
        $group: {
          _id: "$nguoiDung",
          tongThang: {
            $sum: {
              $cond: [{ $gt: ["$delta", 0] }, "$delta", 0],
            },
          },
          tongCuoc: {
            $sum: {
              $cond: [{ $lt: ["$delta", 0] }, { $abs: "$delta" }, 0],
            },
          },
        },
      },
    ]);

    const userIds = grouped.map((g) => g._id).filter(Boolean);
    const users = await NguoiDung.find({ _id: { $in: userIds } })
      .select("taiKhoan money")
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const withUser = grouped
      .map((g) => {
        const user = userMap.get(String(g._id));
        if (!user) return null;
        return {
          userId: String(g._id),
          taiKhoan: user.taiKhoan,
          tongThang: Number(g.tongThang) || 0,
          tongCuoc: Number(g.tongCuoc) || 0,
        };
      })
      .filter(Boolean);

    const topThang = [...withUser]
      .filter((x) => x.tongThang > 0)
      .sort((a, b) => b.tongThang - a.tongThang)
      .slice(0, 5)
      .map((x, i) => ({ rank: i + 1, userId: x.userId, taiKhoan: x.taiKhoan, amount: x.tongThang }));

    const topCuoc = [...withUser]
      .filter((x) => x.tongCuoc > 0)
      .sort((a, b) => b.tongCuoc - a.tongCuoc)
      .slice(0, 5)
      .map((x, i) => ({ rank: i + 1, userId: x.userId, taiKhoan: x.taiKhoan, amount: x.tongCuoc }));

    return new OkResponse({
      data: { topThang, topCuoc },
      metadata: { days, fromDate, toDate },
    }).send(res);
  });
}

module.exports = DashboardAdminController;
