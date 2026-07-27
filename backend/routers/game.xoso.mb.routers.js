const express = require("express");
const GameXoSoMBController = require("../controllers/game.xoso.mb.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xoso.mb.routers"));
router.route("/ti-le").get(authController.protect, GameXoSoMBController.getTiLeGame);
router.route("/").post(authController.protect, GameXoSoMBController.createDatCuoc);

module.exports = router;
