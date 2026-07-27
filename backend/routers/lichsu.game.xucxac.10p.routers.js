const express = require("express");
const GameXucXac10PController = require("../controllers/game.xucxac.10p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXucXac10PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXucXac10PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXucXac10PController.getAllLichSuGame);
module.exports = router;
