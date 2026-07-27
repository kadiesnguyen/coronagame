const express = require("express");
const GameXucXac5PAdminController = require("../../controllers/admin/game.xucxac.5p.admin.controller");
const authController = require("../../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xucxac.5p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameXucXac5PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameXucXac5PAdminController.setStatusAutoGame);

router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameXucXac5PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameXucXac5PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameXucXac5PAdminController.getLichSuGameChiTiet);

module.exports = router;
