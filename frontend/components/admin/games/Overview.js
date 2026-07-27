import Keno1P from "@/public/assets/images/keno1p.png";
import Keno3P from "@/public/assets/images/keno3p.png";
import Keno5P from "@/public/assets/images/keno5p.png";
import XocDia1P from "@/public/assets/images/xocdia1p.png";
import XoSo3P from "@/public/assets/images/xoso3p.png";
import XoSo5P from "@/public/assets/images/xoso5p.png";
import XucXac1P from "@/public/assets/images/xucxac1p.png";
import XucXac3P from "@/public/assets/images/xucxac3p.png";
import { markGameBetSeen } from "@/redux/actions/admin";
import { getTotalUnreadGameBets, getUnreadGameBetCount } from "@/utils/adminGameBetBadge";
import { Badge, Box, Card, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbBar from "../BreadcrumbBar";

const listGame = [
  { title: "Keno 1P", link: "/admin/games/keno1p", room: "keno1p", icon: Keno1P, introduce: "Xem và chỉnh sửa kết quả quay số" },
  { title: "Keno 3P", link: "/admin/games/keno3p", room: "keno3p", icon: Keno3P, introduce: "Xem và chỉnh sửa kết quả quay số" },
  { title: "Keno 5P", link: "/admin/games/keno5p", room: "keno5p", icon: Keno5P, introduce: "Xem và chỉnh sửa kết quả quay số" },
  { title: "Keno 10P", link: "/admin/games/keno10p", room: "keno10p", icon: Keno5P, introduce: "Xem và chỉnh sửa kết quả quay số VIP" },
  { title: "Xúc Xắc 1P", link: "/admin/games/xucxac1p", room: "xucxac1p", icon: XucXac1P, introduce: "Xem và chỉnh sửa kết quả xúc xắc" },
  { title: "Xúc Xắc 3P", link: "/admin/games/xucxac3p", room: "xucxac3p", icon: XucXac3P, introduce: "Xem và chỉnh sửa kết quả xúc xắc" },
  { title: "Xóc Đĩa 1P", link: "/admin/games/xocdia1p", room: "xocdia1p", icon: XocDia1P, introduce: "Xem và chỉnh sửa kết quả xóc đĩa" },
  { title: "Xổ Số 3P", link: "/admin/games/xoso3p", room: "xoso3p", icon: XoSo3P, introduce: "Xem và chỉnh sửa kết quả xổ số" },
  { title: "Xổ Số 5P", link: "/admin/games/xoso5p", room: "xoso5p", icon: XoSo5P, introduce: "Xem và chỉnh sửa kết quả xổ số" },
  { title: "Xổ Số Miền Bắc", link: "/admin/games/xosomb", room: "xosomb", icon: XoSo5P, introduce: "Xem kết quả xổ số miền bắc" },
];

const BreadcrumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Quản lý game", href: "/admin/games" },
];

const Overview = () => {
  const dispatch = useDispatch();
  const gameRoomCounts = useSelector((state) => state.admin.GAME_ROOM_COUNTS || {});
  const gameBetAlerts = useSelector((state) => state.admin.GAME_BET_ALERTS || {});
  const gameBetSeen = useSelector((state) => state.admin.GAME_BET_SEEN || {});
  const totalUnreadBets = getTotalUnreadGameBets(gameBetAlerts, gameBetSeen);

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <Box sx={{ width: "100%", maxWidth: "120rem", minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", mb: "8px" }}>
          <Typography
            sx={{
              fontSize: { xs: "2.2rem", md: "2.6rem" },
              fontWeight: 800,
              color: "#fff",
            }}
          >
            Quản lý game
          </Typography>
          {totalUnreadBets > 0 && (
            <Box
              sx={{
                px: "10px",
                py: "4px",
                borderRadius: "999px",
                backgroundColor: "rgba(239,109,109,.18)",
                border: "1px solid rgba(239,109,109,.45)",
                color: "#ef6d6d",
                fontWeight: 800,
                fontSize: "1.3rem",
              }}
            >
              {totalUnreadBets} lệnh cược chưa xem
            </Box>
          )}
        </Box>
        <Typography sx={{ fontSize: "1.5rem", color: "#b8c0d4", marginBottom: "24px" }}>
          Badge đỏ = phiên đang có cược chưa xem. Bấm vào game hoặc sang phiên mới sẽ mất.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0,1fr))",
              sm: "repeat(2, minmax(0,1fr))",
              lg: "repeat(3, minmax(0,1fr))",
              xl: "repeat(4, minmax(0,1fr))",
            },
            gap: "16px",
          }}
        >
          {listGame.map((item) => {
            const players = Number(gameRoomCounts[item.room]) || 0;
            const unreadBets = getUnreadGameBetCount(gameBetAlerts, gameBetSeen, item.room);
            return (
              <Link
                href={item.link}
                key={item.room}
                style={{ textDecoration: "none" }}
                onClick={() => dispatch(markGameBetSeen(item.room))}
              >
                <Badge
                  badgeContent={unreadBets > 0 ? unreadBets : 0}
                  color="error"
                  overlap="rectangular"
                  sx={{
                    width: "100%",
                    display: "block",
                    "& .MuiBadge-badge": {
                      right: 14,
                      top: 14,
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      minWidth: 22,
                      height: 22,
                      backgroundColor: "#ef6d6d",
                    },
                  }}
                >
                  <Card
                    sx={{
                      cursor: "pointer",
                      background: "linear-gradient(145deg, #1a2f4d 0%, #162948 55%, #12243c 100%)",
                      color: "#ffffff",
                      display: "flex",
                      minHeight: "12rem",
                      padding: "16px 20px",
                      boxShadow: "0 8px 24px rgba(0,0,0,.35)",
                      border: unreadBets > 0 ? "1px solid rgba(239,109,109,.55)" : "1px solid rgba(212,175,55,.25)",
                      borderRadius: "16px",
                      transition: "border-color .2s ease, transform .15s ease",
                      width: "100%",
                      "&:hover": {
                        borderColor: "rgba(229,192,91,.7)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        minWidth: 0,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.8rem",
                            display: "block",
                            color: "#fff",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "1.3rem",
                            color: "#b8c0d4",
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {item.introduce}
                        </Typography>
                        {unreadBets > 0 ? (
                          <Typography sx={{ fontSize: "1.25rem", color: "#ef6d6d", fontWeight: 700, mt: "6px" }}>
                            {unreadBets} lệnh cược phiên này
                          </Typography>
                        ) : players > 0 ? (
                          <Typography sx={{ fontSize: "1.25rem", color: "#8b95a8", fontWeight: 600, mt: "6px" }}>
                            {players} người đang trong phòng
                          </Typography>
                        ) : null}
                      </Box>
                      <Box
                        sx={{
                          width: "7.2rem",
                          height: "7.2rem",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <Image src={item.icon} alt={item.title} fill style={{ objectFit: "contain" }} />
                      </Box>
                    </Box>
                  </Card>
                </Badge>
              </Link>
            );
          })}
        </Box>
      </Box>
    </>
  );
};
export default Overview;
