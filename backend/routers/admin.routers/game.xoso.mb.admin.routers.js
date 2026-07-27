const express = require("express");
const GameXoSoMBAdminController = require("../../controllers/admin/game.xoso.mb.admin.controller");
const authController = require("../../controllers/auth_controller");

const router = express.Router();
router.use("/lich-su", require("./lichsu.game.xoso.mb.admin.routers"));
router.route("/ti-le").post(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().setTiLeGame);
router.route("/ti-le").get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().getTiLeGame);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().getLichSuGameChiTiet);

module.exports = router;
