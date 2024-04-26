export interface ICardFAQEntry {
  q: string;
  a: string;
}

export interface ICardFAQ {
  card: string;
  faq: ICardFAQEntry[];
}
