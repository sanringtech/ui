import { Component, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-[var(--docs-border)] px-8 py-6 text-sm text-[var(--docs-muted)]">
      {{ i18n.t('toc.card.title') }}
    </footer>
  `,
})
export class FooterComponent {
  protected readonly i18n = inject(I18nService);
}
