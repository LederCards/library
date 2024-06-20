/* eslint-disable @typescript-eslint/no-explicit-any */

const fs = require('fs-extra');
const xmlbuilder = require('xmlbuilder');
const cards = require('../ssgdata/cards.json');

const routes = [
  '/',
  '/advanced',
  '/syntax',
  '/products',
  '/faq',
  '/errata',
  '/changelog',
];

cards.forEach((card: any) => {
  routes.push(`/card/${card.id}`);
});

const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

routes.forEach((route) => {
  const url = root.ele('url');
  url.ele('loc', `https://cards.ledergames.com${route}`);
});

fs.writeFileSync('src/sitemap.xml', root.end({ pretty: true }));
