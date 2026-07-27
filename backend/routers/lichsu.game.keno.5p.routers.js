const express = require("express");
const GameKeno5PController = require("../controllers/game.keno.5p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameKeno5PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameKeno5PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameKeno5PController.getAllLichSuGame);
module.exports = router;
