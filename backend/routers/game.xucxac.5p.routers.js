const express = require("express");
const GameXucXac5PController = require("../controllers/game.xucxac.5p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.5p.routers"));
router.route("/ti-le").get(authController.protect, GameXucXac5PController.getTiLeGame);
router.route("/").post(authController.protect, GameXucXac5PController.createDatCuoc);

module.exports = router;
