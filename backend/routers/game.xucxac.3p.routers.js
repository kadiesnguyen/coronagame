const express = require("express");
const GameXucXac3PController = require("../controllers/game.xucxac.3p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.3p.routers"));
router.route("/ti-le").get(authController.protect, GameXucXac3PController.getTiLeGame);
router.route("/").post(authController.protect, GameXucXac3PController.createDatCuoc);

module.exports = router;
