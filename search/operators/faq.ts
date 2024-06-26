import { type ICardHelp } from '../../interfaces';
import { numericalOperator } from './_helpers';

export const faq = numericalOperator(['faq', 'f'], 'faq');

export const faqDescription: ICardHelp = {
  name: 'FAQ',
  id: 'faq',

  icon: 'chatbubbles-outline',

  color: '#aa063c',

  help: `
You can find cards that have FAQ entries with the \`faq:\` or \`f:\` operator.

This operator is a numeric operator, meaning you'll by default want to search for \`faq:>0\` to find entries with any FAQs.
`,

  examples: [
    {
      example: '`faq:>0`',
      explanation: 'Cards that have any number of FAQ entries.',
    },
    {
      example: '`faq:=0`',
      explanation: 'Cards with no FAQ entries.',
    },
  ],
};
