import { ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const set = partialWithOptionalExactTextOperator(['set'], 'set');

export const setDescription: ICardHelp = {
  name: 'Set',
  id: 'set',

  icon: 'barcode-outline',

  color: '#608b7d',

  help: `
You can find cards that match a certain set by using the \`set:\` operator.
`,

  examples: [
    {
      example: '`set:5hy`',
      explanation: 'Cards neo-standard with The Quintessential Quintuplets.',
    },
    {
      example: '`-set:5HY`',
      explanation: 'Cards not neo-standard with The Quintessential Quintuplets.',
    }
  ]
};

