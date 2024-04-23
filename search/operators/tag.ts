import { type ICardHelp } from '../../interfaces';
import { arraySearchOperator } from './_helpers';

export const tag = arraySearchOperator(['tag'], 'tags');

export const tagDescription: ICardHelp = {
  name: 'Tag',
  id: 'tag',

  icon: 'pricetags-outline',

  color: '#608b7d',

  help: `
You can find cards that have a certain tag by using the  \`tag:\` search operator.
Almost every card will have a tag. You can find a list of valid tags by using the advanced search page.
`,

  examples: [
    {
      example: '`tag:"Power"`',
      explanation: 'Cards that have the Power tag.',
    },
    {
      example: '`tag:"Power,Arcane"`',
      explanation: 'Cards that have the Power and Arcane triggers.',
    },
    {
      example: '`tag:none`',
      explanation: 'Cards with no tags.',
    },
  ],
};
