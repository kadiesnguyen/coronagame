/**
 * Merge cược đã xác nhận (server) + cược pending trên bàn (additive).
 * Bàn cược không auto-fill từ lịch sử; submit phải merge để không ghi đè mất cược cũ.
 */

export function mergeKenoBets(confirmed = [], pending = []) {
  const map = new Map();
  for (const b of confirmed || []) {
    if (b?.loaiBi == null || b?.loaiCuoc == null) continue;
    const k = `${b.loaiBi}:${b.loaiCuoc}`;
    map.set(k, {
      loaiBi: b.loaiBi,
      loaiCuoc: b.loaiCuoc,
      tienCuoc: Number(b.tienCuoc) || 0,
    });
  }
  for (const b of pending || []) {
    if (b?.loaiBi == null || b?.loaiCuoc == null) continue;
    const k = `${b.loaiBi}:${b.loaiCuoc}`;
    const add = Number(b.tienCuoc) || 0;
    const prev = map.get(k);
    if (prev) map.set(k, { ...prev, tienCuoc: prev.tienCuoc + add });
    else map.set(k, { loaiBi: b.loaiBi, loaiCuoc: b.loaiCuoc, tienCuoc: add });
  }
  return [...map.values()].filter((b) => b.tienCuoc > 0);
}

export function mergeCltxBets(confirmed = [], pending = []) {
  const map = new Map();
  for (const b of confirmed || []) {
    if (b?.loaiCuoc == null || b?.chiTietCuoc == null) continue;
    const k = `${b.loaiCuoc}:${b.chiTietCuoc}`;
    map.set(k, {
      loaiCuoc: b.loaiCuoc,
      chiTietCuoc: b.chiTietCuoc,
      tienCuoc: Number(b.tienCuoc) || 0,
    });
  }
  for (const b of pending || []) {
    if (b?.loaiCuoc == null || b?.chiTietCuoc == null) continue;
    const k = `${b.loaiCuoc}:${b.chiTietCuoc}`;
    const add = Number(b.tienCuoc) || 0;
    const prev = map.get(k);
    if (prev) map.set(k, { ...prev, tienCuoc: prev.tienCuoc + add });
    else map.set(k, { loaiCuoc: b.loaiCuoc, chiTietCuoc: b.chiTietCuoc, tienCuoc: add });
  }
  return [...map.values()].filter((b) => b.tienCuoc > 0);
}
