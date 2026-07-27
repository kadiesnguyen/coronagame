import { Box, Typography } from "@mui/material";

const HuongDan = () => {
  return (
    <>
      <Box
        className="huongdan"
        sx={{
          padding: "1rem",
          boxShadow: "0 5px 5px #c5c5da40",
          marginTop: "2rem",
          borderRadius: "1.5rem",
          backgroundColor: "#ffffff",

          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <h2 className="title">Hướng dẫn nạp tiền</h2>
        <Typography component="ul">
          <li>Vui lòng quét mã QR hoặc nhập thông tin chuyển khoản đến ngân hàng ở trên.</li>
          <li>Vui lòng ghi đúng nội dung chuyển khoản là tên đăng nhập của bạn</li>
          <li>Tiền sẽ được cộng vào tài khoản của bạn trong vòng vài phút. Nếu không, hãy liên hệ CSKH</li>
        </Typography>
      </Box>
    </>
  );
};
export default HuongDan;
