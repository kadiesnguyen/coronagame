import { NumericFormat } from "react-number-format";

const convertMoney = (num, digits = 3) => {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};
export default convertMoney;

export const convertJSXMoney = (money = 0) => {
  return (
    <>
      <NumericFormat value={money} displayType="text" allowLeadingZeros thousandSeparator="," />đ
    </>
  );
};

/** Admin stats compact: K / M / B — không dùng cho UI user. */
export const formatCompactMoney = (money = 0) => {
  const v = Number(money) || 0;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  const trim = (n) =>
    n
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
  if (abs >= 1e9) return `${sign}${trim(abs / 1e9)}B`;
  if (abs >= 1e6) return `${sign}${trim(abs / 1e6)}M`;
  if (abs >= 1e3) return `${sign}${trim(abs / 1e3)}K`;
  return `${sign}${Math.round(abs).toLocaleString("vi-VN")}`;
};

export const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};
