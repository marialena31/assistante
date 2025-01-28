import { NextApiRequest, NextApiResponse } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marialena-pietri.fr';

const pages = [
  '',
  '/services',
  '/about',
  '/tarifs',
  '/contact',
];

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          return `
            <url>
              <loc>${SITE_URL}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
            </url>
          `;
        })
        .join('')}
    </urlset>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
