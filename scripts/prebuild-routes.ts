const fs = require('fs-extra');
const cards = require('../ssgdata/cards.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardRoutes = cards.map((c: any) => `/card/${encodeURIComponent(c.id)}`);

fs.writeFileSync('routes.txt', cardRoutes.join('\n'));
