const express = require("express");
const GameKeno1PController = require("../controllers/game.keno.1p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameKeno1PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameKeno1PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameKeno1PController.getAllLichSuGame);
module.exports = router;
