export interface ICardErrataEntry {
  text: string;
}

export interface ICardErrata {
  card: string;
  errata: ICardErrataEntry[];
}
