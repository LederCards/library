export interface ICard {
  id: string;
  text: string;
  image: string;
  name: string;
  tags: string[];

  product: string;
  subproduct: string;
  locale: string;

  imageClass?: string;
  meta: Record<string, number>;
}
