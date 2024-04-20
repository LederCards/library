import { ICardHelp } from '../../interfaces';
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
      example: '`tag:"Army"`',
      explanation: 'Cards that have the Army tag.',
    },
    {
      example: '`tag:"Army,Clock Cleanset"`',
      explanation: 'Cards that have the Army and Clock Cleanse triggers.',
    },
    {
      example: '`tag:none`',
      explanation: 'Cards with no tags.',
    }
  ]
};
