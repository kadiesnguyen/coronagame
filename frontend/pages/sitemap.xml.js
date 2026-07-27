const SiteMap = () => {};

const LINK_WEBSITE = process.env.NEXTAUTH_URL;
const DANH_MUC = [
  {
    title: "Home",
    link: `${LINK_WEBSITE}/`,
    priority: "1.00",
  },
  {
    title: "Đăng nhập",
    link: `${LINK_WEBSITE}/login`,
    priority: "0.80",
  },
  {
    title: "Đăng ký",
    link: `${LINK_WEBSITE}/register`,
    priority: "0.80",
  },
];

const generateSiteMap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${DANH_MUC.map(({ link, priority }) => {
         return `
        <url>
            <loc>${`${link}`}</loc>
            <changefreq>daily</changefreq>
            <priority>${`${priority}`}</priority>
        </url>
      `;
       }).join("")}


     
     </urlset>
   `;
};

export async function getServerSideProps({ res }) {
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}
export default SiteMap;
