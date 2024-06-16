export interface ICard {
  id: string;
  text: string;
  image: string;
  name: string;
  tags: string[];

  game: string;
  product: string;
  locale: string;

  flipSide?: string;

  imageClass?: string;
  meta: Record<string, number>;
}
