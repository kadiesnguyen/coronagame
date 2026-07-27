const express = require("express");
const GameXoSo3PAdminController = require("../../controllers/admin/game.xoso.3p.admin.controller");
const authController = require("../../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xoso.3p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameXoSo3PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameXoSo3PAdminController.setStatusAutoGame);
router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameXoSo3PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameXoSo3PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameXoSo3PAdminController.getLichSuGameChiTiet);

module.exports = router;
