const express = require("express");
const GameXucXac3PController = require("../controllers/game.xucxac.3p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXucXac3PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXucXac3PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXucXac3PController.getAllLichSuGame);
module.exports = router;
