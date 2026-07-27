const express = require("express");
const GameKeno1PAdminController = require("../../controllers/admin/game.keno.1p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.countAllGame);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameKeno1PAdminController.getAllLichSuGame);
module.exports = router;
