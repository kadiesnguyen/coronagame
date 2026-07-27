const express = require("express");
const LienKetNganHangController = require("../controllers/lienketnganhang.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/").get(authController.protect, LienKetNganHangController.getDanhSach);
router.route("/").post(authController.protect, LienKetNganHangController.createNganHang);

module.exports = router;
