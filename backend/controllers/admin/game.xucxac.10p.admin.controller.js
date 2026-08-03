const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../../configs/activity.config");
const { STATUS_BET_GAME, STATUS_HISTORY_GAME } = require("../../configs/game.xucxac");
const HeThong = require("../../models/HeThong");
const GameXucXac10P = require("../../models/GameXucXac10P");
const LichSuDatCuocXucXac10P = require("../../models/LichSuDatCuocXucXac10P");
const NhatKyHoatDong = require("../../models/NhatKyHoatDong");
const GameXucXac10PSocketService = require("../../services/game.socket.service/game.xucxac10p.socket.service");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../../utils/app_error");
const catchAsync = require("../../utils/catch_async");
const { swapCuocDoi } = require("../../utils/swapCuocDoi");
const { OkResponse } = require("../../utils/successResponse");
const { DEFAULT_XUCXAC10P_TI_LE_VIP, normalizeTiLeVip } = require("../../utils/vip");
const GameXucXacAdminController = require("./game.xucxac.admin.controller");

class GameXucXac10PAdminController extends GameXucXacAdminController {
  constructor() {
    const CONFIG = {
      TYPE_GAME: "Xúc Xắc 10P",
      ROOM: "xucxac10p",
      ADMIN_ROOM: "admin_xucxac10p",
      KEY_SYSTEM_DB: "xucXac10P",
      MODEL: {
        GAME_XUCXAC: GameXucXac10P,
        LICH_SU_DAT_CUOC: LichSuDatCuocXucXac10P,
      },
      METHOD: {
        SEND_ROOM_XUCXAC: GameXucXac10PSocketService.sendRoomXucXac,
        SEND_ROOM_ADMIN_XUCXAC: GameXucXac10PSocketService.sendRoomAdminXucXac,
      },
    };
    super({
      CONFIG,
    });
  }

  getTiLeGame = catchAsync(async (req, res) => {
    const results = await HeThong.findOne({ systemID: 1 });
    const config = results?.gameConfigs?.xucXacConfigs?.xucXac10P;
    return new OkResponse({
      data: normalizeTiLeVip(config?.tiLeVip ?? DEFAULT_XUCXAC10P_TI_LE_VIP, DEFAULT_XUCXAC10P_TI_LE_VIP),
    }).send(res);
  });

  setTiLeGame = catchAsync(async (req, res) => {
    const { tiLe, tiLeVip } = req.body;
    const source = tiLeVip ?? tiLe;
    if (!source || typeof source !== "object") {
      throw new UnauthorizedError("Vui lòng nhập tỉ lệ VIP1/VIP2/VIP3");
    }
    const normalized = normalizeTiLeVip(source, DEFAULT_XUCXAC10P_TI_LE_VIP);
    if (normalized.vip1 < 0 || normalized.vip2 < 0 || normalized.vip3 < 0) {
      throw new BadRequestError("Tỉ lệ không hợp lệ");
    }

    const result = await HeThong.findOneAndUpdate(
      { systemID: 1 },
      {
        $set: {
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip1": normalized.vip1,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip2": normalized.vip2,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeVip.vip3": normalized.vip3,
          "gameConfigs.xucXacConfigs.xucXac10P.tiLeCLTX": normalized.vip1,
        },
      },
      { new: false }
    ).lean();

    if (!result) {
      throw new BadRequestError("Không tìm thấy dữ liệu hệ thống");
    }

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SET_TI_LE_GAME,
      description: `Set tỉ lệ VIP game xucxac10P`,
      metadata: {
        tiLeBefore: result.gameConfigs?.xucXacConfigs?.xucXac10P?.tiLeVip,
        tiLeAfter: normalized,
      },
    });

    return new OkResponse({
      data: normalized,
      message: "Cập nhật tỉ lệ VIP thành công",
    }).send(res);
  });

  doiCuaDatCuoc = catchAsync(async (req, res) => {
    const { betId } = req.params;
    const datCuocIndex = Number(req.body?.datCuocIndex);
    if (!Number.isInteger(datCuocIndex) || datCuocIndex < 0) {
      throw new BadRequestError("datCuocIndex không hợp lệ");
    }

    const bet = await LichSuDatCuocXucXac10P.findById(betId);
    if (!bet) throw new NotFoundError("Không tìm thấy đơn cược");
    if (bet.tinhTrang !== STATUS_HISTORY_GAME.DANG_CHO) {
      throw new BadRequestError("Chỉ đổi cửa khi đơn cược đang chờ");
    }
    const door = bet.datCuoc?.[datCuocIndex];
    if (!door) throw new BadRequestError("Không tìm thấy cửa cược");
    if (door.trangThai !== STATUS_BET_GAME.DANG_CHO) {
      throw new BadRequestError("Chỉ đổi cửa khi cửa cược đang chờ");
    }

    const next = swapCuocDoi(door.chiTietCuoc);
    if (!next) throw new BadRequestError("Loại cược không đổi được");

    const before = door.chiTietCuoc;
    door.chiTietCuoc = next;
    await bet.save();

    this.CONFIG.METHOD.SEND_ROOM_ADMIN_XUCXAC({
      key: `${this.CONFIG.ROOM}:admin:refetch-data-lich-su-cuoc-game`,
      data: { phien: bet.phien },
    });

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan: req.user.taiKhoan,
      userId: req.user._id,
      typeActivity: TYPE_ACTIVITY.ADMIN,
      actionActivity: ACTION_ACTIVITY.ADMIN.SWAP_BET_CUOC,
      description: `Trượt cửa xucxac10p ${before}→${next}`,
      metadata: { betId, datCuocIndex, before, after: next, phien: bet.phien },
    });

    return new OkResponse({
      data: bet,
      message: `Đã đổi ${before} → ${next}`,
    }).send(res);
  });

  /**
   *
   * @returns {GameXucXac10PAdminController}
   */
  static getInstance = () => {
    if (!GameXucXac10PAdminController.instance) {
      GameXucXac10PAdminController.instance = new GameXucXac10PAdminController();
    }
    return GameXucXac10PAdminController.instance;
  };
}
module.exports = GameXucXac10PAdminController.getInstance();
