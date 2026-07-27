const express = require("express");
const AdminController = require("../../controllers/admin/nganhang.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), AdminController.getChiTietNganHang);
router.route("/:id").put(authController.protect, authController.reStrictTo("admin"), AdminController.editNganHang);
router.route("/:id").delete(authController.protect, authController.reStrictTo("admin"), AdminController.deleteNganHang);

router.route("/").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDanhSachNganHang);
router.route("/").post(authController.protect, authController.reStrictTo("admin"), AdminController.createNganHang);

module.exports = router;
