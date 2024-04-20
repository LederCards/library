import { ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const cost = numericalOperator(['cost', 'co'], 'cost');

export const costDescription: ICardHelp = {
  name: 'Cost',
  id: 'cost',

  icon: 'prism-outline',

  color: '#608b7d',

  help: `
You can find cards that fit in a cost value by using the \`cost:\` or \`co:\` operator.

This operator is numeric, which means you can use \`<\`, \`<=\`, \`>\`, \`>=\`, \`=\` and \`!=\`
to compare the cost of a card against a value.
`,

  examples: [
    {
      example: '`cost:0`',
      explanation: 'Cards that cost 0 stock.',
    },
    {
      example: '`co:>=2`',
      explanation: 'Cards that cost 2 or more stock.',
    },
    {
      example: '`-co:!=1`',
      explanation: 'Cards that do not cost 1 stock.',
    }
  ]
};
