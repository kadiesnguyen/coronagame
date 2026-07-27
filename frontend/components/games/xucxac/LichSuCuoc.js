import { USER_BET_GAME_HISTORY_PAGE_SIZE } from "@/configs/game.xucxac.config";
import SocketContext from "@/context/socket";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import {
  convertMaMauTinhTrangKetQuaBetGameXucXac,
  convertTinhTrangKetQuaBetGameXucXac,
} from "@/utils/convertTinhTrang";
import { convertChiTietCuoc } from "@/utils/xucxac";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { Bars } from "react-loading-icons";

const LichSuCuoc = ({ TYPE_GAME }) => {
  const {
    data: listLichSuGame,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUserBetHistory({ typeGame: TYPE_GAME, pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE });
  const listLichSu = listLichSuGame ?? [];

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room`);
      socket.on(`${TYPE_GAME}:update-lich-su-cuoc-ca-nhan`, (data) => {
        refetch();
      });
      return () => {
        socket.off(`${TYPE_GAME}:update-lich-su-cuoc-ca-nhan`);
      };
    }
  }, [socket]);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Bars fill="red" width={50} height={50} speed={0.75} />
        </Box>
      )}
      {!isLoading && listLichSu && (
        <Box
          sx={{
            borderRadius: "2rem",
            padding: { xs: "1rem", md: "2rem" },
            marginTop: "1rem",

            backgroundColor: "background.default",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <div className="tab-content">
            <div className="award_tb">
              <table>
                <thead style={{ textAlign: "center" }}>
                  <tr>
                    <td>Phiên số</td>
                    <td>Nội dung</td>
                    <td>Thời gian</td>
                  </tr>
                </thead>
                <tbody>
                  {listLichSu.map((item, i) => (
                    <tr key={item.phien.phien}>
                      <td>{item.phien.phien}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",

                          flexDirection: "column",
                        }}
                      >
                        {item.datCuoc.map((item, i) => (
                          <Typography
                            key={i}
                            sx={{
                              fontSize: "1.2rem",
                            }}
                          >
                            {convertChiTietCuoc({ chiTietCuoc: item.chiTietCuoc, loaiCuoc: item.loaiCuoc })} -{" "}
                            {convertJSXMoney(item.tienCuoc)} -{" "}
                            <span
                              style={{
                                color: convertMaMauTinhTrangKetQuaBetGameXucXac(item.trangThai),
                              }}
                            >
                              {convertTinhTrangKetQuaBetGameXucXac(item.trangThai)}
                            </span>
                          </Typography>
                        ))}
                      </td>
                      <td>{convertDateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {isFetchingNextPage && (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Bars fill="red" width={50} height={50} speed={0.75} />
            </Box>
          )}
          {hasNextPage && (
            <Button
              onClick={fetchNextPage}
              sx={{
                pointerEvents: isFetchingNextPage ? "none" : "",
                opacity: isFetchingNextPage ? "0.8" : 1,
              }}
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </Button>
          )}
        </Box>
      )}
    </>
  );
};
export default LichSuCuoc;
