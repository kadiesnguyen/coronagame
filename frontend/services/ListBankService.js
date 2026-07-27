import api from "@/configs/axios";
class ListBankService {
  static getListUserBank = async () => {
    const res = await api.get(`/v1/lienketnganhang`);
    return res;
  };

  static addUserBank = async ({ tenNganHang, bankCode, tenChuTaiKhoan, soTaiKhoan }) => {
    const res = await api.post(`/v1/lienketnganhang`, {
      tenNganHang,
      bankCode,
      tenChuTaiKhoan,
      soTaiKhoan,
    });
    return res;
  };
}

export default ListBankService;
