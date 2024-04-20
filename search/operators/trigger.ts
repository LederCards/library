import { ICardHelp } from '../../interfaces';
import { arraySearchOperator } from './_helpers';

export const trigger = arraySearchOperator(['trigger', 't'], 'trigger');

export const triggerDescription: ICardHelp = {
  name: 'Trigger',
  id: 'trigger',

  icon: 'gift-outline',

  color: '#3171e0',

  help: `
You can find cards that have a certain trigger icon by using the \`trigger:\` or \`t:\` search operator.
Most cards will have no trigger, additionally, cards that have Soul triggers aren't necessarily climax cards.
You can also search for cards that have no trigger at all.
`,

  examples: [
    {
      example: '`trigger:draw`',
      explanation: 'Cards that have the Draw trigger.',
    },
    {
      example: '`t:gate,shot`',
      explanation: 'Cards that have the Gate and Shot triggers.',
    },
    {
      example: '`-t:soul`',
      explanation: 'Cards without the Soul trigger.',
    },
    {
      example: '`t:none`',
      explanation: 'Cards with no triggers.',
    }
  ]
};
