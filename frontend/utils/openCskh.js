import Router from "next/router";

/** Luôn vào /contact — chỉ trang đó mới load SaleSmartly + nút chat. */
export function setCskhConfigCache() {
  /* kept for CskhWidget import compat — config fetched on /contact */
}

export const openCskh = () => {
  if (typeof window === "undefined") return;
  if (Router.pathname === "/contact") {
    window.dispatchEvent(new CustomEvent("cskh:open"));
    return;
  }
  Router.push("/contact");
};
