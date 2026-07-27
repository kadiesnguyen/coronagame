const express = require("express");
const GameXucXac5PController = require("../controllers/game.xucxac.5p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/lich-su-cuoc/:phien").get(authController.protect, GameXucXac5PController.getLichSuCuocGameChiTiet);
router.route("/lich-su-cuoc").get(authController.protect, GameXucXac5PController.getAllLichSuCuocGame);
router.route("/").get(authController.protect, GameXucXac5PController.getAllLichSuGame);
module.exports = router;
