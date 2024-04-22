export interface IProductFilter {
  name: string;
  prop: string;
}

export interface IProductDefinition {
  id: string;
  name: string;
}

export interface IProduct extends IProductDefinition {
  filters: IProductFilter[];
  subproducts: IProductDefinition[];
}
