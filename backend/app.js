const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const useragent = require("express-useragent");
dotenv.config({ path: "./config.env" });
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // Import the UTC plugin
const timezone = require("dayjs/plugin/timezone"); // Import the timezone plugin
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault(process.env.TZ || "Asia/Ho_Chi_Minh");
// dotenv.config({ path: "./docker.config.env" });
const app = express();
const morgan = require("morgan");

const { NotFoundError } = require("./utils/app_error");
const errorController = require("./controllers/error_controller");
const adminRouters = require("./routers/admin.routers");
const thongBaoRouters = require("./routers/thongbao.routers");
const nguoiDungRouters = require("./routers/nguoidung.routers");
const heThongRouters = require("./routers/hethong_routers");
const rutTienRouters = require("./routers/ruttien.routers");
const napTienRouters = require("./routers/naptien.routers");

const lichSuNapRouters = require("./routers/lichsunap_routers");
const bienDongSoDuRouters = require("./routers/biendongsodu.routers");
const gameKeno1PRouters = require("./routers/game.keno.1p.routers");
const gameKeno3PRouters = require("./routers/game.keno.3p.routers");
const gameKeno5PRouters = require("./routers/game.keno.5p.routers");
const lienKetNganHangRouters = require("./routers/lienketnganhang.routers");
const gameXucXac1PRouters = require("./routers/game.xucxac.1p.routers");
const gameXucXac3PRouters = require("./routers/game.xucxac.3p.routers");
const gameXocDia1PRouters = require("./routers/game.xocdia.1p.routers");
const gameXoSoMBRouters = require("./routers/game.xoso.mb.routers");
const gameXoSo3PRouters = require("./routers/game.xoso.3p.routers");
const gameXoSo5PRouters = require("./routers/game.xoso.5p.routers");
const { clientEndpoint, clientOrigins } = require("./configs/endpoint");
const cors = require("cors");
const TelegramService = require("./services/telegram.service");
//MIDDLEWARE
app.use(
  cors({
    origin: clientOrigins?.length > 1 ? clientOrigins : clientEndpoint,
  })
);

//security http — allow browser calls from client/admin origins (API is cross-origin)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(useragent.express());

// Init Bot Telegram
TelegramService.initBot().then(() => {
  console.log(`Init Successful telegram bot`);
});

//limit request
const limiter = rateLimit({
  limit: 1000,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this ip, please try again later",
});
app.use("/api", limiter);

///// body parser in , reading data from body
app.use(express.json());

//against NoSQL Injection
app.use(mongoSanitize());
//against XSS (HTML, JS)
app.use("/api/v1/admin", adminRouters);
app.use(xss());

//serving static file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.timeNow = new Date().toISOString();
  global._USER_AGENT = req.useragent;
  next();
});

//routers
app.get("/", (req, res) => {
  res.status(200).send("Server đang chạy thành công");
});

app.use("/api/v1/hethong", heThongRouters);
app.use("/api/v1/naptien", napTienRouters);
app.use("/api/v1/ruttien", rutTienRouters);
app.use("/api/v1/thongbao", thongBaoRouters);
app.use("/api/v1/nguoidung", nguoiDungRouters);
app.use("/api/v1/lichsunap", lichSuNapRouters);
app.use("/api/v1/biendongsodu", bienDongSoDuRouters);
app.use("/api/v1/lienketnganhang", lienKetNganHangRouters);
app.use("/api/v1/games/keno1p", gameKeno1PRouters);
app.use("/api/v1/games/keno3p", gameKeno3PRouters);
app.use("/api/v1/games/keno5p", gameKeno5PRouters);
app.use("/api/v1/games/xucxac1p", gameXucXac1PRouters);
app.use("/api/v1/games/xucxac3p", gameXucXac3PRouters);
app.use("/api/v1/games/xocdia1p", gameXocDia1PRouters);
app.use("/api/v1/games/xoso3p", gameXoSo3PRouters);
app.use("/api/v1/games/xoso5p", gameXoSo5PRouters);
app.use("/api/v1/games/xosomb", gameXoSoMBRouters);

app.all("*", (req, res, next) => {
  next(new NotFoundError(`No found ${req.originalUrl}`));
});

app.use(errorController);
module.exports = app;
