const express = require("express");
const AdminController = require("../../controllers/admin/hethong.admin.controller");
const authController = require("../../controllers/auth_controller");
const { uploadBranding } = require("../../configs/upload.local.config");
const router = express.Router();

router.route("/bot-telegram").get(authController.protect, authController.reStrictTo("admin"), AdminController.getBotTelegramConfig);
router.route("/tawk-to").get(authController.protect, authController.reStrictTo("admin"), AdminController.getTawkToConfig);
router.route("/bot-telegram").put(authController.protect, authController.reStrictTo("admin"), AdminController.updateBotTelegramConfig);
router.route("/tawk-to").put(authController.protect, authController.reStrictTo("admin"), AdminController.updateTawkToConfig);
router.route("/vip-levels").get(authController.protect, authController.reStrictTo("admin"), AdminController.getVipLevelsConfig);
router.route("/vip-levels").put(authController.protect, authController.reStrictTo("admin"), AdminController.updateVipLevelsConfig);
router.route("/branding").get(authController.protect, authController.reStrictTo("admin"), AdminController.getBrandingConfig);
router.route("/branding").put(authController.protect, authController.reStrictTo("admin"), AdminController.updateBrandingConfig);
router
  .route("/branding/upload")
  .post(authController.protect, authController.reStrictTo("admin"), uploadBranding.single("file"), AdminController.uploadBrandingAsset);

module.exports = router;
