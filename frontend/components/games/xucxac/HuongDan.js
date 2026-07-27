import { Typography } from "@mui/material";
import { memo } from "react";
import Modal from "../../homePage/Modal";
const HuongDan = ({ isModal, setIsModal }) => {
  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Hướng dẫn cách chơi"}>
        <Typography>
          Chiến thắng khi đặt cược tổng 3 xúc xắc (Tài/Xỉu/Chẵn/Lẻ). Ví dụ tỉ lệ ăn là 1.98 (đánh 100,000đ ăn 198,000đ).
        </Typography>
        <Typography>Xỉu: tổng 3 xúc xắc từ 3 đến 10</Typography>
        <Typography>Tài: tổng 3 xúc xắc từ 11 đến 18</Typography>
        <Typography>Chẵn: tổng 3 xúc xắc là số chẵn</Typography>
        <Typography>Lẻ: tổng 3 xúc xắc là số lẻ</Typography>
        <Typography>Ví dụ: Kết quả 1 2 3 → tổng 6 → Xỉu + Chẵn.</Typography>
      </Modal>
    </>
  );
};
export default memo(HuongDan);
