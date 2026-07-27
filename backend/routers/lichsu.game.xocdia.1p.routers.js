const express = require("express");
const GameXocDia1PController = require("../controllers/game.xocdia.1p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXocDia1PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXocDia1PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXocDia1PController.getAllLichSuGame);
module.exports = router;
