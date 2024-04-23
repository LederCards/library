import { type ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const name = partialWithOptionalExactTextOperator(['name', 'n'], 'name');

export const nameDescription: ICardHelp = {
  name: 'Name',
  id: 'name',

  icon: 'person-outline',

  color: '#6370ff',

  help: `
You can find cards that match a certain expansion by using the \`name:\` or \`n:\` operator.

This operator is a loose-text operator, which means that you can use partial names.
You can also specify multiple expansions by separating them with a comma.
If a name has spaces in its name, you must use quotation marks around the name.
`,

  examples: [
    {
      example: '`Alchemist`',
      explanation: 'Cards with "Alchemist" in their name.',
    },
    {
      example: '`name:alchemist`',
      explanation: 'Cards that have "alchemist" in their name.',
    },
    {
      example: '`name:"=Alchemist"`',
      explanation: 'Cards that are called exactly "Alchemist".',
    },
    {
      example: '`-name:"Alchemist"`',
      explanation: 'Cards without "Alchemist" in their name.',
    },
  ],
};
