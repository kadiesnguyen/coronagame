const express = require("express");
const GameXoSo5PController = require("../controllers/game.xoso.5p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXoSo5PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXoSo5PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXoSo5PController.getAllLichSuGame);
module.exports = router;
