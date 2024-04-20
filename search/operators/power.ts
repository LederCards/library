import { ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const power = numericalOperator(['power', 'p'], 'power');

export const powerDescription: ICardHelp = {
  name: 'Power',
  id: 'power',

  icon: 'barbell-outline',

  color: '#cf3c4f',

  help: `
You can find cards that match a certain level power by using the \`power:\` or \`p:\` operator.

This operator is numeric, which means you can use \`<\`, \`<=\`, \`>\`, \`>=\`, \`=\` and \`!=\`
to compare the power of a card against a value.
`,

  examples: [
    {
      example: '`power:0`',
      explanation: 'Cards that have 0 power _(including climax cards)_.',
    },
    {
      example: '`power:>=2500`',
      explanation: 'Cards that are have 2500 power or greater.',
    },
    {
      example: '`-p:!=1000`',
      explanation: 'Cards that do not have 1000 power.',
    }
  ]
};
