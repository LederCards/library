export interface ICard {
  id: string;
  text: string;
  image: string;
  name: string;
  tags: string[];

  imageClass?: string;
  meta: Record<string, number>;
}
