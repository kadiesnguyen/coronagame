import { USER_BET_GAME_HISTORY_PAGE_SIZE } from "@/configs/game.xoso.config";
import SocketContext from "@/context/socket";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import { Box, Button } from "@mui/material";
import { memo, useContext, useEffect } from "react";
import { Bars } from "react-loading-icons";
import Modal from "../../homePage/Modal";
import ItemLichSuCuoc from "./ItemLichSuCuoc";
const BangKetQua = ({ TYPE_GAME, isModal, setIsModal }) => {
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

  useEffect(() => {
    if (isModal) {
      refetch();
    }
  }, [isModal]);

  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Lịch sử tham gia"}>
        {listLichSu.map((item) => (
          <ItemLichSuCuoc key={item._id} item={item} TYPE_GAME={TYPE_GAME} />
        ))}

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
          <Box
            sx={{
              paddingTop: "1rem",
              textAlign: "center",
            }}
          >
            <Button
              onClick={fetchNextPage}
              sx={{
                pointerEvents: isFetchingNextPage ? "none" : "",
                opacity: isFetchingNextPage ? "0.8" : 1,
              }}
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </Button>
          </Box>
        )}
      </Modal>
    </>
  );
};
export default memo(BangKetQua);
