import { LOAI_GAME, convertLoaiGame } from "@/configs/game.config";
import { LOAI_CUOC_GAME, STATUS_BET_GAME, convertLoaiCuoc } from "@/configs/game.xoso.config";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangBetGameXoSo } from "@/utils/convertTinhTrang";
import { getKetQua } from "@/utils/xoso";
import { Box, Typography } from "@mui/material";
import _ from "lodash";
import { memo } from "react";
const ItemLichSuCuoc = ({ item, TYPE_GAME }) => {
  const convertTrangThaiDatCuoc = () => {
    if (item.datCuoc[0].trangThai === STATUS_BET_GAME.DANG_CHO && item.phien.ketQua.length > 0) {
      const bangKetQua = getKetQua(item.phien.ketQua);
      const listKetQuaCuocUpdate = item.datCuoc.map((_) => STATUS_BET_GAME.DANG_CHO);
      let indexItemCuoc = 0;

      for (const itemCuoc of item.datCuoc) {
        const { chiTietCuoc, loaiCuoc } = itemCuoc;

        // Game lô
        if (loaiCuoc === LOAI_CUOC_GAME.LO) {
          /// LOOP Chi tiet cuoc
          for (const { so, tienCuoc } of chiTietCuoc) {
            // Thắng
            if (bangKetQua[LOAI_CUOC_GAME.LO].includes(so)) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
            }
          }
        } else if (loaiCuoc === LOAI_CUOC_GAME.DE) {
          /// LOOP Chi tiet cuoc
          for (const { so, tienCuoc } of chiTietCuoc) {
            // Thắng
            if (bangKetQua[LOAI_CUOC_GAME.DE].includes(so)) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
            }
          }
        } else if (loaiCuoc === LOAI_CUOC_GAME.BA_CANG) {
          /// LOOP Chi tiet cuoc
          for (const { so, tienCuoc } of chiTietCuoc) {
            // Thắng
            if (bangKetQua[LOAI_CUOC_GAME.BA_CANG].includes(so)) {
              listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
            }
          }
        } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_2) {
          const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
          const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
          if (bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) && bangKetQua[LOAI_CUOC_GAME.LO].includes(so2)) {
            listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
          }
        } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_3) {
          const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
          const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
          const { so: so3, tienCuoc: tienCuoc3 } = chiTietCuoc[2];
          if (
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) &&
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so2) &&
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so3)
          ) {
            listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
          }
        } else if (loaiCuoc === LOAI_CUOC_GAME.LO_XIEN_4) {
          const { so: so1, tienCuoc: tienCuoc1 } = chiTietCuoc[0];
          const { so: so2, tienCuoc: tienCuoc2 } = chiTietCuoc[1];
          const { so: so3, tienCuoc: tienCuoc3 } = chiTietCuoc[2];
          const { so: so4, tienCuoc: tienCuoc4 } = chiTietCuoc[3];
          if (
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so1) &&
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so2) &&
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so3) &&
            bangKetQua[LOAI_CUOC_GAME.LO].includes(so4)
          ) {
            listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THANG;
          }
        }
      }
      // Các trường hợp còn lại thì update trạng thái thua
      if (listKetQuaCuocUpdate[indexItemCuoc] === STATUS_BET_GAME.DANG_CHO) {
        listKetQuaCuocUpdate[indexItemCuoc] = STATUS_BET_GAME.THUA;
      }

      return listKetQuaCuocUpdate[indexItemCuoc];
    }
    return item.datCuoc[0].trangThai;
  };

  return (
    <>
      <Box
        key={item._id}
        sx={{
          padding: "10px",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              {convertLoaiGame(TYPE_GAME)}
            </Typography>

            {convertJSXTinhTrangBetGameXoSo(convertTrangThaiDatCuoc())}
          </Box>

          <Typography
            sx={{
              color: "#b7b7b7",
              fontSize: "1.2rem",
            }}
          >
            Phiên cược: {TYPE_GAME === LOAI_GAME.XOSOMB ? item.phien.ngay : item.phien.phien}
          </Typography>
          <Box
            sx={{
              color: "#b7b7b7",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
              }}
              component={"div"}
            >
              {convertLoaiCuoc(item.datCuoc[0].loaiCuoc)}: Chọn số{" "}
              {item.datCuoc[0].chiTietCuoc.map(({ so }) => (
                <Typography
                  key={_.uniqueId()}
                  sx={{
                    fontSize: "1.2rem",
                  }}
                  component={"span"}
                >
                  {so}{" "}
                </Typography>
              ))}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-end",
          }}
        >
          <Typography>{convertJSXMoney(item.datCuoc[0].tongTienCuoc)}</Typography>

          <Typography
            sx={{
              color: "#b7b7b7",
              fontSize: "1.2rem",
            }}
          >
            {convertDateTime(item.createdAt)}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default memo(ItemLichSuCuoc);
