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
      <p class="docs-eyebrow mb-3 px-2">{{ title }}</p>

      @for (item of items; track item.labelKey) {
        @if (item.disabled) {
          <a class="docs-nav-item is-disabled my-1">
            {{ i18n.t(item.labelKey) }}
          </a>
        } @else {
          <a
            class="docs-nav-item my-1"
            [routerLink]="item.path"
            [routerLinkActive]="item.active ? 'is-active' : ''"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          >
            <span class="min-w-0 flex-1 truncate">{{ i18n.t(item.labelKey) }}</span>
            @if (item.badge) {
              <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span>
              <span
                class="ml-2 size-1.5 shrink-0 rounded-full bg-[var(--docs-accent)]"
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
