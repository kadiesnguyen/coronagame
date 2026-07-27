import { TINH_TRANG_LIST_BANK } from "@/configs/bank.config";
import { TINH_TRANG_DEPOSIT_HISTORY } from "@/configs/deposit.config";
import {
  STATUS_BET_GAME as STATUS_BET_GAME_KENO,
  TINH_TRANG_GAME as TINH_TRANG_GAME_KENO,
} from "@/configs/game.keno.config";
import {
  STATUS_BET_GAME as STATUS_BET_GAME_XOCDIA,
  TINH_TRANG_GAME as TINH_TRANG_GAME_XOCDIA,
} from "@/configs/game.xocdia.config";
import {
  STATUS_BET_GAME as STATUS_BET_GAME_XOSO,
  TINH_TRANG_GAME as TINH_TRANG_GAME_XOSO,
} from "@/configs/game.xoso.config";
import {
  STATUS_BET_GAME as STATUS_BET_GAME_XUCXAC,
  TINH_TRANG_GAME as TINH_TRANG_GAME_XUCXAC,
} from "@/configs/game.xucxac.config";
import { TINH_TRANG_USER } from "@/configs/user.config";
import { TINH_TRANG_WITHDRAW_HISTORY } from "@/configs/withdraw.config";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StatusButton = styled(Box)(({ theme }) => ({
  padding: "2px 5px",
  borderRadius: "5px",
  display: "inline-block",
  "& p": {
    color: theme.palette.text.primary,
  },
}));

const convertTinhTrang = (tinhTrang) => {
  if (tinhTrang === "dangCho") {
    return (
      <StatusButton
        sx={{
          backgroundColor: "#ffc200",
        }}
      >
        <Typography>Đang chờ</Typography>
      </StatusButton>
    );
  }
  if (tinhTrang === "hoanTat") {
    return (
      <StatusButton
        sx={{
          backgroundColor: "#6fe26f",
        }}
      >
        <Typography>Hoàn tất</Typography>
      </StatusButton>
    );
  }
  if (tinhTrang === "daHuy") {
    return (
      <StatusButton
        sx={{
          backgroundColor: "#b12424",
        }}
      >
        <Typography>Đã hủy</Typography>
      </StatusButton>
    );
  }
};
export const convertJSXTinhTrangGameKeno = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangGameKeno(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangGameKeno(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertJSXTinhTrangGameXucXac = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangGameXucXac(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangGameXucXac(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertJSXTinhTrangGameXocDia = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangGameXocDia(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangGameXocDia(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertJSXTinhTrangGameXoSo = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangGameXoSo(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangGameXoSo(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertJSXTinhTrangBetGameXoSo = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangKetQuaBetGameXoSo(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangKetQuaBetGameXoSo(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertTinhTrangGameKeno = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_KENO.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_GAME_KENO.DANG_QUAY:
      return "Đang quay";
    case TINH_TRANG_GAME_KENO.DANG_TRA_THUONG:
      return "Đang trả thưởng";
    case TINH_TRANG_GAME_KENO.HOAN_TAT:
      return "Hoàn tất";
    default:
      return "";
  }
};
export const convertTinhTrangGameXucXac = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XUCXAC.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_GAME_XUCXAC.DANG_QUAY:
      return "Đang quay";
    case TINH_TRANG_GAME_XUCXAC.DANG_TRA_THUONG:
      return "Đang trả thưởng";
    case TINH_TRANG_GAME_XUCXAC.HOAN_TAT:
      return "Hoàn tất";
    default:
      return "";
  }
};
export const convertTinhTrangGameXoSo = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XOSO.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_GAME_XOSO.DANG_QUAY:
      return "Đang quay";
    case TINH_TRANG_GAME_XOSO.DANG_TRA_THUONG:
      return "Đang trả thưởng";
    case TINH_TRANG_GAME_XOSO.HOAN_TAT:
      return "Hoàn tất";
    default:
      return "";
  }
};
export const convertTinhTrangGameXocDia = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XOCDIA.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_GAME_XOCDIA.CHUAN_BI_QUAY:
      return "Chuẩn bị xóc";
    case TINH_TRANG_GAME_XOCDIA.DANG_QUAY:
      return "Đang xóc";
    case TINH_TRANG_GAME_XOCDIA.DANG_TRA_THUONG:
      return "Đang trả thưởng";
    case TINH_TRANG_GAME_XOCDIA.HOAN_TAT:
      return "Hoàn tất";
    default:
      return "";
  }
};

export const convertMaMauTinhTrangGameKeno = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_KENO.DANG_CHO:
      return "#ffc200";
    case TINH_TRANG_GAME_KENO.DANG_QUAY:
      return "#2b2929";
    case TINH_TRANG_GAME_KENO.DANG_TRA_THUONG:
      return "#eb199f";
    case TINH_TRANG_GAME_KENO.HOAN_TAT:
      return "#6fe26f";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangGameXucXac = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XUCXAC.DANG_CHO:
      return "#ffc200";
    case TINH_TRANG_GAME_XUCXAC.DANG_QUAY:
      return "#2b2929";
    case TINH_TRANG_GAME_XUCXAC.DANG_TRA_THUONG:
      return "#eb199f";
    case TINH_TRANG_GAME_XUCXAC.HOAN_TAT:
      return "#6fe26f";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangGameXoSo = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XOSO.DANG_CHO:
      return "#ffc200";
    case TINH_TRANG_GAME_XOSO.DANG_QUAY:
      return "#2b2929";
    case TINH_TRANG_GAME_XOSO.DANG_TRA_THUONG:
      return "#eb199f";
    case TINH_TRANG_GAME_XOSO.HOAN_TAT:
      return "#6fe26f";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangGameXocDia = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_GAME_XOCDIA.DANG_CHO:
      return "#ffc200";
    case TINH_TRANG_GAME_XOCDIA.CHUAN_BI_QUAY:
      return "#33c6ff";
    case TINH_TRANG_GAME_XOCDIA.DANG_QUAY:
      return "#2b2929";
    case TINH_TRANG_GAME_XOCDIA.DANG_TRA_THUONG:
      return "#eb199f";
    case TINH_TRANG_GAME_XOCDIA.HOAN_TAT:
      return "#6fe26f";
    default:
      return "";
  }
};

export const convertJSXTinhTrangUser = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangUser(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangUser(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertTinhTrangUser = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_USER.TRUE:
      return "Đang sử dụng";
    case TINH_TRANG_USER.FALSE:
      return "Ngưng sử dụng";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangUser = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_USER.TRUE:
      return "#7fd7b0";
    case TINH_TRANG_USER.FALSE:
      return "#ef6d6d";
    default:
      return "";
  }
};
export const convertJSXTinhTrangListBank = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangListBank(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangListBank(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertTinhTrangListBank = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_LIST_BANK.TRUE:
      return "Hoạt động";
    case TINH_TRANG_LIST_BANK.FALSE:
      return "Ngưng hoạt động";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangListBank = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_LIST_BANK.TRUE:
      return "#7fd7b0";
    case TINH_TRANG_LIST_BANK.FALSE:
      return "#ef6d6d";
    default:
      return "";
  }
};
export const convertJSXTinhTrangDepositHistory = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangDepositHistory(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangDepositHistory(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export const convertTinhTrangDepositHistory = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_DEPOSIT_HISTORY.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_DEPOSIT_HISTORY.HOAN_TAT:
      return "Hoàn tất";
    case TINH_TRANG_DEPOSIT_HISTORY.DA_HUY:
      return "Đã hủy";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangDepositHistory = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_DEPOSIT_HISTORY.HOAN_TAT:
      return "#7fd7b0";
    case TINH_TRANG_DEPOSIT_HISTORY.DA_HUY:
      return "#ef6d6d";
    case TINH_TRANG_DEPOSIT_HISTORY.DANG_CHO:
      return "#ffc200";
    default:
      return "";
  }
};
export const convertTinhTrangKetQuaBetGameKeno = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_KENO.DANG_CHO:
      return "Đang chờ";
    case STATUS_BET_GAME_KENO.THANG:
      return "Thắng";
    case STATUS_BET_GAME_KENO.THUA:
      return "Thua";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangKetQuaBetGameKeno = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_KENO.DANG_CHO:
      return "#0f0f0f";
    case STATUS_BET_GAME_KENO.THANG:
      return "#32c977";
    case STATUS_BET_GAME_KENO.THUA:
      return "#f23c3c";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangKetQuaBetGameXocDia = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XOCDIA.DANG_CHO:
      return "#c1e4ff";
    case STATUS_BET_GAME_XOCDIA.THANG:
      return "#32c977";
    case STATUS_BET_GAME_XOCDIA.THUA:
      return "#f23c3c";
    default:
      return "";
  }
};
export const convertTinhTrangKetQuaBetGameXocDia = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XOCDIA.DANG_CHO:
      return "Đang chờ";
    case STATUS_BET_GAME_XOCDIA.THANG:
      return "Thắng";
    case STATUS_BET_GAME_XOCDIA.THUA:
      return "Thua";
    default:
      return "";
  }
};
export const convertTinhTrangKetQuaBetGameXucXac = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XUCXAC.DANG_CHO:
      return "Đang chờ";
    case STATUS_BET_GAME_XUCXAC.THANG:
      return "Thắng";
    case STATUS_BET_GAME_XUCXAC.THUA:
      return "Thua";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangKetQuaBetGameXucXac = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XUCXAC.DANG_CHO:
      return "#0f0f0f";
    case STATUS_BET_GAME_XUCXAC.THANG:
      return "#32c977";
    case STATUS_BET_GAME_XUCXAC.THUA:
      return "#f23c3c";
    default:
      return "";
  }
};
export const convertTinhTrangKetQuaBetGameXoSo = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XOSO.DANG_CHO:
      return "Đang chờ";
    case STATUS_BET_GAME_XOSO.THANG:
      return "Thắng";
    case STATUS_BET_GAME_XOSO.THUA:
      return "Thua";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangKetQuaBetGameXoSo = (tinhTrang) => {
  switch (tinhTrang) {
    case STATUS_BET_GAME_XOSO.DANG_CHO:
      return "#0f0f0f";
    case STATUS_BET_GAME_XOSO.THANG:
      return "#32c977";
    case STATUS_BET_GAME_XOSO.THUA:
      return "#f23c3c";
    default:
      return "";
  }
};
export const convertTinhTrangWithdrawHistory = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_WITHDRAW_HISTORY.DANG_CHO:
      return "Đang chờ";
    case TINH_TRANG_WITHDRAW_HISTORY.HOAN_TAT:
      return "Hoàn tất";
    case TINH_TRANG_WITHDRAW_HISTORY.DA_HUY:
      return "Đã hủy";
    default:
      return "";
  }
};
export const convertMaMauTinhTrangWithdrawHistory = (tinhTrang) => {
  switch (tinhTrang) {
    case TINH_TRANG_WITHDRAW_HISTORY.HOAN_TAT:
      return "#7fd7b0";
    case TINH_TRANG_WITHDRAW_HISTORY.DA_HUY:
      return "#ef6d6d";
    case TINH_TRANG_WITHDRAW_HISTORY.DANG_CHO:
      return "#ffc200";
    default:
      return "";
  }
};
export const convertJSXTinhTrangWithdrawHistory = (tinhTrang) => {
  return (
    <StatusButton
      sx={{
        backgroundColor: convertMaMauTinhTrangWithdrawHistory(tinhTrang),
      }}
    >
      <Typography>{convertTinhTrangWithdrawHistory(tinhTrang)}</Typography>
    </StatusButton>
  );
};
export default convertTinhTrang;
