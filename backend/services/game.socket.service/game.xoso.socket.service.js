"use strict";

const HeThong = require("../../models/HeThong");

class GameXoSoSocketService {
  constructor({ CONFIG, socket, GAME_DATA }) {
    this.CONFIG = CONFIG;
    this.socket = socket;
    this.GAME_DATA = GAME_DATA;

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:pause-game`, () => {
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      console.log("PAUSE GAME", this.GAME_DATA);
      this.GAME_DATA.setIsPlayGame(false);
    });
    this.socket.on(`${this.CONFIG.KEY_SOCKET}:restart-game`, () => {
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      this.GAME_DATA.setIsPlayGame(true);
    });

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:join-room`, () => {
      this.socket.join(this.CONFIG.ROOM);
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const dataGame = this.GAME_DATA.getDataGame();
      if (!dataGame) {
        return;
      }

      this.CONFIG.METHOD.SEND_ROOM_XOSO({ key: `${this.CONFIG.KEY_SOCKET}:timer`, data: { current_time: dataGame.timer } });
      this.CONFIG.METHOD.SEND_ROOM_XOSO({ key: `${this.CONFIG.KEY_SOCKET}:hienThiPhien`, data: { phien: dataGame.phien } });
      this.CONFIG.METHOD.SEND_ROOM_XOSO({
        key: `${this.CONFIG.KEY_SOCKET}:phienHoanTatMoiNhat`,
        data: { phienHoanTatMoiNhat: dataGame.phienHoanTatMoiNhat },
      });
    });

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:join-room-admin`, () => {
      const { role } = global._io;
      if (role !== "admin") {
        return;
      }
      this.socket.join(this.CONFIG.ADMIN_ROOM);

      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const settingGame = this.GAME_DATA.getSettingGame();
      const dataGame = this.GAME_DATA.getDataGame();

      if (!settingGame || !dataGame) {
        return;
      }

      if (settingGame.IS_MODIFIED_RESULT) {
        this.CONFIG.METHOD.SEND_ROOM_ADMIN_XOSO({
          key: `${this.CONFIG.KEY_SOCKET}:admin:hien-thi-ket-qua-dieu-chinh`,
          data: { ketQua: settingGame.MODIFIED_RESULT, phienHienTai: dataGame.phien },
        });
      }
    });
    this.socket.on(`${this.CONFIG.KEY_SOCKET}:admin:set-ket-qua-dieu-chinh`, (ketQua) => {
      const { role } = global._io;

      if (role !== "admin") {
        return;
      }
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const settingGame = this.GAME_DATA.getSettingGame();
      const dataGame = this.GAME_DATA.getDataGame();

      if (!settingGame || !dataGame) {
        return;
      }
      this.GAME_DATA.setModifiedResult(ketQua);
      this.CONFIG.METHOD.SEND_ROOM_ADMIN_XOSO({
        key: `${this.CONFIG.KEY_SOCKET}:admin:hien-thi-ket-qua-dieu-chinh`,
        data: { ketQua, phienHienTai: dataGame.phien },
      });
    });
    this.socket.on(`${this.CONFIG.KEY_SOCKET}:admin:set-random-ket-qua-dieu-chinh`, () => {
      const { role } = global._io;

      if (role !== "admin") {
        return;
      }
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const settingGame = this.GAME_DATA.getSettingGame();
      const dataGame = this.GAME_DATA.getDataGame();

      if (!settingGame || !dataGame) {
        return;
      }
      this.GAME_DATA.setIsModifiedResult(false);
    });
  }
}

module.exports = GameXoSoSocketService;
