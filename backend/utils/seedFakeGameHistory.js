"use strict";

const GameKeno10P = require("../models/GameKeno10P");
const GameXucXac5P = require("../models/GameXucXac5P");
const GameXucXac10P = require("../models/GameXucXac10P");
const { STATUS_GAME: STATUS_XUCXAC } = require("../configs/game.xucxac");
const { STATUS_GAME: STATUS_KENO } = require("../configs/game.keno");
const getRandomArbitrary = require("./randomRangeNumber");

const TARGET_HISTORY = 100;

const randXucXacKetQua = () => [
  getRandomArbitrary(1, 6),
  getRandomArbitrary(1, 6),
  getRandomArbitrary(1, 6),
];

const randKenoKetQua = () => [
  getRandomArbitrary(0, 9),
  getRandomArbitrary(0, 9),
  getRandomArbitrary(0, 9),
  getRandomArbitrary(0, 9),
  getRandomArbitrary(0, 9),
];

/**
 * Đảm bảo ~100 phiên hoanTat ảo cho game mới clone (khi đang trống / ít lịch sử).
 * Đẩy phiên thật lên cao rồi chèn phien 1..N phía trước — không đụng phiên đang chạy sau restart.
 */
const seedOneGame = async (Model, { label, intervalMs, randomKetQua, statusHoanTat }) => {
  const completed = await Model.countDocuments({ tinhTrang: statusHoanTat });
  if (completed >= TARGET_HISTORY) {
    console.log(`[seedFakeHistory] ${label}: đã có ${completed} phiên, bỏ qua`);
    return { label, skipped: true, completed };
  }

  const existing = await Model.find().sort({ phien: -1 }).select("_id phien").lean();
  const shift = TARGET_HISTORY;

  for (const doc of existing) {
    await Model.updateOne({ _id: doc._id }, { $inc: { phien: shift } });
  }

  const now = Date.now();
  const docs = [];
  for (let i = 1; i <= TARGET_HISTORY; i++) {
    const createdAt = new Date(now - (TARGET_HISTORY - i + 1) * intervalMs);
    docs.push({
      phien: i,
      ketQua: randomKetQua(),
      tinhTrang: statusHoanTat,
      createdAt,
      updatedAt: createdAt,
    });
  }
  await Model.insertMany(docs);
  console.log(`[seedFakeHistory] ${label}: +${TARGET_HISTORY} phiên ảo (shifted ${existing.length})`);
  return { label, skipped: false, seeded: TARGET_HISTORY, shifted: existing.length };
};

const seedFakeGameHistory = async () => {
  const results = [];
  try {
    results.push(
      await seedOneGame(GameXucXac5P, {
        label: "xucxac5p",
        intervalMs: 300 * 1000,
        randomKetQua: randXucXacKetQua,
        statusHoanTat: STATUS_XUCXAC.HOAN_TAT,
      })
    );
    results.push(
      await seedOneGame(GameXucXac10P, {
        label: "xucxac10p",
        intervalMs: 600 * 1000,
        randomKetQua: randXucXacKetQua,
        statusHoanTat: STATUS_XUCXAC.HOAN_TAT,
      })
    );
    results.push(
      await seedOneGame(GameKeno10P, {
        label: "keno10p",
        intervalMs: 600 * 1000,
        randomKetQua: randKenoKetQua,
        statusHoanTat: STATUS_KENO.HOAN_TAT,
      })
    );
  } catch (err) {
    console.log("[seedFakeHistory] lỗi:", err?.message || err);
  }
  return results;
};

module.exports = {
  seedFakeGameHistory,
  TARGET_HISTORY,
};
