import { type ICardHelp } from '../../interfaces';
import { partialWithOptionalExactTextOperator } from './_helpers';

export const card = partialWithOptionalExactTextOperator(['card', 'id'], 'id');

export const cardDescription: ICardHelp = {
  name: 'ID',
  id: 'id',

  icon: 'finger-print-outline',

  color: '#8360c3',

  help: `
You can find cards that match a certain id by using the \`id:\` operator.

This operator is special, you may also search without using the operator.
`,

  examples: [
    {
      example: '`OATH/1`',
      explanation: 'Find specifically the card matching OATH/1',
    },
    {
      example: '`id:=OATH/1`',
      explanation: 'Find specifically the card matching OATH/1.',
    },
    {
      example: '`-id:OATH`',
      explanation: 'Exclude the cards matching OATH.',
    },
  ],
};
