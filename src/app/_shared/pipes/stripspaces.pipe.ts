import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripspaces',
})
export class StripSpacesPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(' ', '');
  }
}
