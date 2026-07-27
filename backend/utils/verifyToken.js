const { UnauthorizedError, BadRequestError } = require("./app_error");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../configs/jwt.config");
const { USER_STATUS } = require("../configs/user.config");
const NguoiDung = require("../models/NguoiDung");

const verifyToken = async (token) => {
  if (!token) {
    throw new UnauthorizedError("Vui lòng đăng nhập");
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET_KEY);
    const user = await NguoiDung.findOne({ _id: decode.id, status: USER_STATUS.ACTIVE });
    if (!user) {
      throw new UnauthorizedError("Vui lòng đăng nhập");
    }
    return user;
  } catch (err) {
    throw new BadRequestError("Token không hợp lệ");
  }
};
module.exports = {
  verifyToken,
};
