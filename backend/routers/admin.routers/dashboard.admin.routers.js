const express = require("express");
const AdminController = require("../../controllers/admin/dashboard.admin.controller");
const authController = require("../../controllers/auth_controller");
const router = express.Router();

router.route("/users").get(authController.protect, authController.reStrictTo("admin"), AdminController.getUserDashboard);
router.route("/deposit").get(authController.protect, authController.reStrictTo("admin"), AdminController.getDepositDashboard);
router
  .route("/game-transactionals")
  .get(authController.protect, authController.reStrictTo("admin"), AdminController.getGameTransactionalsDashboard);

module.exports = router;
