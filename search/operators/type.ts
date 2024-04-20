import { ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const type = exactTextOperator(['type'], 'type');

export const typeDescription: ICardHelp = {
  name: 'Type',
  id: 'type',

  icon: 'extension-puzzle-outline',

  color: '#cf3c4f',

  help: `
You can find cards that match a type by using the \`type:\` operator.

The valid values here are: \`character\`, \`climax\`, \`event\`.
`,

  examples: [
    {
      example: '`type:character`',
      explanation: 'Cards that are characters.',
    },
    {
      example: '`type:character,event`',
      explanation: 'Cards that are characters or events.',
    },
    {
      example: '`-type:climax`',
      explanation: 'Cards that are not climaxes.',
    }
  ]
};
