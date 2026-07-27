import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Money from "../user/Money";
const ThongTinSoDu = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <Box
        sx={{
          background: "url(https://i.imgur.com/gh5l9sN.png) no-repeat 50%",
          backgroundSize: "100% 100%",
          padding: "10px",
          minHeight: "200px",
          alignItems: "center",
          gap: "10px",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.8rem",
            }}
          >
            Số dư khả dụng
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            <Money />
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            margin: "20px",
            alignItems: "center",
          }}
        >
          <img src="https://i.imgur.com/LKRkPTe.png" />
          <Typography
            sx={{
              fontSize: "2.5rem",
            }}
          >
            {session.user.taiKhoan}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default ThongTinSoDu;
