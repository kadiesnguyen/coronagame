const LichSuDatCuocKeno1P = require("../models/LichSuDatCuocKeno1P");
const LichSuDatCuocKeno3P = require("../models/LichSuDatCuocKeno3P");
const LichSuDatCuocKeno5P = require("../models/LichSuDatCuocKeno5P");
const LichSuDatCuocKeno10P = require("../models/LichSuDatCuocKeno10P");
const LichSuDatCuocXucXac1P = require("../models/LichSuDatCuocXucXac1P");
const LichSuDatCuocXucXac3P = require("../models/LichSuDatCuocXucXac3P");
const LichSuDatCuocXocDia1P = require("../models/LichSuDatCuocXocDia1P");
const LichSuDatCuocXoSo3P = require("../models/LichSuDatCuocXoSo3P");
const LichSuDatCuocXoSo5P = require("../models/LichSuDatCuocXoSo5P");
const LichSuDatCuocXoSoMB = require("../models/LichSuDatCuocXoSoMB");

const GAME_SOURCES = [
  { typeGame: "keno1p", gameName: "Keno 1P", model: LichSuDatCuocKeno1P, kind: "keno" },
  { typeGame: "keno3p", gameName: "Keno 3P", model: LichSuDatCuocKeno3P, kind: "keno" },
  { typeGame: "keno5p", gameName: "Keno 5P", model: LichSuDatCuocKeno5P, kind: "keno" },
  { typeGame: "keno10p", gameName: "Keno 10P", model: LichSuDatCuocKeno10P, kind: "keno" },
  { typeGame: "xucxac1p", gameName: "Xúc Xắc 1P", model: LichSuDatCuocXucXac1P, kind: "xucxac" },
  { typeGame: "xucxac3p", gameName: "Xúc Xắc 3P", model: LichSuDatCuocXucXac3P, kind: "xucxac" },
  { typeGame: "xocdia1p", gameName: "Xóc Đĩa 1P", model: LichSuDatCuocXocDia1P, kind: "xocdia" },
  { typeGame: "xoso3p", gameName: "Xổ Số 3P", model: LichSuDatCuocXoSo3P, kind: "xoso" },
  { typeGame: "xoso5p", gameName: "Xổ Số 5P", model: LichSuDatCuocXoSo5P, kind: "xoso" },
  { typeGame: "xosomb", gameName: "Xổ Số Miền Bắc", model: LichSuDatCuocXoSoMB, kind: "xoso" },
];

const KENO_CUOC_LABEL = { C: "Chẵn", L: "Lẻ", T: "Tài", X: "Xỉu" };

const formatKenoDetail = (bet) => `Bi số ${bet.loaiBi} chọn ${KENO_CUOC_LABEL[bet.loaiCuoc] || bet.loaiCuoc}`;

const formatGenericDetail = (bet) => {
  const parts = [];
  if (bet.loaiCuoc) parts.push(String(bet.loaiCuoc));
  if (bet.chiTietCuoc) {
    if (Array.isArray(bet.chiTietCuoc)) {
      const soList = bet.chiTietCuoc.map((x) => x?.so).filter(Boolean).join(", ");
      if (soList) parts.push(soList);
    } else {
      parts.push(String(bet.chiTietCuoc));
    }
  }
  return parts.join(" · ") || "Cược";
};

const flattenHistory = (doc, source) => {
  const phienSo = doc?.phien?.phien ?? doc?.phien?.phienId ?? "";
  const bets = Array.isArray(doc.datCuoc) ? doc.datCuoc : [];
  return bets.map((bet, idx) => {
    const tienCuoc = Number(bet.tienCuoc ?? bet.tongTienCuoc ?? 0);
    return {
      id: `${doc._id}-${idx}`,
      typeGame: source.typeGame,
      gameName: source.gameName,
      phien: phienSo,
      detail: source.kind === "keno" ? formatKenoDetail(bet) : formatGenericDetail(bet),
      tienCuoc,
      trangThai: bet.trangThai || doc.tinhTrang || "dangCho",
      createdAt: bet.createdAt || doc.createdAt,
    };
  });
};

/**
 * Merge bet history from all games for one user.
 * ponytail: fetch page*results from each collection then merge — ceiling O(games * page * results); upgrade with union cursor if scale needs it.
 */
const getLichSuThamGia = async ({ userId, page = 1, results = 20 }) => {
  const fetchLimit = Math.min(Math.max(page * results, results), 200);
  const lists = await Promise.all(
    GAME_SOURCES.map(async (source) => {
      const rows = await source.model
        .find({ nguoiDung: userId })
        .sort("-createdAt")
        .limit(fetchLimit)
        .populate("phien")
        .lean();
      return rows.flatMap((doc) => flattenHistory(doc, source));
    })
  );

  const merged = lists.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const start = (page - 1) * results;
  const data = merged.slice(start, start + results);

  return {
    data,
    metadata: {
      results: data.length,
      page,
      limitItems: results,
      sort: "-createdAt",
    },
  };
};

module.exports = { getLichSuThamGia };
