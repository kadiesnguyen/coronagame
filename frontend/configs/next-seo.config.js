/**
 * Link preview / SEO — single source for share cards (Telegram, Zalo, FB…).
 * No og:image / twitter:image so shares stay text-only (no logo/banner).
 * Search indexing blocked site-wide (robots + headers + robots.txt).
 */
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
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXTAUTH_URL,
    siteName: "Corona Casin",
    description: "Corona Casin",
    // intentionally no images — avoid logo/banner on link share
  },
  twitter: {
    cardType: "summary",
  },
};
export default NextSeoConfig;
