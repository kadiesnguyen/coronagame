const BienDongSoDu = require("../models/BienDongSoDu");
const catchAsync = require("../utils/catch_async");
const { OkResponse } = require("../utils/successResponse");

class BienDongSoDuController {
  static getBienDongSoDu = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const { _id: userId } = req.user;
    const list = await BienDongSoDu.find({ nguoiDung: userId }).skip(skip).limit(results).sort(sortValue).lean();
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
}

module.exports = BienDongSoDuController;
