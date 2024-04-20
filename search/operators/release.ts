import { ICardHelp } from '../../interfaces';
import { exactTextOperator } from './_helpers';

export const release = exactTextOperator(['release', 'rel'], 'release');

export const releaseDescription: ICardHelp = {
  name: 'Release',
  id: 'release',

  icon: 'albums-outline',

  color: '#36abe0',

  help: `
You can find cards that match a certain release by using the \`release:\` or \`rel:\` operator.
`,

  examples: [
    {
      example: '`release:83`',
      explanation: 'Cards belonging to release 83 (The Quintessential Quintuplets).',
    },
    {
      example: '`-rel:83`',
      explanation: 'Cards not belonging to release 83 (The Quintessential Quintuplets).',
    }
  ]
};
