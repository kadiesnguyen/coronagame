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
}

module.exports = DashboardAdminController;
