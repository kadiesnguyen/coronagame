import api from "@/configs/axios";
class GameService {
  static createDatCuoc = async ({ typeGame, data = {} }) => {
    const res = await api.post(`/v1/games/${typeGame}`, data);
    return res;
  };
  static getTiLeGame = async ({ typeGame }) => {
    const res = await api.get(`/v1/games/${typeGame}/ti-le`);
    return res;
  };
  static getDetailedUserBetGameHistory = async ({ typeGame, phien }) => {
    const res = await api.get(`/v1/games/${typeGame}/lich-su/lich-su-cuoc/${phien}`);
    return res;
  };
  static getUserBetHistory = async ({ typeGame, pageSize, page }) => {
    const res = await api.get(`/v1/games/${typeGame}/lich-su/lich-su-cuoc?results=${pageSize}&page=${page}`);
    return res;
  };

  static getGameHistory = async ({ typeGame, pageSize, page, searchValue }) => {
    const res = await api.get(`/v1/games/${typeGame}/lich-su?results=${pageSize}&page=${page}&query=${searchValue}`);
    return res;
  };
}

export default GameService;
