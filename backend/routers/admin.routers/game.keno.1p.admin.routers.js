const express = require("express");
const GameKeno1PAdminController = require("../../controllers/admin/game.keno.1p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.use("/lich-su", require("./lichsu.game.keno.1p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.setStatusAutoGame);
router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getLichSuGameChiTiet);
module.exports = router;
