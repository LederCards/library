import { ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const level = numericalOperator(['level', 'l'], 'level');

export const levelDescription: ICardHelp = {
  name: 'Level',
  id: 'level',

  icon: 'fitness-outline',

  color: '#e0ac08',

  help: `
You can find cards that match a certain level value by using the \`level:\` or \`l:\` operator.

This operator is numeric, which means you can use \`<\`, \`<=\`, \`>\`, \`>=\`, \`=\` and \`!=\`
to compare the cost of a card against a value.
`,

  examples: [
    {
      example: '`level:0`',
      explanation: 'Cards that cost are level 0 _(including climax cards)_.',
    },
    {
      example: '`level:>=2`',
      explanation: 'Cards that are level 2 or greater.',
    },
    {
      example: '`-level:!=1`',
      explanation: 'Cards that are not level 1.',
    }
  ]
};
