import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { menuItems, type MenuItem } from '../../navigation/menu-navigation';

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex min-w-0 items-center gap-3 max-[860px]:hidden" aria-label="Primary">
      <a
        class="docs-panel mr-1 inline-flex size-11 flex-none items-center justify-center transition-colors hover:bg-[var(--docs-elevated)]"
        routerLink="/"
        [attr.aria-label]="i18n.t('nav.home')"
      >
        <img class="size-6" src="sanring_ui.svg" alt="" />
      </a>

      @for (item of items; track item.labelKey) {
        <a
          class="inline-flex justify-center whitespace-nowrap rounded-[var(--sanring-radius)] px-4 py-2 text-center text-[15px] font-medium text-[var(--docs-muted)] no-underline transition-colors hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] max-[980px]:hidden"
          [routerLink]="item.path"
          routerLinkActive="!bg-[var(--docs-elevated)] !text-[var(--docs-fg)]"
          [routerLinkActiveOptions]="{ exact: item.exact }"
          [style.min-width.px]="itemMinWidth(item)"
        >
          {{ i18n.t(item.labelKey) }}
        </a>
      }
    </nav>
  `,
})
export class MenuListComponent {
  protected readonly items = menuItems;
  protected readonly i18n = inject(I18nService);

  private readonly itemMinWidths: Partial<Record<MenuItem['labelKey'], number>> = {
    'nav.components': 120,
  };

  protected itemMinWidth(item: MenuItem) {
    return this.itemMinWidths[item.labelKey] ?? 84;
  }
}
