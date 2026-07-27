const express = require("express");
const AdminController = require("../../controllers/admin/user.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.route("/get-so-luong-user").get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllUser);
router.route("/list-bank").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDanhSachNganHangUser);
router.route("/deposit-history/get-all").get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllLichSuNap);
router.route("/deposit-history").get(authController.protect, authController.reStrictTo("admin"), AdminController.getLichSuNapUser);
router
  .route("/bien-dong-so-du/get-all")
  .get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllBienDongSoDu);
router.route("/bien-dong-so-du").get(authController.protect, authController.reStrictTo("admin"), AdminController.getBienDongSoDuUser);
router.route("/nhat-ky-hoat-dong").get(authController.protect, authController.reStrictTo("admin"), AdminController.getNhatKyHoatDongUser);
router
  .route("/nhat-ky-hoat-dong/get-all")
  .get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllNhatKyHoatDong);

router.route("/update-money").post(authController.protect, authController.reStrictTo("admin"), AdminController.updateMoneyUser);
router.route("/update-password").post(authController.protect, authController.reStrictTo("admin"), AdminController.updatePasswordUser);
router.route("/update-information").post(authController.protect, authController.reStrictTo("admin"), AdminController.updateInformationUser);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), AdminController.getChiTietUser);

router.route("/").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDanhSachUsers);

module.exports = router;
