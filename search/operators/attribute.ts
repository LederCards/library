import { ICardHelp } from '../../interfaces';
import { arraySearchOperator } from './_helpers';

export const attribute = arraySearchOperator(['attribute', 'a'], 'attributes');

export const attributeDescription: ICardHelp = {
  name: 'Attribute',
  id: 'attribute',

  icon: 'color-filter-outline',

  color: '#3171e0',

  help: `
You can find cards that have a certain attribute by using the \`attribute:\` or \`a:\` search operator.
Cards will have 0-2 attributes, and you can search for cards that have a specific attribute.
You can also search for cards that have no attribute at all.
`,

  examples: [
    {
      example: '`attribute:Quintuplets`',
      explanation: 'Cards that have the Quintuplets attribute.',
    },
    {
      example: '`a:stylish,quintuplets`',
      explanation: 'Cards that have the Stylish and Quintuplets attribute.',
    },
    {
      example: '`-a:Stylish`',
      explanation: 'Cards without the Stylish attribute.',
    },
    {
      example: '`a:none`',
      explanation: 'Cards with no attributes.',
    }
  ]
};
