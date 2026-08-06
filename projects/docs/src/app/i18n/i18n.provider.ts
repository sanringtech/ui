import { APP_INITIALIZER } from '@angular/core';
import { I18nService } from './i18n.service';

export function provideI18n() {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [I18nService],
    useFactory: (i18n: I18nService) => () => i18n.load('zh-TW'),
  };
}
