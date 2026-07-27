"use strict";

const getTimeStamp = () => new Date().toISOString();

class LoggingService {
  static info = (namespace, message, object) => {
    console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object ?? "");
  };
  static warn = (namespace, message, object) => {
    console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object ?? "");
  };
  static error = (namespace, message, object) => {
    console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object ?? "");
  };
  static debug = (namespace, message, object) => {
    console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object ?? "");
  };
}

module.exports = LoggingService;
