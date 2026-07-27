const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// dotenv.config({ path: "./docker.config.env" });

const http = require("http");
const HeThong = require("./models/HeThong");
const app = require("./app");

const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const { clientEndpoint, clientOrigins } = require("./configs/endpoint");
const GameXocDia1PService = require("./services/game.xocdia1p.service");
const GameKeno1PService = require("./services/game.keno1p.service");
const GameKeno3PService = require("./services/game.keno3p.service");
const GameKeno5PService = require("./services/game.keno5p.service");
const GameKeno10PService = require("./services/game.keno10p.service");
const GameXucXac1PService = require("./services/game.xucxac1p.service");
const GameXucXac3PService = require("./services/game.xucxac3p.service");
const GameXoSo3PService = require("./services/game.xoso3p.service");
const GameXoSo5PService = require("./services/game.xoso5p.service");
const server = http.createServer(app);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  process.exit(1);
});

// Database connection
require("./services/mongodb.service");

// Redis connection
const { verifyToken } = require("./utils/verifyToken");
const GameXSMBService = require("./services/game.xsmb.service");
const NguoiDung = require("./models/NguoiDung");
const { USER_ROLE } = require("./configs/user.config");

const port = process.env.PORT || 7000;

// Socket IO connection
const io = require("socket.io")(server, {
  cors: {
    origin: clientOrigins?.length > 1 ? clientOrigins : clientEndpoint,
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 10 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: false,
  },
});
global._io = io;

// Socket IO middleware handle authentication
global._io.use(async (socket, next) => {
  const authToken = socket.handshake.auth.token;
  let token;
  try {
    if (authToken && authToken.startsWith("Bearer")) {
      token = authToken.split(" ")[1];
      if (!token) {
        throw new Error("Đăng nhập để tiếp tục");
      }

      const decode = await verifyToken(token);
      socket.join(`${decode.taiKhoan}`);
      global._io.role = decode.role;
      global._io.user = decode;
      next();
    } else {
      throw new Error("Login to continute");
    }
  } catch (err) {
    if (err.message) {
      return next(new Error(err.message));
    }
  }
});
global._io.on("connection", (socket) => {
  global._socket = socket;
  const SocketService = require("./services/socket.service");
  new SocketService().connection(socket);
});

const autoCreateAccountAdmin = async () => {
  try {
    const findAdminUser = await NguoiDung.findOne({
      role: USER_ROLE.ADMIN,
    });
    if (!findAdminUser) {
      const taiKhoanAdmin = process.env.ADMIN_ACCOUNT || "admin123";
      const matKhauAdmin = process.env.ADMIN_PASSWORD || "Admin@123456";
      // Plain password — NguoiDung pre("save") hashes once. Do not pre-hash (double-hash breaks login).
      const newNguoiDung = new NguoiDung({
        taiKhoan: taiKhoanAdmin,
        matKhau: matKhauAdmin,
        nhapLaiMatKhau: matKhauAdmin,
        role: USER_ROLE.ADMIN,
      });
      await newNguoiDung.save();

      console.log(`Tạo tài khoản admin thành công: ${taiKhoanAdmin}/${matKhauAdmin}`);
    }
  } catch (err) {
    console.log("Không thể tạo tài khoản admin: ", err);
  }
};

const khoiTaoHeThongDB = async () => {
  try {
    await HeThong.findOneAndUpdate(
      {
        systemID: 1,
      },
      {
        $setOnInsert: {
          "gameConfigs.kenoConfigs.keno10P": {
            tiLeCLTX: 1.98,
            autoGame: true,
          },
          vipLevels: {
            vip1: { minMoney: 0, maxMoney: 100000000 },
            vip2: { minMoney: 100000000, maxMoney: 1000000000 },
            vip3: { minMoney: 1000000000, maxMoney: null },
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    await HeThong.updateOne(
      { systemID: 1, vipLevels: { $exists: false } },
      {
        $set: {
          vipLevels: {
            vip1: { minMoney: 0, maxMoney: 100000000 },
            vip2: { minMoney: 100000000, maxMoney: 1000000000 },
            vip3: { minMoney: 1000000000, maxMoney: null },
          },
        },
      }
    );
    await HeThong.updateOne(
      { systemID: 1, "gameConfigs.kenoConfigs.keno10P": { $exists: false } },
      {
        $set: {
          "gameConfigs.kenoConfigs.keno10P": {
            tiLeCLTX: 1.98,
            autoGame: true,
          },
        },
      }
    );
  } catch (err) {
    console.log("Lỗi tạo hệ thống");
  }
};

// Auto tạo tài khoản admin
autoCreateAccountAdmin();

// Khởi tạo hệ thống database
khoiTaoHeThongDB();

setTimeout(() => {
  // Game Xóc Đĩa
  GameXocDia1PService.startGame();
  // Game Keno
  GameKeno1PService.startGame();
  GameKeno3PService.startGame();
  GameKeno5PService.startGame();
  GameKeno10PService.startGame();
  // // Game Tài Xỉu
  GameXucXac1PService.startGame();
  GameXucXac3PService.startGame();
  // // Game Xổ Số
  GameXoSo3PService.startGame();
  GameXoSo5PService.startGame();
  GameXSMBService.startGame();
}, 1000);

server.listen(port, () => {
  console.log("Server đang chay tren cong", port, process.env.NODE_ENV);
  console.log(`Server dang su dung TimeZone: ${process.env.TZ} ${dayjs().format("DD/MM/YYYY hh:mm:ss a")}`);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
