const NguoiDung = require("../models/NguoiDung");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catch_async");
const { UnauthorizedError, BadRequestError } = require("../utils/app_error");
const { JWT_SECRET_KEY } = require("../configs/jwt.config");
const { USER_STATUS } = require("../configs/user.config");
const { verifyToken } = require("../utils/verifyToken");

//PROTECT//
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new UnauthorizedError("Vui lòng đăng nhập");
  }
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    throw new BadRequestError("Token không hợp lệ");
  }
});

//PERMISSION//
exports.reStrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError("Không có quyền truy cập"));
    }
    next();
  };
};
