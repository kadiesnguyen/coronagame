const express = require("express");
const GameXoSoMBController = require("../controllers/game.xoso.mb.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXoSoMBController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXoSoMBController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXoSoMBController.getAllLichSuGame);
module.exports = router;
