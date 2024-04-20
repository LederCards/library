import { ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const expansion = partialWithOptionalExactTextOperator(['expansion', 'e'], 'expansion');

export const expansionDescription: ICardHelp = {
  name: 'Expansion',
  id: 'expansion',

  icon: 'library-outline',

  color: '#6370ff',

  help: `
You can find cards that match a certain expansion by using the \`expansion:\` or \`e:\` operator.

This operator is a loose-text operator, which means that you can use partial expansion names.
You can also specify multiple expansions by separating them with a comma.
If an expansion has spaces in its name, you must use quotation marks around the name.
`,

  examples: [
    {
      example: '`expansion:Quintessential`',
      explanation: 'Cards in the Quintessential Quintuplets 1 or 2 set.',
    },
    {
      example: '`e:"The Quintessential Quintuplets,Log Horizon"`',
      explanation: 'Cards in the Quintessential Quintuplets 1 or 2 or Log Horizon set.',
    },
    {
      example: '`e:"=The Quintessential Quintuplets"`',
      explanation: 'Cards in the Quintessential Quintuplets 1 only.',
    },
    {
      example: '`-e:"Log Horizon"`',
      explanation: 'Cards not in the Log Horizon set.',
    }
  ]
};
