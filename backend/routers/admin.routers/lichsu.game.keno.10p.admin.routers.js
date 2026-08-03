const express = require("express");
const GameKeno10PAdminController = require("../../controllers/admin/game.keno.10p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:betId/doi-cua")
  .post(authController.protect, authController.reStrictTo("admin"), GameKeno10PAdminController.doiCuaDatCuoc);
router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno10PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno10PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno10PAdminController.countAllGame);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameKeno10PAdminController.getAllLichSuGame);
module.exports = router;
