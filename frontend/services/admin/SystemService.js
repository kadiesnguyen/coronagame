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
  static getVipLevelsConfig = async () => {
    const res = await api.get(`/v1/admin/he-thong/vip-levels`);
    return res;
  };
  static updateVipLevelsConfig = async ({ vipLevels }) => {
    const res = await api.put(`/v1/admin/he-thong/vip-levels`, { vipLevels });
    return res;
  };
  static getBrandingConfig = async () => {
    const res = await api.get(`/v1/admin/he-thong/branding`);
    return res;
  };
  static updateBrandingConfig = async ({ logoUrl, banners }) => {
    const res = await api.put(`/v1/admin/he-thong/branding`, { logoUrl, banners });
    return res;
  };
  static uploadBrandingAsset = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/v1/admin/he-thong/branding/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };
  static listMediaLibrary = async () => {
    const res = await api.get(`/v1/admin/he-thong/media`);
    return res;
  };
  static uploadMediaAsset = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/v1/admin/he-thong/media/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };
}

export default SystemService;
