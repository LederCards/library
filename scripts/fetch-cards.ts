const fs = require('fs-extra');

(async () => {
  const cardsRes = await fetch('https://ledercards.netlify.app/cards.json');
  const cards = await cardsRes.json();

  fs.writeJsonSync('cards.json', cards);
})();
