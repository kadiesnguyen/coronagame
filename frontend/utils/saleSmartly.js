/** SaleSmartly — script trong <body> (_document); bubble chỉ hiện trên /contact. */

export const DEFAULT_SALESMARTLY_SRC =
  "https://plugin-code.salesmartly.com/js/project_787640_815005_1785157395.js";

export const DEFAULT_SALESMARTLY_SCRIPT = `<script src="${DEFAULT_SALESMARTLY_SRC}"></script>`;

const CSKH_BODY_CLASS = "corona-cskh-active";

export function isSaleSmartlyConfig(raw) {
  return /salesmartly\.com/i.test(String(raw || ""));
}

export function extractSaleSmartlySrc(raw) {
  const s = String(raw || "").trim();
  if (!s) return DEFAULT_SALESMARTLY_SRC;
  const fromAttr = s.match(/plugin-code\.salesmartly\.com\/js\/[^"'>\s]+\.js/i);
  if (fromAttr) return `https://${fromAttr[0].replace(/^https?:\/\//i, "")}`;
  if (/^https?:\/\/plugin-code\.salesmartly\.com\/js\/.+\.js$/i.test(s)) return s;
  return isSaleSmartlyConfig(s) ? s.match(/https?:\/\/[^\s"'<>]+/i)?.[0] || DEFAULT_SALESMARTLY_SRC : null;
}

function hasSsqStub() {
  if (typeof window === "undefined") return false;
  const ssq = window.ssq;
  return typeof ssq === "function" && typeof ssq.push === "function";
}

/** Hiện/ẩn bubble. Không chatClose trên home — Detect cần widget vẫn "active". */
export function setCskhPageActive(active) {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(CSKH_BODY_CLASS, !!active);
  window.__ssc = window.__ssc || {};
  window.__ssc.setting = Object.assign({}, window.__ssc.setting || {}, { hideIcon: !active });
}

function pushChatOpen() {
  if (!hasSsqStub()) return;
  try {
    window.ssq.push("chatOpen");
  } catch {
    /* ignore */
  }
}

function pushChatClose() {
  if (!hasSsqStub()) return;
  try {
    window.ssq.push("chatClose");
  } catch {
    /* ignore */
  }
}

/** Script đã nằm trong _document — chỉ chờ ssq sẵn sàng. */
export function ensureSaleSmartlyLoaded() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (hasSsqStub()) return Promise.resolve(true);

  return new Promise((resolve) => {
    let ticks = 0;
    const t = setInterval(() => {
      ticks += 1;
      if (hasSsqStub()) {
        clearInterval(t);
        resolve(true);
        return;
      }
      if (ticks >= 40) {
        clearInterval(t);
        resolve(false);
      }
    }, 100);
  });
}

/** Bật CSKH page: hiện widget + mở cửa sổ chat. */
export function openSaleSmartlyChat() {
  if (typeof window === "undefined") return Promise.resolve(false);

  setCskhPageActive(true);

  return ensureSaleSmartlyLoaded().then((ok) => {
    if (!ok) return false;

    return new Promise((resolve) => {
      let finished = false;
      let poll;
      const finish = (val) => {
        if (finished) return;
        finished = true;
        if (poll) clearInterval(poll);
        resolve(val);
      };

      const attempt = () => {
        setCskhPageActive(true);
        pushChatOpen();
      };

      window.ssq.push("onReady", () => {
        attempt();
        setTimeout(attempt, 200);
        setTimeout(attempt, 600);
      });

      let ticks = 0;
      poll = setInterval(() => {
        ticks += 1;
        attempt();
        if (ticks >= 20) finish(true);
      }, 400);

      setTimeout(attempt, 100);
      setTimeout(attempt, 500);
      setTimeout(attempt, 1200);
      setTimeout(() => finish(true), 9000);
    });
  });
}

/**
 * Rời /contact: đóng cửa sổ + ẩn bubble.
 * Home chỉ gọi setCskhPageActive(false) — không chatClose (tránh Detect fail).
 */
export function hideSaleSmartlyUi({ closeChat = true } = {}) {
  if (typeof document === "undefined") return;
  if (closeChat) pushChatClose();
  setCskhPageActive(false);
}

/** @deprecated use hideSaleSmartlyUi */
export function destroySaleSmartly() {
  hideSaleSmartlyUi({ closeChat: true });
}
