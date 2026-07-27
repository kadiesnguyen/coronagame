const express = require("express");
const GameKeno5PAdminController = require("../../controllers/admin/game.keno.5p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.use("/lich-su", require("./lichsu.game.keno.5p.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.setTiLeGame);
router.route("/autogame").post(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.setStatusAutoGame);
router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getTiLeGame);
router.route("/autogame").get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getStatusAutoGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getLichSuGameChiTiet);
module.exports = router;
