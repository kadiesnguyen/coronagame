const dayjs = require("dayjs");

class BroadcastLogger {
  constructor() {
    this.logs = [];
    this.MAX_LOGS = 1000; // Giới hạn số lượng log lưu trữ
  }

  logBroadcast(eventType, data, phien) {
    const logEntry = {
      timestamp: dayjs().valueOf(),
      eventType,
      phien,
      data,
    };

    // Thêm log mới
    this.logs.push(logEntry);

    // Giữ số lượng log trong giới hạn
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift(); // Xóa log cũ nhất
    }

    // console.log(`[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Broadcast: ${eventType}`, phien ? `Phien: ${phien}` : "", data);

    return logEntry;
  }

  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.phien) {
      filteredLogs = filteredLogs.filter((log) => log.phien === filters.phien);
    }

    if (filters.eventType) {
      filteredLogs = filteredLogs.filter((log) => log.eventType === filters.eventType);
    }

    if (filters.timeRange) {
      const { start, end } = filters.timeRange;
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= start && log.timestamp <= end);
    }

    return filteredLogs.reverse();
  }
}

// Tạo middleware cho Socket.IO
const createBroadcastMiddleware = () => {
  const logger = new BroadcastLogger();

  return {
    broadcastGameUpdateForUser: (socketMethod) => (eventType, data) => {
      logger.logBroadcast(eventType, data, data?.phien);
      socketMethod({ key: eventType, data });
    },

    broadcastGameUpdateForAdmin: (socketMethod) => (eventType, data) => {
      logger.logBroadcast(eventType, data, data?.phien);
      socketMethod({ key: eventType, data });
    },

    // Getter cho logs
    getLogs: logger.getLogs.bind(logger),
  };
};

module.exports = {
  createBroadcastMiddleware,
};
