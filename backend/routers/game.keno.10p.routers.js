const express = require("express");
const GameKeno10PController = require("../controllers/game.keno.10p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();
router.use("/lich-su", require("./lichsu.game.keno.10p.routers"));
router.route("/ti-le").get(authController.protect, GameKeno10PController.getTiLeGame);
router.route("/").post(authController.protect, GameKeno10PController.createDatCuoc);
module.exports = router;
