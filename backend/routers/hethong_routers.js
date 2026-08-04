const express = require("express");
const heThongController = require("../controllers/hethong_controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/ngan-hang").get(authController.protect, heThongController.getNganHang);
// Public: widget CSKH (SaleSmartly) cần load cả khi chưa đăng nhập
router.route("/tawk-to").get(heThongController.getConfigTawk);
router.route("/branding").get(heThongController.getBranding);

module.exports = router;
