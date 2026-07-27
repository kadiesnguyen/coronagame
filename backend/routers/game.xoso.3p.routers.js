const express = require("express");
const GameXoSo3PController = require("../controllers/game.xoso.3p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xoso.3p.routers"));
router.route("/ti-le").get(authController.protect, GameXoSo3PController.getTiLeGame);
router.route("/").post(authController.protect, GameXoSo3PController.createDatCuoc);

module.exports = router;
