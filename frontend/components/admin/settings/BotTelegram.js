import OutlinedInput from "@/components/input/OutlinedInput";
import { OptionMenu, OptionMenuItem } from "@/custom/optionMenu";
import useGetBotTelegramConfig from "@/hooks/admin/useGetBotTelegramConfig";
import SystemService from "@/services/admin/SystemService";
import { Backdrop, Box, Button, CircularProgress, FormControl, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbBar from "../BreadcrumbBar";

const BreadcrumbsData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
  {
    title: "Cấu hình bot Telegram",
    href: "/admin/settings/telegram",
  },
];
const convertStatusNotify = (status) => {
  if (status) {
    return "Bật";
  }
  return "Đóng";
};
const BotTelegram = () => {
  const { data: dataQuery, isLoading, refetch } = useGetBotTelegramConfig();

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [telegramBotConfigs, setTelegramBotConfigs] = useState(
    dataQuery ?? {
      idReceiveMessage: "",
      botToken: "",
      isGameNotify: true,
      isDepositNotify: true,
      isWithdrawNotify: true,
    }
  );
  useEffect(() => {
    if (dataQuery) {
      setTelegramBotConfigs(dataQuery);
    }
  }, [dataQuery]);

  const handleClickChange = async () => {
    try {
      setIsLoadingState(true);
      const res = await SystemService.updateBotTelegramConfig({
        telegramBotConfigs,
      });
      refetch();
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <BreadcrumbBar data={BreadcrumbsData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Cài đặt Bot Telegram
      </h1>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          maxWidth: "60rem",
          gap: "1rem",
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {isLoadingState && (
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingState}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {isLoading && <CircularProgress color="inherit" />}
        {dataQuery && (
          <>
            <Typography>
              Bước 1: Đầu tiên truy cập vào Bot Father để tạo Bot mới:{" "}
              <a href="https://telegram.me/BotFather" target="_blank">
                Click vào đây
              </a>
            </Typography>
            <Typography>
              Tiếp theo thực hiện tạo bot, sau khi tạo xong sẽ có token, copy token dán vào dưới:
              <img
                src="https://i.imgur.com/0uLaZCQ.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "30rem",
                }}
              />
            </Typography>
            <Typography>
              Bước 2: Dùng tài khoản cá nhân truy cập vào bot vừa tạo, bấm vào Start để Bot có thể gửi tin nhắn đến
              chúng ta
              <br></br>
              <img
                src="https://i.imgur.com/YkWtRy4.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "30rem",
                }}
              />
            </Typography>
            <Typography>
              Bước 3: Truy cập userinfobot{" "}
              <a href="https://t.me/userinfobot" target="_blank">
                (click vào đây)
              </a>
              , sau đó nhắn nội dung bất kỳ, bạn sẽ nhận được thông tin cá nhân của mình, bao gồm ID, dán ID xuống phía
              dưới
              <img
                src="https://i.imgur.com/TAIImpW.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "30rem",
                }}
              />
            </Typography>
            <FormControl fullWidth>
              <Typography>Token của Bot Telegram</Typography>

              <OutlinedInput
                placeholder="Token bot telegram"
                size="small"
                type="text"
                fullWidth
                value={telegramBotConfigs?.botToken ?? ""}
                onChange={(e) => setTelegramBotConfigs((state) => ({ ...state, botToken: e.target.value }))}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography>ID telegram cá nhân để nhận tin nhắn từ BOT</Typography>

              <OutlinedInput
                placeholder="ID telegram cá nhân"
                size="small"
                type="text"
                fullWidth
                value={telegramBotConfigs?.idReceiveMessage ?? ""}
                onChange={(e) => setTelegramBotConfigs((state) => ({ ...state, idReceiveMessage: e.target.value }))}
              />
            </FormControl>

            <FormControl fullWidth>
              <Typography>Bật tắt thông báo game </Typography>
              <Select
                labelId="select-game-notify"
                id="select-game-notify"
                label="Status Game Notify"
                input={<OptionMenu />}
                value={telegramBotConfigs?.isGameNotify}
                onChange={(e) => setTelegramBotConfigs((state) => ({ ...state, isGameNotify: e.target.value }))}
              >
                {[true, false].map((item, i) => (
                  <OptionMenuItem key={item} value={item}>
                    {convertStatusNotify(item)}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography>Bật tắt thông báo nạp tiền </Typography>
              <Select
                labelId="select-deposit-notify"
                id="select-deposit-notify"
                label="Status deposit Notify"
                input={<OptionMenu />}
                value={telegramBotConfigs?.isDepositNotify}
                onChange={(e) => setTelegramBotConfigs((state) => ({ ...state, isDepositNotify: e.target.value }))}
              >
                {[true, false].map((item, i) => (
                  <OptionMenuItem key={item} value={item}>
                    {convertStatusNotify(item)}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography>Bật tắt thông báo rút tiền </Typography>
              <Select
                labelId="select-withdraw-notify"
                id="select-withdraw-notify"
                label="Status withdraw Notify"
                input={<OptionMenu />}
                value={telegramBotConfigs?.isWithdrawNotify}
                onChange={(e) => setTelegramBotConfigs((state) => ({ ...state, isWithdrawNotify: e.target.value }))}
              >
                {[true, false].map((item, i) => (
                  <OptionMenuItem key={item} value={item}>
                    {convertStatusNotify(item)}
                  </OptionMenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={handleClickChange}>Lưu thay đổi</Button>
          </>
        )}
      </Box>
    </>
  );
};
export default BotTelegram;
