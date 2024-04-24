import { type ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const subproduct = exactTextOperator(
  ['subproduct', 'expansion'],
  'subproduct'
);

export const subproductDescription: ICardHelp = {
  name: 'Subproduct',
  id: 'id',

  icon: 'hardware-chip-outline',

  color: '#a16800',

  help: `
You can find cards that are associated with a certain subproduct/expansion by using the \`subproduct:\` operator.
`,

  examples: [
    {
      example: '`subproduct:clockwork-1`',
      explanation: 'Find cards belonging to the first Clockwork expansion.',
    },
    {
      example: '`-subproduct:exiles-partisans`',
      explanation: 'Exclude the cards belonging to Exiles & Partisans.',
    },
  ],
};
