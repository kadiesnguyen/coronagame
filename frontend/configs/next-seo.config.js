const NextSeoConfig = {
  title: null,
  titleTemplate: "%s | Corona Casin",
  defaultTitle: "Corona Casin",
  description: "Corona Casin",
  dangerouslySetAllPagesToNoIndex: true,
  dangerouslySetAllPagesToNoFollow: true,
  noindex: true,
  nofollow: true,
  robotsProps: {
    nosnippet: true,
    notranslate: true,
    noimageindex: true,
    noarchive: true,
    maxSnippet: -1,
    maxImagePreview: "none",
    maxVideoPreview: -1,
  },
  additionalMetaTags: [
    {
      name: "robots",
      content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
    },
    {
      name: "googlebot",
      content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
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
      content: "Corona Casin",
    },
    {
      name: "mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "theme-color",
      content: "#0b1528",
    },
    {
      name: "application-name",
      content: "Corona Casin",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/assets/images/logo-corona.png",
    },
    {
      rel: "manifest",
      href: "/manifest.json",
    },
    {
      rel: "apple-touch-icon",
      href: "/assets/images/logo-corona.png",
      sizes: "180x180",
    },
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL,
    siteName: "Corona Casin",
    description: "Corona Casin",
    images: [
      {
        url: "/assets/images/logo-corona.png",
        width: 400,
        height: 84,
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
