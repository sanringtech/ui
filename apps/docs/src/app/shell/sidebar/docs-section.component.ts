import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  docsComponentStatusBadgeKeys,
  docsComponentStatusDotClass,
  DocsSidebarItem,
} from '../../navigation/docs-navigation';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-docs-section',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <section [class]="sectionClass">
      <p class="mb-3 px-1 text-xs font-semibold uppercase tracking-normal text-[var(--docs-muted)]">{{ title }}</p>

      @for (item of items; track item.labelKey) {
        @if (item.disabled) {
          <a
            class="my-1 flex min-h-10 w-full cursor-not-allowed items-center rounded-[var(--sanring-radius)] border border-transparent px-3 text-sm font-medium text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] no-underline"
          >
            {{ i18n.t(item.labelKey) }}
          </a>
        } @else {
          <a
            class="my-1 flex min-h-10 w-full items-center rounded-[var(--sanring-radius)] border border-transparent px-3 text-sm font-medium text-[var(--docs-fg)] no-underline transition-colors duration-200 ease-in-out hover:border-[var(--docs-border)] hover:bg-[var(--docs-elevated)]"
            [routerLink]="item.path"
            [routerLinkActive]="item.active ? 'border-[var(--docs-border)] bg-[var(--docs-active)]' : ''"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          >
            <span class="min-w-0 flex-1 truncate">{{ i18n.t(item.labelKey) }}</span>
            @if (item.badge) {
              <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span>
              <span
                class="ml-2 size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--docs-accent)_18%,transparent)]"
                aria-hidden="true"
              ></span>
            }
            @if (item.status) {
              <span class="sr-only">{{ i18n.t(statusBadgeKeys[item.status]) }}</span>
              <span
                [class]="'ml-2 size-2 shrink-0 rounded-full ' + statusDotClass[item.status]"
                [attr.title]="i18n.t(statusBadgeKeys[item.status])"
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
  protected readonly statusBadgeKeys = docsComponentStatusBadgeKeys;
  protected readonly statusDotClass = docsComponentStatusDotClass;
}
