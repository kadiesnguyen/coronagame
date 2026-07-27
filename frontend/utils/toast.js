/**
 * Drop-in thay react-toastify → Dialog popup.
 * Dùng globalThis để tránh Next.js tách 2 bản module (handler null → không hiện gì).
 */
const HANDLER_KEY = "__corona_toast_handler__";
const QUEUE_KEY = "__corona_toast_queue__";

const getHandler = () => {
  if (typeof globalThis === "undefined") return null;
  return globalThis[HANDLER_KEY] || null;
};

const getQueue = () => {
  if (typeof globalThis === "undefined") return [];
  if (!Array.isArray(globalThis[QUEUE_KEY])) globalThis[QUEUE_KEY] = [];
  return globalThis[QUEUE_KEY];
};

export const registerToastHandler = (fn) => {
  if (typeof globalThis === "undefined") return;
  globalThis[HANDLER_KEY] = typeof fn === "function" ? fn : null;
  if (typeof fn === "function") {
    const queue = getQueue();
    while (queue.length) {
      fn(queue.shift());
    }
  }
};

const normalizeMessage = (message) => {
  if (typeof message === "string") return message.trim();
  if (message && typeof message === "object") {
    const m = message.message ?? message.msg ?? message.title;
    if (typeof m === "string" && m.trim()) return m.trim();
  }
  return "";
};

const show = (type, message) => {
  const text = normalizeMessage(message) || (type === "success" ? "Thành công" : type === "error" ? "Có lỗi xảy ra" : "Thông báo");
  const payload = { type, message: text };
  const handler = getHandler();
  if (handler) {
    handler(payload);
    return;
  }
  getQueue().push(payload);
};

const toast = (message) => show("info", message);
toast.success = (message) => show("success", message);
toast.error = (message) => show("error", message);
toast.info = (message) => show("info", message);
toast.warn = (message) => show("info", message);
toast.warning = (message) => show("info", message);

export default toast;
export { toast };
