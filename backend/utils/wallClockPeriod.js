/** Skip starting a session if fewer seconds left than this (settle/quay needs room). */
const MIN_PLAYABLE_SECONDS = 8;

/**
 * Align game period to wall clock (server local TZ, prod = Asia/Ho_Chi_Minh).
 * TIMER 60 → mỗi phút; 180 → :00/:03/:06…; 300 → :00/:05…; 600 → :00/:10/:20…
 *
 * @param {number} timerSeconds period length (60|180|300|600)
 * @param {Date} [now]
 * @returns {{ remainSeconds: number, periodEnd: Date, periodStart: Date }}
 */
function getWallClockRemain(timerSeconds, now = new Date()) {
  const period = Number(timerSeconds);
  if (!Number.isFinite(period) || period <= 0) {
    throw new Error(`timerSeconds không hợp lệ: ${timerSeconds}`);
  }

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const elapsed = Math.floor((now.getTime() - startOfDay.getTime()) / 1000);
  const intoPeriod = elapsed % period;
  // Đúng mốc (:00, :10…) → phiên mới đủ TIMER; giữa kỳ → còn lại đến mốc kế.
  const remainSeconds = intoPeriod === 0 ? period : period - intoPeriod;
  const periodStart = new Date(startOfDay.getTime() + (elapsed - intoPeriod) * 1000);
  const periodEnd = new Date(periodStart.getTime() + period * 1000);

  return { remainSeconds, periodEnd, periodStart };
}

function sleepMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * If too little time left in this wall slot, wait until the next boundary.
 * @returns {Promise<{ remainSeconds: number, periodEnd: Date, periodStart: Date }>}
 */
async function waitForPlayableWallSlot(timerSeconds, minPlayable = MIN_PLAYABLE_SECONDS) {
  let slot = getWallClockRemain(timerSeconds);
  if (slot.remainSeconds >= minPlayable) return slot;

  const waitMs = slot.periodEnd.getTime() - Date.now();
  if (waitMs > 0) await sleepMs(waitMs);
  return getWallClockRemain(timerSeconds);
}

module.exports = {
  getWallClockRemain,
  waitForPlayableWallSlot,
  MIN_PLAYABLE_SECONDS,
  sleepMs,
};

// ponytail: assert wall alignment when run directly
if (require.main === module) {
  const assert = require("assert");
  // local Date(y, m0, d, h, min, s)
  assert.strictEqual(getWallClockRemain(600, new Date(2026, 7, 3, 9, 50, 0)).remainSeconds, 600);
  assert.strictEqual(getWallClockRemain(600, new Date(2026, 7, 3, 9, 59, 0)).remainSeconds, 60);
  assert.strictEqual(getWallClockRemain(600, new Date(2026, 7, 3, 9, 39, 0)).remainSeconds, 60);
  assert.strictEqual(getWallClockRemain(60, new Date(2026, 7, 3, 9, 39, 30)).remainSeconds, 30);
  // 3p mốc :00/:03/…/:36/:39 — 9:37 còn 120s tới 9:39
  assert.strictEqual(getWallClockRemain(180, new Date(2026, 7, 3, 9, 37, 0)).remainSeconds, 120);
  // 5p mốc :00/:05/…/:35/:40 — 9:37 còn 180s tới 9:40
  assert.strictEqual(getWallClockRemain(300, new Date(2026, 7, 3, 9, 37, 0)).remainSeconds, 180);
  console.log("wallClockPeriod ok");
}
