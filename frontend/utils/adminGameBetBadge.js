/** Số badge chưa xem cho 1 room (0 = ẩn). */
export const getUnreadGameBetCount = (alerts, seen, room) => {
  const alert = alerts?.[room];
  if (!alert || !alert.count) return 0;
  const s = seen?.[room];
  if (!s || String(s.phien) !== String(alert.phien)) return Number(alert.count) || 0;
  if (Number(s.count) >= Number(alert.count)) return 0;
  return Number(alert.count) || 0;
};

/** Tổng badge games trên sidebar. */
export const getTotalUnreadGameBets = (alerts, seen) => {
  if (!alerts || typeof alerts !== "object") return 0;
  return Object.keys(alerts).reduce((sum, room) => sum + getUnreadGameBetCount(alerts, seen, room), 0);
};
