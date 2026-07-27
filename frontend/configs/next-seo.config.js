const NextSeoConfig = {
  title: null,
  titleTemplate: "%s | Xổ số Megalott",
  defaultTitle: "Xổ số Megalott",
  description: "Megalott - Hệ thống chơi xổ số trực tuyến",
  additionalMetaTags: [
    {
      property: "keywords",
      content: "megalott, MEGALOTT, xo so, xoso, keno, keno 1p, keno 3p, keno 5p, keno online",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "Xổ số Megalott",
    },
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#000000",
    },
    {
      name: "application-name",
      content: "Xổ số Megalott",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/assets/images/logo.png",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    {
      rel: "apple-touch-icon",
      href: "/assets/images/logo.png",
      sizes: "180x180",
    },
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL,
    siteName: "Xổ số Megalott",
    description: "Xổ số Megalott",
    images: [
      {
        url: "https://i.imgur.com/JbAkY41.png",
        width: 1200,
        height: 628,
      },
    ],
  },
  facebook: {
    appId: process.env.FACEBOOK_APPID,
  },
  twitter: {
    handle: "@ThinhLe2013478",
    site: "@ThinhLe2013478",
    cardType: "summary_large_image",
  },
};
export default NextSeoConfig;
