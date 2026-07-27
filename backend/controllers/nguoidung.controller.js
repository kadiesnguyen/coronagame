const NguoiDung = require("../models/NguoiDung");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFoundError, UnauthorizedError, BadRequestError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");
const { selectFields, unSelectFields } = require("../utils/selectFieldsObject");
const ms = require("ms");
const { signToken } = require("../utils/signToken");
const { JWT_SECRET_KEY } = require("../configs/jwt.config");

const TelegramService = require("../services/telegram.service");
const { TYPE_SEND_MESSAGE } = require("../configs/telegram.config");
const { convertMoney } = require("../utils/convertMoney");
const AdminSocketService = require("../services/admin.socket.service");
const LoggingService = require("../services/logging.service");
const NhatKyHoatDong = require("../models/NhatKyHoatDong");
const { TYPE_ACTIVITY, ACTION_ACTIVITY } = require("../configs/activity.config");

const NAMESPACE = "NguoiDung";

class NguoiDungController {
  static thongBaoNapTienTelegram = catchAsync(async (req, res, next) => {
    const { taiKhoan, _id } = req.user;
    const { soTien, bank } = req.body;
    // Send notification Telegram
    const noiDungBot = `${taiKhoan} vừa gửi yêu cầu nạp tiền với số tiền ${convertMoney(soTien)} vào ngân hàng: ${bank}`;
    TelegramService.sendNotification({ content: noiDungBot, type: TYPE_SEND_MESSAGE.DEPOSIT });

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan,
      userId: _id,
      typeActivity: TYPE_ACTIVITY.DEPOSIT,
      actionActivity: ACTION_ACTIVITY.DEPOSIT.CREATE_ORDER,
      description: `Tạo lệnh nạp tiền: ${convertMoney(soTien)} vào ngân hàng: ${bank}`,
      metadata: { soTien, bank },
    });

    return new OkResponse({
      message: "Ok",
    }).send(res);
  });
  static getDetailedUser = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const user = await NguoiDung.findOne({ taiKhoan }).select("-matKhau -__v -refreshToken -refreshTokenUsed").lean();
    if (!user) {
      throw new NotFoundError(`Không tồn tại tài khoản: ${taiKhoan}`);
    }

    return new OkResponse({
      data: user,
    }).send(res);
  });
  static refreshToken = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    try {
      const checkRefreshTokenValid = await NguoiDung.findOne({ refreshToken: { $in: refreshToken }, taiKhoan });
      if (!checkRefreshTokenValid) {
        return next(new BadRequestError("Refresh token không tồn tại"));
      }
      const decodeRefreshToken = jwt.verify(refreshToken, JWT_SECRET_KEY);

      // Tạo mới token

      const newToken = signToken({
        taiKhoan: checkRefreshTokenValid.taiKhoan,
        role: checkRefreshTokenValid.role,
        id: checkRefreshTokenValid._id,
      });
      // Update database
      await Promise.all([
        NguoiDung.findOneAndUpdate(
          { taiKhoan },
          {
            $pull: { refreshToken: refreshToken },
          }
        ),
        NguoiDung.findOneAndUpdate(
          { taiKhoan },
          {
            $push: { refreshTokenUsed: refreshToken, refreshToken: newToken.refreshToken },
          }
        ),
      ]);

      await NhatKyHoatDong.insertNhatKyHoatDong({
        taiKhoan,
        userId: checkRefreshTokenValid._id,
        typeActivity: TYPE_ACTIVITY.AUTH,
        actionActivity: ACTION_ACTIVITY.AUTH.REFRESH_TOKEN,
        description: `Refresh token tài khoản`,
        metadata: {
          refreshToken,
        },
      });
      return new OkResponse({
        data: newToken,
      }).send(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Refresh token đã hết hạn hoặc không tồn tại!");
    }
  });

  static createUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau, nhapLaiMatKhau } = req.body;
    if (!taiKhoan || !matKhau || !nhapLaiMatKhau) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const checkUserExist = await NguoiDung.findOne({
      taiKhoan,
    });
    if (checkUserExist) {
      throw new BadRequestError("Nguời dùng đã tồn tại");
    }
    const result = await NguoiDung.create({
      taiKhoan,
      matKhau,
      nhapLaiMatKhau,
    });
    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan,
      userId: result._id,
      typeActivity: TYPE_ACTIVITY.AUTH,
      actionActivity: ACTION_ACTIVITY.AUTH.SIGN_UP,
      description: `Đăng ký lần đầu`,
    });

    // Send event refetch users dashboard
    AdminSocketService.sendRoomAdmin({ key: "admin:refetch-data-users-dashboard" });

    return new CreatedResponse({
      message: "Đăng ký tài khoản thành công. Đang tiến hành đăng nhập",
    }).send(res);
  });

  static signInUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau } = req.body;

    if (!taiKhoan || !matKhau) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }

    const user = await NguoiDung.findOne({
      taiKhoan,
    }).lean();
    if (!user) {
      throw new BadRequestError("Nguời dùng không tồn tại");
    }
    const authPassword = await bcrypt.compare(matKhau, user.matKhau);
    if (!authPassword) {
      throw new BadRequestError("Mật khẩu không chính xác");
    }
    // Sign token

    const { accessToken, refreshToken, expireAccessToken } = signToken({
      taiKhoan: user.taiKhoan,
      role: user.role,
      id: user._id,
    });

    // Update refresh token DB
    await NguoiDung.findOneAndUpdate(
      {
        taiKhoan,
      },
      {
        $push: { refreshToken: refreshToken },
      }
    );

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan,
      userId: user._id,
      typeActivity: TYPE_ACTIVITY.AUTH,
      actionActivity: ACTION_ACTIVITY.AUTH.LOGIN,
      description: `Đăng nhập vào tài khoản`,
    });
    return new OkResponse({
      data: {
        data: unSelectFields({ fields: ["matKhau", "__v", "refreshToken", "refreshTokenUsed"], object: user }),
        accessToken,
        refreshToken,
        expireAccessToken,
      },
      message: "Đăng nhập thành công",
    }).send(res);
  });

  static changePassword = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau, _id } = req.user;
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || !currentPassword) {
      throw new BadRequestError("Vui lòng nhập đầy đủ dữ liệu");
    }
    if (newPassword === currentPassword) {
      throw new BadRequestError("Mật khẩu mới không được trùng với mật khẩu hiện tại");
    }

    const authPassword = await bcrypt.compare(currentPassword, matKhau);
    if (!authPassword) {
      throw new BadRequestError("Mật khẩu hiện tại không chính xác");
    }

    // Update user
    await NguoiDung.findByTaiKhoanAndUpdatePassword({
      taiKhoan,
      newPassword,
    });

    await NhatKyHoatDong.insertNhatKyHoatDong({
      taiKhoan,
      userId: _id,
      typeActivity: TYPE_ACTIVITY.AUTH,
      actionActivity: ACTION_ACTIVITY.AUTH.UPDATE_PASSWORD,
      description: `Cập nhật mật khẩu`,
    });

    return new OkResponse({
      message: "Đổi mật khẩu thành công",
    }).send(res);
  });

  static signOutUser = catchAsync(async (req, res, next) => {
    const { refreshToken, taiKhoan } = req.body;

    const user = await NguoiDung.findOneAndUpdate(
      {
        taiKhoan,
        refreshToken: {
          $elemMatch: {
            $eq: refreshToken,
          },
        },
      },
      {
        $pull: {
          refreshToken: refreshToken,
        },
      }
    );
    if (user) {
      await NhatKyHoatDong.insertNhatKyHoatDong({
        taiKhoan: user.taiKhoan,
        userId: user._id,
        typeActivity: TYPE_ACTIVITY.AUTH,
        actionActivity: ACTION_ACTIVITY.AUTH.SIGN_OUT,
        description: `Đăng xuất tài khoản`,
        metadata: {
          refreshToken,
        },
      });
    }

    return new OkResponse({
      message: "Đăng xuất thành công",
    }).send(res);
  });
}

module.exports = NguoiDungController;
