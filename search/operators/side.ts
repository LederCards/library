import { ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const side = exactTextOperator(['side', 's'], 'side');

export const sideDescription: ICardHelp = {
  name: 'Side',
  id: 'side',

  icon: 'star-half-outline',

  color: '#e0ac08',

  help: `
You can find cards that match a side by using the \`side:\` operator.

The valid values here are: \`w\`, \`s\` (for Weiß and Schwarz respectively).
`,

  examples: [
    {
      example: '`side:s`',
      explanation: 'Cards that belong to the Schwarz side.',
    },
    {
      example: '`-side:w`',
      explanation: 'Cards that do not belong to the Schwarz side.',
    }
  ]
};
