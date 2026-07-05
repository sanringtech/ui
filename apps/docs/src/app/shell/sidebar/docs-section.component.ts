import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocsSidebarItem } from '../../navigation/docs-navigation';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-docs-section',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <section [class]="sectionClass">
      <p class="mb-2.5 text-xs font-semibold text-[var(--docs-muted)]">{{ title }}</p>

      @for (item of items; track item.labelKey) {
        @if (item.disabled) {
          <a
            class="my-[3px] flex min-h-8 w-fit cursor-not-allowed items-center rounded-[var(--sanring-radius)] px-3 text-sm text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] no-underline"
          >
            {{ i18n.t(item.labelKey) }}
          </a>
        } @else {
          <a
            class="my-[3px] flex min-h-8 w-fit items-center rounded-[var(--sanring-radius)] px-3 text-sm text-[var(--docs-fg)] no-underline transition-colors duration-200 ease-in-out"
            [routerLink]="item.path"
            [routerLinkActive]="item.active ? 'bg-[var(--docs-active)]' : ''"
          >
            {{ i18n.t(item.labelKey) }}
            @if (item.badge) {
              <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span>
              <span
                class="ml-2 size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--docs-accent)_18%,transparent)]"
                aria-hidden="true"
              ></span>
            }
          </a>
        }
      }
    </section>
  `,
})
export class DocsSectionComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) items: DocsSidebarItem[] = [];
  @Input() sectionClass = '';

  protected readonly i18n = inject(I18nService);
}
