const express = require("express");
const lichSuNapController = require("../controllers/lichsunap_controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/").get(authController.protect, lichSuNapController.getLichSuNap);

module.exports = router;
