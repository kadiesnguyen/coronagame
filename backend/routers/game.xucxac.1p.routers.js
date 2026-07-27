const express = require("express");
const GameXucXac1PController = require("../controllers/game.xucxac.1p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.1p.routers"));
router.route("/ti-le").get(authController.protect, GameXucXac1PController.getTiLeGame);
router.route("/").post(authController.protect, GameXucXac1PController.createDatCuoc);

module.exports = router;
