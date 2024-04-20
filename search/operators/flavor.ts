import { ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const flavor = partialWithOptionalExactTextOperator(['flavor', 'f'], 'flavorText');

export const flavorDescription: ICardHelp = {
  name: 'Flavor Text',
  id: 'flavor',

  icon: 'ice-cream-outline',

  color: '#cf3c4f',

  help: `
You can find cards that match flavor text by using the \`flavor:\` or \`f:\` operator.

This operator is a loose-text operator, which means that you can use partial flavor texts.
You can also specify multiple texts by separating them with a comma.
If the flavor text has spaces, you must use quotation marks around the query.
`,

  examples: [
    {
      example: '`flavor:hello`',
      explanation: 'Cards that have "hello" in their flavor text.',
    },
    {
      example: '`-f:"hello"`',
      explanation: 'Cards without "hello" in their flavor text.',
    }
  ]
};
