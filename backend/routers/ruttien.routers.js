const express = require("express");
const authController = require("../controllers/auth_controller");
const RutTienController = require("../controllers/ruttien.controller");
const router = express.Router();
router.route("/").get(authController.protect, RutTienController.getDanhSach);
router.route("/").post(authController.protect, RutTienController.createRutTien);
module.exports = router;
