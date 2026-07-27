import Router from "next/router";

/** Mở trang CSKH ProvideSupport trong app — không nhảy tab mới. */
export const openCskh = () => {
  if (typeof window === "undefined") return;
  if (Router.pathname === "/contact") {
    window.dispatchEvent(new CustomEvent("cskh:open"));
    return;
  }
  Router.push("/contact");
};
