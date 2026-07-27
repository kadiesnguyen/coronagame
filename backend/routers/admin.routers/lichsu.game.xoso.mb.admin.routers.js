const express = require("express");
const GameXoSoMBAdminController = require("../../controllers/admin/game.xoso.mb.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router
  .route("/lich-su-cuoc/:phien")
  .get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().getLichSuCuocGameChiTiet);
router
  .route("/lich-su-cuoc")
  .get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().getAllLichSuCuocGame);
router
  .route("/get-so-luong-phien-game")
  .get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().countAllGame);

router.route("/").get(authController.protect, authController.reStrictTo("admin"), new GameXoSoMBAdminController().getAllLichSuGame);
module.exports = router;
