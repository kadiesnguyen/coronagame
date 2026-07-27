const ThongBao = require("../models/ThongBao");
const { NotFoundError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");

class ThongBaoController {
  static getDanhSach = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");

    const list = await ThongBao.find({}).skip(skip).limit(results).sort(sortValue).lean();
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

  static getChiTietThongBao = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await ThongBao.findOne({ _id: id }).lean();
    if (!result) {
      throw new NotFoundError("Không tìm thấy thông báo");
    }
    return new OkResponse({
      data: result,
    }).send(res);
  });
}
module.exports = ThongBaoController;
