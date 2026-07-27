const express = require("express");

const router = express.Router();

// DASHBOARD
router.use("/dashboard", require("./admin.routers/dashboard.admin.routers"));

// HE THONG
router.use("/he-thong", require("./admin.routers/hethong.admin.routers"));

// GAME XOSO
// Xo So 3P
router.use("/games/xoso3p", require("./admin.routers/game.xoso.3p.admin.routers"));
// Xo So 5P
router.use("/games/xoso5p", require("./admin.routers/game.xoso.5p.admin.routers"));
// Xo So MB
router.use("/games/xosomb", require("./admin.routers/game.xoso.mb.admin.routers"));

// GAME XOCDIA
// Xoc Dia 1P
router.use("/games/xocdia1p", require("./admin.routers/game.xocdia.1p.admin.routers"));

// GAME XUC XAC
// Xuc Xac 1P
router.use("/games/xucxac1p", require("./admin.routers/game.xucxac.1p.admin.routers"));
// Xuc Xac 3P
router.use("/games/xucxac3p", require("./admin.routers/game.xucxac.3p.admin.routers"));

// GAME KENO
// Keno 1P
router.use("/games/keno1p", require("./admin.routers/game.keno.1p.admin.routers"));
// Keno 3P
router.use("/games/keno3p", require("./admin.routers/game.keno.3p.admin.routers"));
// Keno 5P
router.use("/games/keno5p", require("./admin.routers/game.keno.5p.admin.routers"));
// USERS
router.use("/users", require("./admin.routers/user.admin.routers"));

// Thong Bao
router.use("/thong-bao", require("./admin.routers/thongbao.admin.routers"));

// Ngan Hang
router.use("/ngan-hang", require("./admin.routers/nganhang.admin.routers"));

// Nap Tien
router.use("/nap-tien", require("./admin.routers/naptien.admin.routers"));

// Logger
router.use("/logs", require("./admin.routers/logger.admin.router"));

// Rut tien
router.use("/rut-tien", require("./admin.routers/ruttien.admin.routers"));

module.exports = router;
