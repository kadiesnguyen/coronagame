const express = require("express");
const GameKeno10PController = require("../controllers/game.keno.10p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameKeno10PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameKeno10PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameKeno10PController.getAllLichSuGame);
module.exports = router;
