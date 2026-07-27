const express = require("express");
const GameXucXac10PAdminController = require("../../controllers/admin/game.xucxac.10p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.countAllGame);

router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameXucXac10PAdminController.getAllLichSuGame);
module.exports = router;
