const express = require("express");
const GameXoSo5PController = require("../controllers/game.xoso.5p.controller");
const authController = require("../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xoso.5p.routers"));
router.route("/ti-le").get(authController.protect, GameXoSo5PController.getTiLeGame);
router.route("/").post(authController.protect, GameXoSo5PController.createDatCuoc);

module.exports = router;
