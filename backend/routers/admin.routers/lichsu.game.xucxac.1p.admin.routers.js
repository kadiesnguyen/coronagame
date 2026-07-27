const express = require("express");
const GameXucXac1PAdminController = require("../../controllers/admin/game.xucxac.1p.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.countAllGame);

router.route("/").get(authController.protect, authController.reStrictTo("admin"), GameXucXac1PAdminController.getAllLichSuGame);
module.exports = router;
