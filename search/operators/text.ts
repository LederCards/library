import { type ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const text = partialWithOptionalExactTextOperator(
  ['cardtext', 't'],
  'text'
);

export const textDescription: ICardHelp = {
  name: 'CardText',
  id: 'text',

  icon: 'document-text-outline',

  color: '#06aa3c',

  help: `
You can find cards that match a certain expansion by using the \`cardtext:\` or \`t:\` operator.

This operator is a loose-text operator, which means that you can search any part of the card text.
`,

  examples: [
    {
      example: '`text:secure`',
      explanation: 'Cards that have "secure" in their text.',
    },
    {
      example: '`-text:"secure"`',
      explanation: 'Cards without "secure" in their text.',
    },
  ],
};
