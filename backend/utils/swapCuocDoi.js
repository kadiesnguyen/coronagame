/**
 * Trượt dọc trên lưới 2x2 (Tài|Xỉu / Lẻ|Chẵn):
 *   T↔L, X↔C — bấm từng dòng cửa.
 */
const SWAP_MAP = Object.freeze({
  T: "L",
  L: "T",
  X: "C",
  C: "X",
});

function swapCuocDoi(code) {
  return SWAP_MAP[code] || null;
}

module.exports = { swapCuocDoi, SWAP_MAP };

// ponytail: assert vertical slip when run directly
if (require.main === module) {
  const assert = require("assert");
  assert.strictEqual(swapCuocDoi("X"), "C");
  assert.strictEqual(swapCuocDoi("T"), "L");
  assert.strictEqual(swapCuocDoi("C"), "X");
  assert.strictEqual(swapCuocDoi("L"), "T");
  console.log("swapCuocDoi ok");
}
