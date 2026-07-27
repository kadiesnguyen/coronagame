import { memo } from "react";
import Modal from "../../homePage/Modal";
const BangKetQua = ({ isModal, setIsModal, phienHoanTatMoiNhat }) => {
  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Kết quả phiên trước"}>
        {phienHoanTatMoiNhat && phienHoanTatMoiNhat.ketQua && (
          <table id="table-xsmb" className="table-result table table-bordered table-striped table-xsmb">
            <tbody>
              <tr>
                <th style={{ width: "10%" }}>ĐB</th>
                <td>
                  <span id="mb_prize_0" className="special-prize div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[0].data[0]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>
                  <span id="mb_prize_1" className="prize1 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[1].data[0]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>2</th>
                <td>
                  <span id="mb_prize_2" className="prize2 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[2].data[0]}
                  </span>
                  <span id="mb_prize_3" className="prize2 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[2].data[1]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>3</th>
                <td>
                  <span id="mb_prize_4" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[0]}
                  </span>
                  <span id="mb_prize_5" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[1]}
                  </span>
                  <span id="mb_prize_6" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[2]}
                  </span>
                  <span id="mb_prize_7" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[3]}
                  </span>
                  <span id="mb_prize_8" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[4]}
                  </span>
                  <span id="mb_prize_9" className="prize3 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[3].data[5]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>4</th>
                <td>
                  <span id="mb_prize_10" className="prize4 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[4].data[0]}
                  </span>
                  <span id="mb_prize_11" className="prize4 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[4].data[1]}
                  </span>
                  <span id="mb_prize_12" className="prize4 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[4].data[2]}
                  </span>
                  <span id="mb_prize_13" className="prize4 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[4].data[3]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>5</th>
                <td>
                  <span id="mb_prize_14" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[0]}
                  </span>
                  <span id="mb_prize_15" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[1]}
                  </span>
                  <span id="mb_prize_16" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[2]}
                  </span>
                  <span id="mb_prize_17" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[3]}
                  </span>
                  <span id="mb_prize_18" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[4]}
                  </span>
                  <span id="mb_prize_19" className="prize5 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[5].data[5]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>6</th>
                <td>
                  <span id="mb_prize_20" className="prize6 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[6].data[0]}
                  </span>
                  <span id="mb_prize_21" className="prize6 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[6].data[1]}
                  </span>
                  <span id="mb_prize_22" className="prize6 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[6].data[2]}
                  </span>
                </td>
              </tr>
              <tr>
                <th>7</th>
                <td>
                  <span id="mb_prize_23" className="prize7 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[7].data[0]}
                  </span>
                  <span id="mb_prize_24" className="prize7 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[7].data[1]}
                  </span>
                  <span id="mb_prize_25" className="prize7 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[7].data[2]}
                  </span>
                  <span id="mb_prize_26" className="prize7 div-horizontal">
                    {phienHoanTatMoiNhat.ketQua[7].data[3]}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>
    </>
  );
};
export default memo(BangKetQua);
