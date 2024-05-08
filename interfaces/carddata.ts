export interface ICard {
  id: string;
  text: string;
  image: string;
  name: string;
  tags: string[];

  game: string;
  product: string;
  locale: string;

  imageClass?: string;
  meta: Record<string, number>;
}
