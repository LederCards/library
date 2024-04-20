import { ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const color = exactTextOperator(['color', 'c'], 'color');

export const colorDescription: ICardHelp = {
  name: 'Color',
  id: 'color',

  icon: 'color-palette-outline',

  color: '#36abe0',

  help: `
You can find cards that match a certain code/id by using the \`color:\` or \`c:\` operator.

The valid values here are: \`b\`, \`g\`, \`r\`, \`y\` (for blue, green, red, yellow respectively).
`,

  examples: [
    {
      example: '`color:y`',
      explanation: 'Cards that are yellow color.',
    },
    {
      example: '`c:g,r`',
      explanation: 'Cards that are green and red.',
    },
    {
      example: '`-c:b`',
      explanation: 'Cards that are not blue.',
    }
  ]
};
