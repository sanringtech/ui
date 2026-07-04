import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent } from '../../layouts/component-page';
import { docsComponentItems, DocsComponentNavItem } from '../../navigation/docs-navigation';

@Component({
  selector: 'app-components-page',
  imports: [ComponentPageComponent, RouterLink],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1
          class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ i18n.t('nav.components') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('components.description') }}
        </p>
      </header>

      <div class="grid gap-12 pt-10">
        <section id="updated-components" aria-labelledby="updated-components-title">
          <div class="mb-5">
            <h2
              id="updated-components-title"
              class="m-0 text-[28px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
            >
              {{ i18n.t('components.updatedTitle') }}
            </h2>
            <p class="mb-0 mt-2 max-w-[620px] text-sm leading-6 text-[var(--docs-muted)]">
              {{ i18n.t('components.updatedDescription') }}
            </p>
          </div>

          @if (updatedItems.length > 0) {
            <nav [attr.aria-label]="i18n.t('components.updatedTitle')">
              <div
                class="grid grid-cols-3 gap-x-14 gap-y-7 max-[720px]:grid-cols-2 max-[520px]:grid-cols-1"
              >
                @for (item of updatedItems; track item.id) {
                  <a
                    class="text-lg font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:text-[var(--docs-muted)]"
                    [routerLink]="item.path"
                  >
                    {{ i18n.t(item.labelKey) }}
                  </a>
                }
              </div>
            </nav>
          } @else {
            <p class="m-0 text-sm leading-6 text-[var(--docs-muted)]">
              {{ i18n.t('components.updatedEmpty') }}
            </p>
          }
        </section>

        <section id="all-components" aria-labelledby="all-components-title">
          <h2
            id="all-components-title"
            class="m-0 mb-5 text-[28px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
          >
            {{ i18n.t('components.allTitle') }}
          </h2>

          <nav [attr.aria-label]="i18n.t('components.allTitle')">
            <div
              class="grid grid-cols-3 gap-x-14 gap-y-7 max-[720px]:grid-cols-2 max-[520px]:grid-cols-1"
            >
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
        </section>
      </div>
    </app-component-page>
  `,
})
export class ComponentsPageComponent {
  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    {
      id: 'updated-components',
      titleKey: 'components.updatedTitle',
      descriptionKey: 'components.updatedDescription',
      level: 2,
    },
    {
      id: 'all-components',
      titleKey: 'components.allTitle',
      level: 2,
    },
  ];
  protected readonly items = docsComponentItems;
  protected readonly updatedItems: DocsComponentNavItem[] = [];
  protected readonly i18n = inject(I18nService);
}
