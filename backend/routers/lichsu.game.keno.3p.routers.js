const express = require("express");
const GameKeno3PController = require("../controllers/game.keno.3p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameKeno3PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameKeno3PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameKeno3PController.getAllLichSuGame);
module.exports = router;
