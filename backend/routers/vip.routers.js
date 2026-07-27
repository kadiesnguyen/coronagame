const express = require("express");
const authController = require("../controllers/auth_controller");
const vipController = require("../controllers/vip.controller");

const router = express.Router();

router.route("/levels").get(authController.protect, vipController.getVipLevels);

module.exports = router;
