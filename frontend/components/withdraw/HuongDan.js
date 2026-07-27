import { Box, Typography } from "@mui/material";
const HuongDan = () => {
  return (
    <>
      <Box
        className="huongdan"
        sx={{
          padding: "10px",
          boxShadow: "0 5px 5px #c5c5da40",
          marginTop: "20px",
          borderRadius: "15px",
          backgroundColor: "#162948",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <h2 className="title">Hướng dẫn rút tiền</h2>
        <Typography component="ul">
          <li>Nhập tên ngân hàng, tên chủ tài khoản, số tài khoản và số tiền muốn rút.</li>
          <li>Số tiền rút tối thiểu 500.000đ.</li>
          <li>Thông tin ngân hàng chỉ gắn với lệnh rút (không lưu vào tài khoản).</li>
          <li>Tiền sẽ về tài khoản sau khi admin duyệt; nếu lâu hãy liên hệ CSKH.</li>
        </Typography>
      </Box>
    </>
  );
};
export default HuongDan;
