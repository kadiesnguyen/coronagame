var numeral = require("numeral");

const convertMoney = (money = 0) => {
  return `${numeral(money).format("0,0")}đ`;
};
module.exports = { convertMoney };
