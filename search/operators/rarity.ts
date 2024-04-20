import { ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const rarity = exactTextOperator(['rarity', 'r'], 'rarity');

export const rarityDescription: ICardHelp = {
  name: 'Rarity',
  id: 'rarity',

  icon: 'aperture-outline',

  color: '#3171e0',

  help: `
You can find cards that match a certain rarity by using the \`rarity:\` or \`r:\` operator.

The valid values here are: \`c\`, \`u\`, \`cc\`, \`cr\`, \`td\`, \`pr\`, \`sp\`, \`sr\`, \`n\`, \`r\`, \`rr\`, \`rrr\`, \`rr+\`, \`dd\`.

Other values may be added automatically by the system if new rarities are added, but this page may not reflect that immediately.
`,

  examples: [
    {
      example: '`rarity:rr`',
      explanation: 'Find cards with RR rarity.',
    },
    {
      example: '`-r:c`',
      explanation: 'Find cards that are not C rarity.',
    }
  ]
};
