/**
 * Sync shared draft bet amount onto pending rows while typing / picking chips.
 * Updates rows still at 0 or still equal to the previous draft so "1"→"10"→…→"100000000"
 * does not stick at 1đ. Leaves additive re-clicks alone (tienCuoc !== prevDraft).
 *
 * Check: `node utils/syncPendingBetAmount.js`
 */
function syncPendingBetAmount(prevBets, prevDraftAmount, nextAmount) {
  if (nextAmount === "" || nextAmount == null || !(Number(nextAmount) > 0)) {
    return prevBets;
  }
  const amount = Number(nextAmount);
  let changed = false;
  const next = prevBets.map((b) => {
    if (b.tienCuoc === 0 || b.tienCuoc === prevDraftAmount) {
      if (b.tienCuoc !== amount) changed = true;
      return { ...b, tienCuoc: amount };
    }
    return b;
  });
  return changed ? next : prevBets;
}

module.exports = { syncPendingBetAmount };

if (require.main === module) {
  const assert = require("assert");
  let bets = [
    { loaiCuoc: "T", tienCuoc: 0 },
    { loaiCuoc: "X", tienCuoc: 0 },
  ];
  let draft = 0;
  for (const n of [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]) {
    bets = syncPendingBetAmount(bets, draft, n);
    draft = n;
  }
  assert.strictEqual(bets[0].tienCuoc, 100000000);
  assert.strictEqual(bets[1].tienCuoc, 100000000);
  assert.strictEqual(syncPendingBetAmount([{ tienCuoc: 2000 }], 1000, 5000)[0].tienCuoc, 2000);
  assert.strictEqual(syncPendingBetAmount([{ tienCuoc: 1000 }], 1000, 5000)[0].tienCuoc, 5000);
  console.log("syncPendingBetAmount: ok");
}
