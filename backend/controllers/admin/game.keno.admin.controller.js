const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const HeThong = require("../../models/HeThong");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");

class GameKenoAdminController {
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
  setTiLeGame = catchAsync(async (req, res, next) => {
    const { tiLe } = req.body;
    if (!tiLe) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const field = `gameConfigs.kenoConfigs.${this.CONFIG.KEY_SYSTEM_DB}.tiLeCLTX`;
    const update = {};
    update[field] = tiLe;

    const result = await HeThong.findOneAndUpdate(
      {
        systemID: 1,
      },
      { $set: update },
      {
        new: false,
      }
    ).lean();

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_TI_LE_GAME,
      description: `Set tỉ lệ game ${this.CONFIG.KEY_SYSTEM_DB}`,
      metadata: {
        tiLeBefore: result.gameConfigs.kenoConfigs[`${this.CONFIG.KEY_SYSTEM_DB}`].tiLeCLTX,
        tiLeAfter: tiLe,
      },
    });

    return new OkResponse({
      data: tiLe,
    }).send(res);
  });

  setStatusAutoGame = catchAsync(async (req, res, next) => {
    const { autoGame } = req.body;
    const field = `gameConfigs.kenoConfigs.${this.CONFIG.KEY_SYSTEM_DB}.autoGame`;
    const update = {};
    update[field] = !!autoGame;
    const result = await HeThong.findOneAndUpdate(
      {
        systemID: 1,
      },
      { $set: update },
      {
        new: false,
      }
    );

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_STATUS_AUTO_GAME,
      description: `Set status auto game ${this.CONFIG.KEY_SYSTEM_DB}`,
      metadata: {
        statusBefore: result.gameConfigs.kenoConfigs[`${this.CONFIG.KEY_SYSTEM_DB}`].autoGame,
        statusAfter: !!autoGame,
      },
    });

    return new OkResponse({
      data: autoGame,
      message: "Chỉnh thành công, kết quả sẽ được áp dụng từ phiên sau",
    }).send(res);
  });

  getStatusAutoGame = catchAsync(async (req, res, next) => {
    const results = await HeThong.findOne({
      systemID: 1,
    });
    const isAutoGame = results.gameConfigs.kenoConfigs[`${this.CONFIG.KEY_SYSTEM_DB}`].autoGame;
    return new OkResponse({
      data: isAutoGame,
    }).send(res);
  });
  getAllLichSuGame = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    const searchQuery = req.query?.query ?? "";
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    let query = {};
    if (searchQuery) {
      query = {
        phien: {
          $eq: searchQuery,
        },
      };
    }
    const list = await this.CONFIG.MODEL.GAME_KENO.find(query).skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        searchQuery,
      },
    }).send(res);
  });
  countAllGame = catchAsync(async (req, res, next) => {
    const searchQuery = req.query?.query ?? "";
    let query = {};
    if (searchQuery) {
      query = {
        phien: {
          $eq: searchQuery,
        },
      };
    }
    const countList = await this.CONFIG.MODEL.GAME_KENO.countDocuments(query);
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  getLichSuGameChiTiet = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await this.CONFIG.MODEL.GAME_KENO.findOne({
      _id: id,
    }).lean();
    return new OkResponse({
      data: result,
      metadata: {
        id,
      },
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
    const { phien } = req.params;
    const findPhien = await this.CONFIG.MODEL.GAME_KENO.findOne({
      _id: phien,
    });
    if (!findPhien) {
      throw new NotFoundError("Không tìm thấy phiên game");
    }

    const list = await this.CONFIG.MODEL.LICH_SU_DAT_CUOC.find({
      phien: findPhien._id,
    })
      .populate("nguoiDung")
      .lean();
    return new OkResponse({
      data: list,
    }).send(res);
  });
}
module.exports = GameKenoAdminController;
