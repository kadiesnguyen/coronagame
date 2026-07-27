const express = require("express");
const GameXoSo3PController = require("../controllers/game.xoso.3p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXoSo3PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXoSo3PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXoSo3PController.getAllLichSuGame);
module.exports = router;
