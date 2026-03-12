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
      example: '`ROOT/1`',
      explanation: 'Find specifically the card matching ROOT/1',
    },
    {
      example: '`id:=ROOT/1`',
      explanation: 'Find specifically the card matching ROOT/1.',
    },
    {
      example: '`-id:ROOT/1`',
      explanation: 'Exclude the cards matching ROOT/1.',
    },
  ],
};
