import { CardColor, CardTrigger } from '../interfaces';
import { parseQuery } from '../search/search';

import * as cards from '../src/assets/cards.json';

const allCards = (cards as any).default || cards;

test('Searching for a card by id should return that card', () => {
  const res = parseQuery(allCards, '5HY/W83-E001');
  expect(res.length).toBe(1);
  expect(res[0].id).toBe('5HY/W83-E001');

  const res2 = parseQuery(allCards, 'id:5HY/W83-E001');
  expect(res2.length).toBe(1);
  expect(res2[0].id).toBe('5HY/W83-E001');
});

test('Searching for multiple cards by id should return those cards', () => {
  const res = parseQuery(allCards, 'id:5HY/W83-E001,5HY/W83-E002');
  expect(res.length).toBe(2);
  expect(res.find((c) => c.id === '5HY/W83-E001')).toBeTruthy();
  expect(res.find((c) => c.id === '5HY/W83-E002')).toBeTruthy();
});

test('Excluding a card by id should ignore that card', () => {
  const res3 = parseQuery(allCards, '-id:5HY/W83-E001');
  expect(res3.length).toBe(allCards.length - 1);
  expect(res3.filter((c) => c.id === '5HY/W83-E001').length).toBe(0);
});

test('Searching for a card by id (lowercase) should return that card correctly', () => {
  const res = parseQuery(allCards, '5hy/w83-e001');
  expect(res.length).toBe(1);
  expect(res[0].id).toBe('5HY/W83-E001');

  const res2 = parseQuery(allCards, 'id:5hy/w83-e001');
  expect(res2.length).toBe(1);
  expect(res2[0].id).toBe('5HY/W83-E001');
});

test('Searching for multiple cards by id (lowercase) should return those cards', () => {
  const res = parseQuery(allCards, 'id:5hy/w83-e001,5hy/w83-e002');
  expect(res.length).toBe(2);
  expect(res.find((c) => c.id === '5HY/W83-E001')).toBeTruthy();
  expect(res.find((c) => c.id === '5HY/W83-E002')).toBeTruthy();
});

test('Excluding a card by id (lowercase) should ignore that card', () => {
  const res3 = parseQuery(allCards, '-id:5hy/w83-e001');
  expect(res3.length).toBe(allCards.length - 1);
  expect(res3.filter((c) => c.id === '5HY/W83-E001').length).toBe(0);
});

test('Filtering cards by side should return cards of only that side', () => {
  const res = parseQuery(allCards, 'side:W');
  expect(res.every((c) => c.side === 'W')).toBe(true);

  const res2 = parseQuery(allCards, '-side:W');
  expect(res2.every((c) => c.side === 'S')).toBe(true);
});

test('Filtering cards by color should return cards of only that color', () => {
  const res = parseQuery(allCards, 'color:Y');
  expect(res.every((c) => c.color === CardColor.Yellow)).toBe(true);

  const res2 = parseQuery(allCards, '-color:Y');
  expect(res2.every((c) => c.color !== CardColor.Yellow)).toBe(true);

  const res3 = parseQuery(allCards, '-color:Y,G');
  expect(
    res3.every((c) => [CardColor.Red, CardColor.Blue].includes(c.color))
  ).toBe(true);
});

test('Filtering cards by rarity should return cards of only that rarity', () => {
  const res = parseQuery(allCards, 'rarity:RR+');
  expect(res.every((c) => c.rarity === 'RR+')).toBe(true);

  const res2 = parseQuery(allCards, '-rarity:R');
  expect(res2.every((c) => c.rarity !== 'R')).toBe(true);
});

test('Filtering cards by set should return cards of only that set', () => {
  const res = parseQuery(allCards, 'set:5hy');
  expect(res.every((c) => c.set === '5HY')).toBe(true);

  const res2 = parseQuery(allCards, '-set:5hy');
  expect(res2.every((c) => c.set !== '5HY')).toBe(true);
});

test('Filtering cards by type should return cards of only that type', () => {
  const res = parseQuery(allCards, 'type:character');
  expect(res.every((c) => c.type === 'Character')).toBe(true);

  const res2 = parseQuery(allCards, '-type:character');
  expect(res2.every((c) => c.type !== 'Character')).toBe(true);
});

test('Filtering cards by multiple operators should filter correctly', () => {
  const res = parseQuery(allCards, 'type:character side:w');
  expect(res.every((c) => c.type === 'Character' && c.side === 'W')).toBe(true);

  const res2 = parseQuery(allCards, '-type:character -side:w');
  expect(res2.every((c) => c.type !== 'Character' && c.side !== 'W')).toBe(
    true
  );

  const res3 = parseQuery(allCards, '-type:character side:w');
  expect(res3.every((c) => c.type !== 'Character' && c.side === 'W')).toBe(
    true
  );
});

test('Filtering cards by expansion should return cards of that expansion', () => {
  const res = parseQuery(
    allCards,
    'expansion:"The Quintessential Quintpulets"'
  );
  expect(
    res.every((c) => c.expansion.includes('The Quintessential Quintuplets'))
  ).toBe(true);
  expect(
    res.every(
      (c) =>
        c.expansion === 'The Quintessential Quintuplets' ||
        c.expansion === 'The Quintessential Quintpulets 2'
    )
  ).toBe(true);
});

test('Filtering cards by name should return cards of that name', () => {
  const res = parseQuery(allCards, 'name:"Nino Nakano"');
  expect(res.every((c) => c.name.includes('Nino Nakano'))).toBe(true);
});

test('Filtering cards by trigger should return cards with that trigger', () => {
  const res = parseQuery(allCards, 'trigger:soul');
  expect(res.every((c) => c.trigger.includes(CardTrigger.Soul))).toBe(true);

  const res2 = parseQuery(allCards, '-t:soul');
  expect(res2.every((c) => !c.trigger.includes(CardTrigger.Soul))).toBe(true);

  const res3 = parseQuery(allCards, 't:standby,soul');
  expect(
    res3.every(
      (c) =>
        c.trigger.includes(CardTrigger.Soul) ||
        c.trigger.includes(CardTrigger.Standby)
    )
  ).toBe(true);

  const res4 = parseQuery(allCards, 't:none');
  expect(res4.every((c) => c.trigger.length === 0)).toBe(true);

  const res5 = parseQuery(allCards, '-t:none');
  expect(res5.every((c) => c.trigger.length > 0)).toBe(true);

  const res6 = parseQuery(allCards, 't:soul,none');
  expect(
    res6.every(
      (c) => c.trigger.includes(CardTrigger.Soul) || c.trigger.length === 0
    )
  ).toBe(true);
});

test('Filtering cards by attribute should return cards with that attribute', () => {
  const res = parseQuery(allCards, 'attribute:quintessential');
  expect(res.every((c) => c.attributes.includes('quintessential'))).toBe(true);

  const res2 = parseQuery(allCards, '-a:quintessential');
  expect(res2.every((c) => !c.attributes.includes('quintessential'))).toBe(
    true
  );
});

test('Filtering cards by cost should return cards with that cost/range', () => {
  const res = parseQuery(allCards, 'cost:3');
  expect(res.every((c) => c.cost === 3)).toBe(true);

  const res2 = parseQuery(allCards, 'cost:>3');
  expect(res2.every((c) => c.cost > 3)).toBe(true);

  const res3 = parseQuery(allCards, 'cost:>=3');
  expect(res3.every((c) => c.cost >= 3)).toBe(true);

  const res4 = parseQuery(allCards, 'cost:<3');
  expect(res4.every((c) => c.cost < 3)).toBe(true);

  const res5 = parseQuery(allCards, 'cost:<=3');
  expect(res5.every((c) => c.cost <= 3)).toBe(true);

  const res6 = parseQuery(allCards, 'cost:3,>4');
  expect(res6.every((c) => c.cost === 3 || c.cost > 4)).toBe(true);
  expect(res6.every((c) => c.cost === 4 || c.cost < 3)).toBe(false);

  const res7 = parseQuery(allCards, '-co:3,>4');
  expect(res7.every((c) => c.cost === 4 || c.cost < 3)).toBe(true);
  expect(res7.every((c) => c.cost === 3 || c.cost > 4)).toBe(false);

  const res8 = parseQuery(allCards, 'cost:!=3');
  expect(res8.every((c) => c.cost !== 3)).toBe(true);
});

test('Filtering cards by level should return cards with that level/range', () => {
  const res = parseQuery(allCards, 'level:3');
  expect(res.every((c) => c.level === 3)).toBe(true);

  const res2 = parseQuery(allCards, '-l:>2');
  expect(res2.some((c) => c.level > 2)).toBe(false);
});

test('Filtering cards by power should return cards with that power/range', () => {
  const res = parseQuery(allCards, 'power:2000');
  expect(res.every((c) => c.power === 2000)).toBe(true);

  const res2 = parseQuery(allCards, '-p:>10000');
  expect(res2.some((c) => c.power > 10000)).toBe(false);
});

test('Filtering cards by release should return cards with that release/range', () => {
  const res = parseQuery(allCards, 'release:83');
  expect(res.every((c) => c.release === '83')).toBe(true);

  const res2 = parseQuery(allCards, '-rel:83');
  expect(res2.some((c) => c.release === '83')).toBe(false);
});

test('Filtering cards by soul should return cards with that soul/range', () => {
  const res = parseQuery(allCards, 'soul:3');
  expect(res.every((c) => c.soul === 3)).toBe(true);

  const res2 = parseQuery(allCards, '-s:>1');
  expect(res2.some((c) => c.soul > 1)).toBe(false);
});

test('Filtering cards by tag should return cards with that tag', () => {
  const res = parseQuery(allCards, 'tag:"Army"');
  expect(res.every((c) => c.tags.includes('Army'))).toBe(true);
});
