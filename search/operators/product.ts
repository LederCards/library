import { type ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const product = exactTextOperator(['product', 'game'], 'game');

export const productDescription: ICardHelp = {
  name: 'Game',
  id: 'id',

  icon: 'game-controller-outline',

  color: '#d0312d',

  help: `
You can find cards that are associated with a certain product/game by using the \`product:\` operator.
`,

  examples: [
    {
      example: '`product:oath`',
      explanation: 'Find cards belonging to Oath.',
    },
    {
      example: '`-product:root`',
      explanation: 'Exclude the cards belonging to Root.',
    },
  ],
};
