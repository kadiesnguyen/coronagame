import { Typography } from "@mui/material";
import { memo } from "react";
import Modal from "../../homePage/Modal";
const HuongDan = ({ isModal, setIsModal }) => {
  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Hướng dẫn cách chơi"}>
        <Typography>
          Chiến thắng khi đặt cược tổng 3 số xúc xắc (tài/xỉu). Ví dụ tỉ lệ ăn là 1.98 (đánh 100,000đ ăn 198,000đ).
        </Typography>
        <Typography> Xỉu: kết quả tổng 3 xúc xắc từ 3 đến 10</Typography>
        <Typography> Tài: kết quả tổng 3 xúc xắc từ 11 đến 18</Typography>
        <Typography>Ví dụ: Kết quả 3 xúc xắc là: 1 2 3. Tổng 3 xúc xắc = 1 + 2 + 3 = 6. Kết quả sẽ là Xỉu.</Typography>
      </Modal>
    </>
  );
};
export default memo(HuongDan);
