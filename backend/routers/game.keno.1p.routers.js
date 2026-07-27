const express = require("express");
const GameKeno1PController = require("../controllers/game.keno.1p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.use("/lich-su", require("./lichsu.game.keno.1p.routers"));
router.route("/ti-le").get(authController.protect, GameKeno1PController.getTiLeGame);
router.route("/").post(authController.protect, GameKeno1PController.createDatCuoc);
module.exports = router;
