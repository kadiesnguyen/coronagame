import { TINH_TRANG_GAME, TYPE_CUOC_CHAN, TYPE_CUOC_LE } from "@/configs/game.xocdia.config";
import SocketContext from "@/context/socket";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { uniqueId } from "lodash";
import { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const BoxContainer = styled(Box)(({ theme }) => ({
  bottom: "-3rem",
  display: "block",
  height: "20rem",
  left: "-1.5rem",
  margin: "auto",
  position: "relative",
  width: "22rem",
  "& img": {
    height: "auto",
    maxWidth: "100%",
  },
  "& .disc, .bowl": {
    position: "absolute",
  },
  "& .bowl": {
    WebkitAnimation: "movePoint 4s forwards",
    animation: "movePoint 4s forwards",
    height: "13rem",
    zIndex: 3,
  },
  "& .disc": {
    WebkitFilter: "drop-shadow(2px 4px 6px #000)",
    filter: "drop-shadow(2px 4px 6px black)",
    opacity: 0.7,
    right: "-2.5rem",
    top: "2.2rem",
    width: "22rem",
    zIndex: 1,
  },
  "& .result-dia": {
    fontSize: "1.3rem",
    "&>div": {
      left: "11rem",
      position: "absolute",
      top: "5rem",
      zIndex: 2,
      "&:nth-of-type(2)": { left: "9.5rem", top: "7rem" },
      "&:nth-of-type(3)": { left: "14rem", top: "6rem" },
      "&:nth-of-type(4)": { left: "12.5rem", top: "8rem" },
    },
  },

  "& .history_xucsac": {
    "&>.a0,.a1": {
      display: "inline-block",
      height: "1.425em",
      width: "1.425em",
    },
    "&>.a0": {
      backgroundImage: "url(/assets/images/xocdia_assets.png)",
      backgroundPositionX: "-4.631em",
      backgroundPositionY: "-.356em",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 6.483em",
    },
    "&>.a1": {
      backgroundImage: "url(/assets/images/xocdia_assets.png)",
      backgroundPositionX: "-2.493em",
      backgroundPositionY: "-0.356em",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 6.483em",
    },
  },
}));
const BoxQuay = ({
  TYPE_GAME,
  tinhTrang,
  ketQua,
  setIsDieuChinh,
  ketQuaDieuChinh,
  setKetQuaDieuChinh,
  isDieuChinh,
}) => {
  const [ketQuaDieuChinhTam, setKetQuaDieuChinhTam] = useState(ketQuaDieuChinh);
  const { socket } = useContext(SocketContext);
  const [chonTruocKetQua, setChonTruocKetQua] = useState({
    isTrigger: false,
    position: 0,
  });
  useEffect(() => {
    if (!chonTruocKetQua.isTrigger) {
      setKetQuaDieuChinhTam(ketQuaDieuChinh);
    }
  }, [ketQuaDieuChinh, chonTruocKetQua]);
  useEffect(() => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      setChonTruocKetQua({ isTrigger: false });
    }
  }, [tinhTrang]);

  const handleClickOpenBangChonTruocKetQua = () => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      return;
    }

    setChonTruocKetQua({ isTrigger: true });
  };
  const handleClickChonTruocKetQua = (ketQua) => {
    if (tinhTrang !== TINH_TRANG_GAME.DANG_CHO) {
      return;
    }

    setKetQuaDieuChinhTam(ketQua);
  };

  const handleClickConfirmDieuChinhKetQua = (ketQuaDieuChinh) => {
    const checkValidDice = ketQuaDieuChinh.filter((item) => item < 0 || item > 1);

    if (checkValidDice.length > 0) {
      toast.error("Vui lòng chọn kết quả hợp lệ");
      return;
    }
    if (socket) {
      socket.emit(`${TYPE_GAME}:admin:set-ket-qua-dieu-chinh`, ketQuaDieuChinh);
      setKetQuaDieuChinh(ketQuaDieuChinh);
      toast.success("Điều chỉnh thành công");
      setChonTruocKetQua((prev) => ({ ...prev, isTrigger: false }));
    }
  };
  const handleClickResetDieuChinhKetQua = () => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:admin:set-random-ket-qua-dieu-chinh`);
      toast.success("Điều chỉnh thành công");
      setChonTruocKetQua((prev) => ({ ...prev, isTrigger: false }));
      setKetQuaDieuChinh([0, 0, 0, 0]);
    }
  };

  const convertKetQua = (index) => {
    return ketQua[index];
  };

  return (
    <>
      {isDieuChinh && (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography>Kết quả điều chỉnh</Typography>
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              fontSize: "1.5rem",
              justifyContent: "center",
            }}
            className="history_xucsac"
          >
            {ketQuaDieuChinhTam.map((item, i) => (
              <div className={`a${item}`} key={i}></div>
            ))}
          </Box>
        </Box>
      )}

      <BoxContainer className="boxdia">
        <img
          alt=""
          src="/assets/images/dia-up.png"
          className="bowl"
          style={{
            animation:
              tinhTrang === TINH_TRANG_GAME.DANG_CHO
                ? `1s ease 0s 1 normal forwards running movePoint`
                : tinhTrang === TINH_TRANG_GAME.CHUAN_BI_QUAY
                ? `4s ease 0s 1 normal forwards running movePointBack`
                : tinhTrang === TINH_TRANG_GAME.DANG_QUAY
                ? `4s ease 0s 1 normal forwards running shake`
                : tinhTrang === TINH_TRANG_GAME.DANG_TRA_THUONG
                ? `1s ease 0s 1 normal forwards running movePoint`
                : `1s ease 0s 1 normal forwards running movePoint`,
          }}
        />
        <img
          alt=""
          className="disc"
          src="/assets/images/dia-ngua.png"
          style={{
            animation: tinhTrang === TINH_TRANG_GAME.DANG_QUAY ? `4s ease 0s 1 normal forwards running shake1` : null,
          }}
        />
        <div className="history_xucsac result-dia">
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              onClick={() => handleClickOpenBangChonTruocKetQua(index)}
              className={`a${convertKetQua(index)}`}
            ></Box>
          ))}
        </div>
      </BoxContainer>
      {!chonTruocKetQua.isTrigger && (
        <Button
          sx={{
            cursor: tinhTrang === TINH_TRANG_GAME.DANG_CHO ? "pointer" : "default",
            display: tinhTrang === TINH_TRANG_GAME.DANG_CHO ? "block" : "none",
          }}
          onClick={() => handleClickOpenBangChonTruocKetQua()}
        >
          Mở bảng chọn kết quả
        </Button>
      )}

      {chonTruocKetQua.isTrigger && (
        <>
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Bảng chọn trước kết quả:
          </Typography>

          <Typography>Chẵn: </Typography>

          {TYPE_CUOC_CHAN.map((item, index) => (
            <td
              onClick={() => handleClickChonTruocKetQua(item)}
              className="history_xucsac"
              key={uniqueId()}
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.5rem",
                cursor: "pointer",
                outline: ketQuaDieuChinhTam === item ? "2px solid red" : null,
                borderRadius: "2px",
              }}
            >
              {item.map((bi) => (
                <div key={uniqueId()} className={`a${bi}`}></div>
              ))}
            </td>
          ))}
          <Typography>Lẻ: </Typography>
          {TYPE_CUOC_LE.map((item, index) => (
            <td
              onClick={() => handleClickChonTruocKetQua(item)}
              className="history_xucsac"
              key={uniqueId()}
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.5rem",
                cursor: "pointer",
                outline: ketQuaDieuChinhTam === item ? "2px solid red" : null,
                borderRadius: "2px",
              }}
            >
              {item.map((bi) => (
                <div key={uniqueId()} className={`a${bi}`}></div>
              ))}
            </td>
          ))}

          <Button
            onClick={() => handleClickConfirmDieuChinhKetQua(ketQuaDieuChinhTam)}
            sx={{
              marginTop: "10px",
            }}
          >
            Xác nhận
          </Button>
          <Button
            onClick={() => {
              setChonTruocKetQua((prev) => ({ ...prev, isTrigger: false }));
            }}
            sx={{
              marginTop: "10px",
            }}
          >
            Thoát
          </Button>
          <Button
            onClick={() => {
              handleClickResetDieuChinhKetQua();
              setIsDieuChinh(false);
            }}
            sx={{
              marginTop: "10px",
            }}
          >
            Bật random kết quả
          </Button>
        </>
      )}
    </>
  );
};
export default memo(BoxQuay);
