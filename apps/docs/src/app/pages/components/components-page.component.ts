import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent } from '../../layouts/component-page';
import { docsComponentItems } from '../../navigation/docs-navigation';

@Component({
  selector: 'app-components-page',
  imports: [ComponentPageComponent, RouterLink],
  template: `
    <app-component-page [sections]="[]">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('nav.components') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('components.description') }}
        </p>
      </header>

      <nav class="pt-10" [attr.aria-label]="i18n.t('nav.components')">
        <div class="grid grid-cols-3 gap-x-14 gap-y-7 max-[720px]:grid-cols-2 max-[520px]:grid-cols-1">
          @for (item of items; track item.id) {
            @if (item.disabled) {
              <span
                class="text-lg font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)]"
              >
                {{ i18n.t(item.labelKey) }}
              </span>
            } @else {
              <a
                class="text-lg font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:text-[var(--docs-muted)]"
                [routerLink]="item.path"
              >
                {{ i18n.t(item.labelKey) }}
              </a>
            }
          }
        </div>
      </nav>
    </app-component-page>
  `,
})
export class ComponentsPageComponent {
  protected readonly items = docsComponentItems;
  protected readonly i18n = inject(I18nService);
}
