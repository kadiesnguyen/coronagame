import { Head, Html, Main, NextScript } from "next/document";

/**
 * SaleSmartly install code in <body> (exact src, no defer) so Detect Installation
 * can find an active widget. Bubble hidden via CSS + hideIcon on non-/contact pages.
 * Do not pre-create window.ssq (loader aborts if ssq already exists).
 */
const SALESMARTLY_SRC =
  "https://plugin-code.salesmartly.com/js/project_787640_815005_1785157395.js";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        {/* Exact install snippet — sync load so document.currentScript works in their loader */}
        <script src={SALESMARTLY_SRC} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
