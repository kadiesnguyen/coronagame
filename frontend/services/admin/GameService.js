import api from "@/configs/axios";
class GameService {
  static getTiLeGame = async ({ typeGame }) => {
    const res = await api.get(`/v1/admin/games/${typeGame}/ti-le`);
    return res;
  };
  static setTiLeGame = async ({ tiLe, typeGame }) => {
    const res = await api.post(`/v1/admin/games/${typeGame}/ti-le`, {
      tiLe,
    });
    return res;
  };
  static getStatusAutoGame = async ({ typeGame }) => {
    const res = await api.get(`/v1/admin/games/${typeGame}/autogame`);
    return res;
  };
  static setStatusAutoGame = async ({ isAutoGame, typeGame }) => {
    const res = await api.post(`/v1/admin/games/${typeGame}/autogame`, {
      autoGame: isAutoGame,
    });
    return res;
  };
  static getCountAllGame = async ({ typeGame, searchValue }) => {
    const res = await api.get(`/v1/admin/games/${typeGame}/lich-su/get-so-luong-phien-game?query=${searchValue}`);
    return res;
  };
  static getDetailedBetGameHistory = async ({ typeGame, id }) => {
    const res = await api.get(`/v1/admin/games/${typeGame}/lich-su/lich-su-cuoc/${id}`);
    return res;
  };
  static getDetailedGameHistory = async ({ typeGame, id }) => {
    const res = await api.get(`/v1/admin/games/${typeGame}/${id}`);
    return res;
  };
  static getGameHistory = async ({ typeGame, pageSize, page, searchValue }) => {
    const res = await api.get(
      `/v1/admin/games/${typeGame}/lich-su?results=${pageSize}&page=${page}&query=${searchValue}`
    );
    return res;
  };
}

export default GameService;
