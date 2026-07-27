const express = require("express");
const GameXocDia1PController = require("../controllers/game.xocdia.1p.controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.use("/lich-su", require("./lichsu.game.xocdia.1p.routers"));
router.route("/ti-le").get(authController.protect, GameXocDia1PController.getTiLeGame);
router.route("/").post(authController.protect, GameXocDia1PController.createDatCuoc);
module.exports = router;
