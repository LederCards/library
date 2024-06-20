/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cardsMin from '../../ssgdata/cards.min.json';
import * as changelog from '../../ssgdata/changelog.json';
import * as errata from '../../ssgdata/errata.json';
import * as faq from '../../ssgdata/faq.json';
import * as enUS from '../../ssgdata/i18n/en-US.json';
import * as meta from '../../ssgdata/meta.json';

export const environment = {
  production: true,
  ssg: true,
  baseAppUrl: 'http://localhost:4000',
  baseUrl: 'https://ledercardcdn.seiyria.com',
  overrideData: {
    cardsMin: (cardsMin as any).default ?? cardsMin,
    changelog: (changelog as any).default ?? changelog,
    errata: (errata as any).default ?? errata,
    faq: (faq as any).default ?? faq,
    meta: (meta as any).default ?? meta,
    locale: {
      enUS: (enUS as any).default ?? enUS,
    },
  },
};
