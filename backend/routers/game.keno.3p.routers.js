const express = require("express");
const GameKeno3PController = require("../controllers/game.keno.3p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();
router.use("/lich-su", require("./lichsu.game.keno.3p.routers"));
router.route("/ti-le").get(authController.protect, GameKeno3PController.getTiLeGame);
router.route("/").post(authController.protect, GameKeno3PController.createDatCuoc);
module.exports = router;
