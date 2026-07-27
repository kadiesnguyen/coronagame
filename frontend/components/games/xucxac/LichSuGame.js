import SocketContext from "@/context/socket";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Button } from "@mui/material";
import { useContext, useEffect } from "react";

import { GAME_HISTORY_PAGE_SIZE } from "@/configs/game.xucxac.config";
import useGetGameHistory from "@/hooks/useGetGameHistory";
import { Bars } from "react-loading-icons";

const LichSuGame = ({ TYPE_GAME }) => {
  const {
    data: listLichSuGame,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetGameHistory({ typeGame: TYPE_GAME, pageSize: GAME_HISTORY_PAGE_SIZE });
  const listLichSu = listLichSuGame ?? [];

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room`);
      socket.on(`${TYPE_GAME}:ketQuaPhienHienTai`, (data) => {
        refetch();
      });
      return () => {
        socket.off(`${TYPE_GAME}:ketQuaPhienHienTai`);
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
            <div className="award_tb box-ketqua">
              <table>
                <thead style={{ textAlign: "center" }}>
                  <tr>
                    <td>Phiên số</td>
                    <td>Kết quả</td>
                    <td>Thời gian</td>
                  </tr>
                </thead>
                <tbody>
                  {listLichSu.map((item, i) => (
                    <tr key={item.phien}>
                      <td>{item.phien}</td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        {item.ketQua.map((item, i) => (
                          <div className={`xucxac${item}`} key={i}></div>
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
export default LichSuGame;
