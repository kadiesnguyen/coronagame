const express = require("express");
const GameXucXac1PAdminController = require("../../controllers/admin/game.xucxac.1p.admin.controller");
const authController = require("../../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.1p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.setStatusAutoGame);
router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getLichSuGameChiTiet);

module.exports = router;
