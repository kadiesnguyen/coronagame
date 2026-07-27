const jwt = require("jsonwebtoken");
const ms = require("ms");
const { JWT_SECRET_KEY, JWT_ACCESSTOKEN_EXPIRED, JWT_REFRESHTOKEN_EXPIRED } = require("../configs/jwt.config");

const signToken = ({ taiKhoan, role, id }) => {
  const generateAccessToken = jwt.sign({ taiKhoan, role, id }, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESSTOKEN_EXPIRED,
  });
  const generateRefreshToken = jwt.sign({ taiKhoan, role, id }, JWT_SECRET_KEY, {
    expiresIn: JWT_REFRESHTOKEN_EXPIRED,
  });
  const expireAccessToken = Math.round(Date.now() + ms(JWT_ACCESSTOKEN_EXPIRED));

  return {
    accessToken: generateAccessToken,
    refreshToken: generateRefreshToken,
    expireAccessToken,
  };
};

module.exports = {
  signToken,
};
