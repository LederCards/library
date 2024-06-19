import { inject, Pipe, type PipeTransform } from '@angular/core';
import { MetaService } from '../../meta.service';

@Pipe({
  name: 'productname',
})
export class ProductNamePipe implements PipeTransform {
  private metaService = inject(MetaService);

  transform(value: string): string {
    const foundProduct = this.metaService.getProductNameByProductId(value);
    if (!foundProduct) return value;

    return foundProduct;
  }
}
