const express = require("express");
const GameKeno3PAdminController = require("../../controllers/admin/game.keno.3p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno3PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno3PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno3PAdminController.countAllGame);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameKeno3PAdminController.getAllLichSuGame);
module.exports = router;
