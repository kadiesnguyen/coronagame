const TelegramService = require("../services/telegram.service");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/app_error");

const handleCastErrorDB = (err) => {
  const message = `Giá trị không hợp lệ ${err.path}: ${err.value}.`;
  return new UnauthorizedError(message);
};

const handleTransactionErrorDB = (err) => {
  const message = `Có lỗi trong quá trình xử lý, vui lòng thử lại`;
  return new BadRequestError(message);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Giá trị ${value} đã tồn tại. Vui lòng thử lại!`;
  return new UnauthorizedError(message);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join(". ")}`;
  return new UnauthorizedError(message);
};

const handleMulterError = (err) => {
  const message = err.message;
  return new BadRequestError(message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // let error = JSON.parse(JSON.stringify(err));
    let error = err;
    if (error.code === 112) {
      error = handleTransactionErrorDB(error);
    }
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    if (error.name === "MulterError") {
      error = handleMulterError(error);
    }
    TelegramService.sendNotification({ content: `Lỗi từ server!!: ${err?.message} - ${err?.stack}` });
    console.log(err);

    sendErrorProd(error, res);
  }
};
