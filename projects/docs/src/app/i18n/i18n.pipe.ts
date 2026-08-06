import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 't',
  pure: false,
})
export class I18nPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}

  transform(key: string) {
    return this.i18n.translate(key);
  }
}
