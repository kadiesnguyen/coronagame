"use strict";

const DEFAULT_VIP_LEVELS = {
  vip1: { minMoney: 0, maxMoney: 100000000 },
  vip2: { minMoney: 100000000, maxMoney: 1000000000 },
  vip3: { minMoney: 1000000000, maxMoney: null },
};

const resolveVipLevel = (money, vipLevels = DEFAULT_VIP_LEVELS) => {
  const balance = Number(money) || 0;
  for (let level = 1; level <= 3; level += 1) {
    const cfg = vipLevels[`vip${level}`];
    if (!cfg) continue;
    const min = Number(cfg.minMoney) ?? 0;
    const max = cfg.maxMoney === null || cfg.maxMoney === undefined ? Infinity : Number(cfg.maxMoney);
    if (balance >= min && balance < max) {
      return level;
    }
  }
  return null;
};

const normalizeVipLevels = (vipLevels) => {
  const source = vipLevels ?? DEFAULT_VIP_LEVELS;
  return {
    vip1: {
      minMoney: Number(source.vip1?.minMoney ?? DEFAULT_VIP_LEVELS.vip1.minMoney),
      maxMoney: Number(source.vip1?.maxMoney ?? DEFAULT_VIP_LEVELS.vip1.maxMoney),
    },
    vip2: {
      minMoney: Number(source.vip2?.minMoney ?? DEFAULT_VIP_LEVELS.vip2.minMoney),
      maxMoney: Number(source.vip2?.maxMoney ?? DEFAULT_VIP_LEVELS.vip2.maxMoney),
    },
    vip3: {
      minMoney: Number(source.vip3?.minMoney ?? DEFAULT_VIP_LEVELS.vip3.minMoney),
      maxMoney: source.vip3?.maxMoney === null || source.vip3?.maxMoney === undefined ? null : Number(source.vip3.maxMoney),
    },
  };
};

module.exports = {
  DEFAULT_VIP_LEVELS,
  resolveVipLevel,
  normalizeVipLevels,
};
