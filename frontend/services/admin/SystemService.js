import api from "@/configs/axios";
class SystemService {
  static getBotTelegramConfig = async () => {
    const res = await api.get(`/v1/admin/he-thong/bot-telegram`);
    return res;
  };
  static getTawkToConfig = async () => {
    const res = await api.get(`/v1/admin/he-thong/tawk-to`);
    return res;
  };

  static updateBotTelegramConfig = async ({ telegramBotConfigs }) => {
    const res = await api.put(`/v1/admin/he-thong/bot-telegram`, {
      telegramBotConfigs,
    });
    return res;
  };
  static updateTawkToConfig = async ({ tawkToConfigs }) => {
    const res = await api.put(`/v1/admin/he-thong/tawk-to`, {
      tawkToConfigs,
    });
    return res;
  };
}

export default SystemService;
