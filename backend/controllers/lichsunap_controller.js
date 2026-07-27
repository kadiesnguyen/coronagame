const NguoiDung = require("../models/NguoiDung");
const LichSuNap = require("../models/LichSuNap");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
var numeral = require("numeral");
const { OkResponse } = require("../utils/successResponse");

exports.getLichSuNap = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const results = req.query.results * 1 || 10;
  const skip = (page - 1) * results;
  let sortValue = ["-createdAt"];
  sortValue = sortValue.join(" ");
  const { _id } = req.user;

  const list = await LichSuNap.find({ nguoiDung: _id }).skip(skip).limit(results).sort(sortValue).lean();
  return new OkResponse({
    data: list,
    metadata: {
      results: list.length,
      page,
      limitItems: results,
      sort: sortValue,
    },
  }).send(res);
});
