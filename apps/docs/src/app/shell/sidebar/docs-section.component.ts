import { Component, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import {
  docsComponentStatusBadgeKeys,
  docsComponentStatusDotClass,
  DocsSidebarItem,
} from '../../navigation/docs-navigation';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-docs-section',
  imports: [RouterLink],
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
            [class.is-active]="isActive(item)"
            [routerLink]="item.path"
            [fragment]="item.fragment"
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

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected isActive(item: DocsSidebarItem): boolean {
    if (!item.path || !item.active) return false;
    const tree = this.router.parseUrl(this.url());
    const currentPath = '/' + (tree.root.children['primary']?.segments.map((segment) => segment.path).join('/') ?? '');
    const pathMatches = item.exact
      ? currentPath === item.path
      : currentPath === item.path || currentPath.startsWith(`${item.path}/`);
    if (!pathMatches) return false;
    if (item.fragment) return tree.fragment === item.fragment;
    return true;
  }
}
