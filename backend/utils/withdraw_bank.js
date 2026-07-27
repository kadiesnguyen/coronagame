const LienKetNganHang = require("../models/LienKetNganHang");

const isSnapshotBank = (nganHang) =>
  !!(nganHang && typeof nganHang === "object" && (nganHang.tenNganHang || nganHang.soTaiKhoan));

/** Chuẩn hoá nganHang trên lệnh rút: snapshot mới hoặc ObjectId cũ → object hiển thị. */
const normalizeWithdrawBank = async (item) => {
  if (!item) return item;
  if (isSnapshotBank(item.nganHang)) return item;
  if (!item.nganHang) return item;
  try {
    const bank = await LienKetNganHang.findById(item.nganHang).lean();
    if (bank) {
      item.nganHang = {
        tenNganHang: bank.tenNganHang || "",
        tenChuTaiKhoan: bank.tenChuTaiKhoan || "",
        soTaiKhoan: bank.soTaiKhoan || "",
        bankCode: bank.bankCode || "",
      };
    }
  } catch (_err) {
    // ignore
  }
  return item;
};

const normalizeWithdrawBankList = async (list) => {
  if (!Array.isArray(list)) return list;
  return Promise.all(list.map((item) => normalizeWithdrawBank(item)));
};

module.exports = {
  isSnapshotBank,
  normalizeWithdrawBank,
  normalizeWithdrawBankList,
};
