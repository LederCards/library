import { type ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const errata = numericalOperator(['errata', 'e'], 'errata');

export const errataDescription: ICardHelp = {
  name: 'Errata',
  id: 'errata',

  icon: 'flask-outline',

  color: '#aa3c06',

  help: `
You can find cards that have errata entries with the \`errata:\` or \`e:\` operator.

This operator is a numeric operator, meaning you'll by default want to search for \`errata:>0\` to find entries with any errata entries.
`,

  examples: [
    {
      example: '`errata:>0`',
      explanation: 'Cards that have any number of errata entries.',
    },
    {
      example: '`errata:=0`',
      explanation: 'Cards with no errata entries.',
    },
  ],
};
