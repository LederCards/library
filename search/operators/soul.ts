import { ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const soul = numericalOperator(['soul', 's'], 'soul');

export const soulDescription: ICardHelp = {
  name: 'Soul',
  id: 'soul',

  icon: 'dice-outline',

  color: '#8360c3',

  help: `
You can find cards that fit in a soul value by using the \`soul:\` or \`s:\` operator.

This operator is numeric, which means you can use \`<\`, \`<=\`, \`>\`, \`>=\`, \`=\` and \`!=\`
to compare the cost of a card against a value.
`,

  examples: [
    {
      example: '`soul:0`',
      explanation: 'Cards that have 0 soul.',
    },
    {
      example: '`s:>=2`',
      explanation: 'Cards have 2 or more soul.',
    },
    {
      example: '`-s:!=1`',
      explanation: 'Cards that do not have 1 soul.',
    }
  ]
};
