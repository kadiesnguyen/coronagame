export const DEFAULT_LOGO_URL = "/assets/images/logo-corona.png";

export const DEFAULT_BANNERS = [
  {
    url: "/assets/images/banner-baccarat-quy-3.jpg",
    desc: "Corona Baccarat Tournament Quarter III",
  },
  {
    url: "/assets/images/banner-money-shower.jpg",
    desc: "Corona Money Shower",
  },
];

export const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) {
    return `${process.env.ENDPOINT_SERVER || ""}${url}`;
  }
  return url;
};
