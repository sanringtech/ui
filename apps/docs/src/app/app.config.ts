import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { CALENDAR_QUARTER_STARTS_ON } from '@sanring/date-picker';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    // Docs-site demo default: calendar quarters (Jan–Mar, ...), not a fiscal
    // year. Real consumers must make this choice deliberately (Zero-default,
    // no fallback baked into the package itself).
    { provide: CALENDAR_QUARTER_STARTS_ON, useValue: 0 },
  ],
};
