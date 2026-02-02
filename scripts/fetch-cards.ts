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
    try {
      const res = await fetch(`https://ledercards.netlify.app/${type}.json`);
      const data = await res.json();

      fs.writeJsonSync(`ssgdata/${type}.json`, data);
    } catch(e) {
      console.error(`failed to fetch ${type}`);
      console.error(e);
    }
  });
})();
