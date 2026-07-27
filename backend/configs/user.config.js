const MIN_LENGTH_PASSWORD = 6;
const MIN_LENGTH_ACCOUNT = 6;
const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
};
const USER_STATUS = {
  ACTIVE: true,
  IN_ACTIVE: false,
};

module.exports = {
  USER_ROLE,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_ACCOUNT,
  USER_STATUS,
};
