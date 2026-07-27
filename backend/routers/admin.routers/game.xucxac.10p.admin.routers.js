const express = require("express");
const GameXucXac10PAdminController = require("../../controllers/admin/game.xucxac.10p.admin.controller");
const authController = require("../../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.10p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.setStatusAutoGame);

router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getLichSuGameChiTiet);

module.exports = router;
