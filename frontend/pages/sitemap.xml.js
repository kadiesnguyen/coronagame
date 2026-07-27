const SiteMap = () => {};

export async function getServerSideProps({ res }) {
  // Empty sitemap — site is not meant to be indexed
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
`);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
