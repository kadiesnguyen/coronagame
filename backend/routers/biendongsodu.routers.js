const express = require("express");
const BienDongSoDuController = require("../controllers/biendongsodu.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/").get(authController.protect, BienDongSoDuController.getBienDongSoDu);

module.exports = router;
