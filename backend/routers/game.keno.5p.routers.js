const express = require("express");
const GameKeno5PController = require("../controllers/game.keno.5p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();
router.use("/lich-su", require("./lichsu.game.keno.5p.routers"));
router.route("/ti-le").get(authController.protect, GameKeno5PController.getTiLeGame);
router.route("/").post(authController.protect, GameKeno5PController.createDatCuoc);
module.exports = router;
