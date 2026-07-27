const express = require("express");
const authController = require("../controllers/auth_controller");
const NapTienController = require("../controllers/naptien.controller");
const router = express.Router();

router.route("/").get(authController.protect, NapTienController.getDanhSach);
router.route("/").post(authController.protect, NapTienController.createNapTien);

module.exports = router;
