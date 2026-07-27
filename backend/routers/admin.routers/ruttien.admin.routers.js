const express = require("express");
const AdminController = require("../../controllers/admin/ruttien.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();
router.route("/get-all").get(authController.protect, authController.reStrictTo("admin"), AdminController.countAllLichSuRut);
router.route("/:id").get(authController.protect, authController.reStrictTo("admin"), AdminController.getChiTietLichSuRut);
router.route("/:id").put(authController.protect, authController.reStrictTo("admin"), AdminController.updateChiTietLichSuRut);
router.route("/").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDanhSachLichSuRut);
module.exports = router;
