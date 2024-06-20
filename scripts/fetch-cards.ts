const fs = require('fs-extra');

(async () => {
  fs.ensureDirSync('ssgdata');
  fs.ensureDirSync('ssgdata/i18n');

  [
    'cards',
    'cards.min',
    'meta',
    'changelog',
    'faq',
    'errata',
    'i18n/en-US',
  ].forEach(async (type) => {
    const res = await fetch(`https://ledercardcdn.seiyria.com/${type}.json`);
    const data = await res.json();

    fs.writeJsonSync(`ssgdata/${type}.json`, data);
  });
})();
