const fs = require('fs-extra');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3, baseDelayMs = 500) => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return res;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** attempt;
        await sleep(delay);
      }
    }
  }

  throw lastError;
};

(async () => {
  fs.ensureDirSync('ssgdata');
  fs.ensureDirSync('ssgdata/i18n');

  const types = [
    'cards',
    'cards.min',
    'meta',
    'changelog',
    'faq',
    'errata',
    'i18n/en-US',
  ];

  for (const type of types) {
    try {
      const res = await fetchWithRetry(`https://ledercards.netlify.app/${type}.json`);
      const data = await res.json();

      fs.writeJsonSync(`ssgdata/${type}.json`, data);
    } catch (e) {
      console.error(`failed to fetch ${type}`);
      console.error(e);
    }
  }
})();
