const express = require("express");
const GameKeno5PAdminController = require("../../controllers/admin/game.keno.5p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.countAllGame);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameKeno5PAdminController.getAllLichSuGame);
module.exports = router;
