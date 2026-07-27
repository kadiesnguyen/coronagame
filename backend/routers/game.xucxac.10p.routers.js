const express = require("express");
const GameXucXac10PController = require("../controllers/game.xucxac.10p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.10p.routers"));
router.route("/ti-le").get(authController.protect, GameXucXac10PController.getTiLeGame);
router.route("/").post(authController.protect, GameXucXac10PController.createDatCuoc);

module.exports = router;
