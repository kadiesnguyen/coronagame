const STATUSCODE = {
  OK: 200,
  CREATED: 201,
};
const STATUS_REASON = {
  OK: "success",
  CREATED: "created",
};
class SuccessResponse {
  constructor({ message = "success", statusCode = STATUSCODE.OK, status = STATUS_REASON.OK, data = null, metadata = {} }) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = status;
    this.data = data;
    this.metadata = metadata;
  }
  send = (res) => {
    return res.status(this.statusCode).json(this);
  };
}
class OkResponse extends SuccessResponse {
  constructor({ message, data, metadata }) {
    super({ message, statusCode: STATUSCODE.OK, status: STATUS_REASON.OK, data, metadata });
  }
}
class CreatedResponse extends SuccessResponse {
  constructor({ message, data, metadata }) {
    super({ message, statusCode: STATUSCODE.CREATED, status: STATUS_REASON.CREATED, data, metadata });
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
};
