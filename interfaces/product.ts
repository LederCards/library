export interface IProductFilter {
  name: string;
  prop: string;
  type: 'number';
}

export interface IProductDefinition {
  id: string;
  name: string;
  desc: string;
}

export interface IProduct extends IProductDefinition {
  filters: IProductFilter[];
  subproducts: IProductDefinition[];
  cardTemplate: Record<string, string>;
  external: {
    rules: string;
  };
}
