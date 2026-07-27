const express = require("express");
const AdminController = require("../../controllers/admin/thongbao.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.route("/get-all").get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllThongBao);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), AdminController.getChiTietThongBao);
router.route("/:id").put(authController.protect, authController.reStrictTo("admin"), AdminController.editThongBao);
router.route("/:id").delete(authController.protect, authController.reStrictTo("admin"), AdminController.deleteThongBao);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDanhSachThongBao);
router.route("/").post(authController.protect, authController.reStrictTo("admin"), AdminController.createThongBao);

module.exports = router;
