const { STATUS_GAME } = require("../configs/game.xoso");

class XoSoGameState {
  constructor() {
    this.state = {
      _id: null,
      phien: 0,
      tinhTrang: STATUS_GAME.DANG_CHO,
      timer: null,
      ketQua: [],
      phienHoanTatMoiNhat: null,
    };

    this.subscribers = new Set();
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
module.exports = XoSoGameState;
