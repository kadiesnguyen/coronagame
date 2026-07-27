import { convertDateTime } from "@/utils/convertTime";
import { Box, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";

const ItemLichSu = ({ item }) => {
  return (
    <>
      <Box
        sx={{
          padding: "10px",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          flexDirection: "column",

          gap: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Tiển trước:{" "}
          <NumericFormat value={item.tienTruoc} displayType="text" allowLeadingZeros thousandSeparator="," />đ
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Tiền sau: <NumericFormat value={item.tienSau} displayType="text" allowLeadingZeros thousandSeparator="," />đ
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Thay đổi: {item.tienSau - item.tienTruoc > 0 ? "+" : ""}
          <NumericFormat
            value={item.tienSau - item.tienTruoc}
            displayType="text"
            allowLeadingZeros
            thousandSeparator=","
          />
          đ
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Nội dung: {item.noiDung}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Thời gian: {convertDateTime(item.createdAt)}
        </Typography>
      </Box>
    </>
  );
};
export default ItemLichSu;
