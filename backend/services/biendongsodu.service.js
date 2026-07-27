"use strict";
const { TYPE_BALANCE_FLUCTUATION } = require("../configs/balance.fluctuation.config");
const BienDongSoDu = require("../models/BienDongSoDu");
const BienDongSoDuDeposit = require("../models/BienDongSoDuDeposit");
const BienDongSoDuGame = require("../models/BienDongSoDuGame");
const BienDongSoDuWithdraw = require("../models/BienDongSoDuWithdraw");
const { BadRequestError } = require("../utils/app_error");

class BienDongSoDuServiceFactory {
  static createBienDong = async ({ type, payload, options }) => {
    if (type === TYPE_BALANCE_FLUCTUATION.GAME) {
      return new BienDongSoDuGameService({ ...payload, options }).createBienDong();
    }
    if (type === TYPE_BALANCE_FLUCTUATION.DEPOSIT) {
      return new BienDongSoDuDepositService({ ...payload, options }).createBienDong();
    }
    if (type === TYPE_BALANCE_FLUCTUATION.WITHDRAW) {
      return new BienDongSoDuWithdrawService({ ...payload, options }).createBienDong();
    }
    throw new BadRequestError("Vui lòng nhập loại biến động hợp lệ");
  };
}

class BienDongSoDuService {
  constructor({ nguoiDung, tienTruoc, tienSau, noiDung, type = TYPE_BALANCE_FLUCTUATION.OTHER, options = {} }) {
    this.nguoiDung = nguoiDung;
    this.tienTruoc = tienTruoc;
    this.tienSau = tienSau;
    this.noiDung = noiDung;
    this.type = type;
    this.options = options;
  }

  async createBienDong(metadata) {
    try {
      const result = await BienDongSoDu.create([{ ...this, options: undefined, metadata: metadata }], this.options);
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Có lỗi khi tạo biến động số dư");
    }
  }
}

class BienDongSoDuGameService extends BienDongSoDuService {
  constructor({ nguoiDung, tienTruoc, tienSau, noiDung, loaiGame, options = {} }) {
    super({
      nguoiDung,
      tienTruoc,
      tienSau,
      noiDung,
      type: TYPE_BALANCE_FLUCTUATION.GAME,
      options,
    });
    this.metadata = { loaiGame };
  }
  createBienDong = async () => {
    try {
      const bienDong = await BienDongSoDuGame.create([this.metadata], this.options);

      if (bienDong.length === 0) {
        throw new BadRequestError("Có lỗi khi tạo biến động số dư deposit");
      }
      const result = await super.createBienDong(bienDong[0]);
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Có lỗi khi tạo biến động số dư game");
    }
  };
}
class BienDongSoDuDepositService extends BienDongSoDuService {
  constructor({ nguoiDung, tienTruoc, tienSau, noiDung, loaiDeposit, options = {} }) {
    super({
      nguoiDung,
      tienTruoc,
      tienSau,
      noiDung,
      type: TYPE_BALANCE_FLUCTUATION.DEPOSIT,
      options,
    });
    this.metadata = { loaiDeposit };
  }
  createBienDong = async () => {
    try {
      const bienDong = await BienDongSoDuDeposit.create([this.metadata], this.options);
      if (bienDong.length === 0) {
        throw new BadRequestError("Có lỗi khi tạo biến động số dư deposit");
      }
      const result = await super.createBienDong(bienDong[0]);
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Có lỗi khi tạo biến động số dư deposit");
    }
  };
}

class BienDongSoDuWithdrawService extends BienDongSoDuService {
  constructor({ nguoiDung, tienTruoc, tienSau, noiDung, nganHang, options = {} }) {
    super({
      nguoiDung,
      tienTruoc,
      tienSau,
      noiDung,
      type: TYPE_BALANCE_FLUCTUATION.WITHDRAW,
      options,
    });
    this.metadata = { nganHang };
  }
  createBienDong = async () => {
    try {
      const bienDong = await BienDongSoDuWithdraw.create([this.metadata], this.options);
      if (bienDong.length === 0) {
        throw new BadRequestError("Có lỗi khi tạo biến động số dư withdraw");
      }
      const result = await super.createBienDong(bienDong[0]);
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Có lỗi khi tạo biến động số dư withdraw");
    }
  };
}
module.exports = BienDongSoDuServiceFactory;
