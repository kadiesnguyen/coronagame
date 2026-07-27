const express = require("express");
const GameXucXac1PController = require("../controllers/game.xucxac.1p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXucXac1PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXucXac1PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXucXac1PController.getAllLichSuGame);
module.exports = router;
