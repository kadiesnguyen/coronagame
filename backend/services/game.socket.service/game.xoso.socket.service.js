"use strict";

const { isAdminSocket } = require("../../utils/socket_auth");
const AdminSocketService = require("../admin.socket.service");

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
      if (!AdminSocketService.exclusiveJoinPlayerRoom(this.socket, this.CONFIG.ROOM)) {
        return;
      }
      AdminSocketService.broadcastGameRoomCounts();
      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const dataGame = this.GAME_DATA.getDataGame();
      if (!dataGame) {
        return;
      }

      this.socket.emit(`${this.CONFIG.KEY_SOCKET}:timer`, { current_time: dataGame.timer });
      this.socket.emit(`${this.CONFIG.KEY_SOCKET}:hienThiPhien`, { phien: dataGame.phien });
      this.socket.emit(`${this.CONFIG.KEY_SOCKET}:phienHoanTatMoiNhat`, {
        phienHoanTatMoiNhat: dataGame.phienHoanTatMoiNhat,
      });
    });

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:leave-room`, () => {
      this.socket.leave(this.CONFIG.ROOM);
      AdminSocketService.broadcastGameRoomCounts();
    });

    this.socket.on(`${this.CONFIG.KEY_SOCKET}:join-room-admin`, () => {
      if (!isAdminSocket(this.socket)) {
        return;
      }
      this.socket.join(this.CONFIG.ADMIN_ROOM);

      if (!this.GAME_DATA) {
        this.socket.disconnect();
        return;
      }
      const settingGameSync = this.GAME_DATA.getSettingGame && this.GAME_DATA.getSettingGame();
      const dataGameSync = this.GAME_DATA.getDataGame();
      if (dataGameSync) {
        this.socket.emit(`${this.CONFIG.KEY_SOCKET}:admin:timer`, {
          current_time: dataGameSync.timer ?? 0,
          phien: dataGameSync.phien,
        });
        this.socket.emit(`${this.CONFIG.KEY_SOCKET}:admin:hienThiPhien`, { phien: dataGameSync.phien });
      }
      // keep original flow below

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
      if (!isAdminSocket(this.socket)) {
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
      if (!isAdminSocket(this.socket)) {
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
