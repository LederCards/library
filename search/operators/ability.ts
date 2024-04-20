import { ICardHelp } from '../../interfaces';
import { arraySearchOperator } from './_helpers';

export const ability = arraySearchOperator(['ability'], 'ability');

export const abilityDescription: ICardHelp = {
  name: 'Ability',
  id: 'ability',

  icon: 'cog-outline',

  color: '#36abe0',

  help: `
You can find cards that have a certain ability by using the \`ability:\` search operator.
Cards will have 0-2 abilities, and you can search for cards that have a specific ability.
You can also search for cards that have no abilities at all.
`,

  examples: [
    {
      example: '`ability:"when this card is placed on the stage"`',
      explanation: 'Cards that have an ability that apply when placed on the stage.',
    },
    {
      example: '`-ability:"two or more"`',
      explanation: 'Cards without abilities that contain "two or more".',
    },
    {
      example: '`ability:none`',
      explanation: 'Cards with no abilities.',
    }
  ]
};
