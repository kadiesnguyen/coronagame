const express = require("express");
const ThongBaoController = require("../controllers/thongbao.controller");
const router = express.Router();

router.route("/:id").get(ThongBaoController.getChiTietThongBao);
router.route("/").get(ThongBaoController.getDanhSach);

module.exports = router;
