import { Box, Typography } from "@mui/material";

const Item = ({ item }) => {
  return (
    <>
      <Box
        sx={{
          background: "url(/assets/images/background_bank.png) no-repeat 50%",
          backgroundSize: "100% 100%",
          padding: "1rem",
          minHeight: "20rem",
          alignItems: "center",
          gap: "1rem",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.8rem",
            }}
          >
            {item.tenChuTaiKhoan}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            {item.soTaiKhoan}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            margin: "2rem",
            alignItems: "center",
          }}
        >
          <img src="/assets/images/credit_card.png" />
          <Typography
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "2.5rem",
            }}
          >
            {item.tenNganHang}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default Item;
