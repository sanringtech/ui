import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { menuItems, type MenuItem } from '../../navigation/menu-navigation';

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex min-w-0 items-center gap-3" aria-label="Primary">
      <a
        class="mr-1 inline-flex size-10 flex-none items-center justify-center rounded-[8px] border border-[color-mix(in_srgb,var(--docs-accent)_36%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-surface))] transition-colors hover:bg-[color-mix(in_srgb,var(--docs-accent)_14%,var(--docs-elevated))]"
        routerLink="/"
        [attr.aria-label]="i18n.t('nav.home')"
      >
        <img class="size-6" src="sanring_ui.svg" alt="" />
      </a>

      @for (item of items; track item.labelKey) {
        <a
          class="inline-flex justify-center whitespace-nowrap rounded-[5px] px-4 py-1.5 text-center text-[15px] font-medium text-[var(--docs-fg)] no-underline transition-colors hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] max-[980px]:hidden"
          [routerLink]="item.path"
          routerLinkActive="!block"
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
    'nav.home': 72,
    'nav.docs': 64,
    'nav.components': 120,
    'nav.blocks': 84,
    'nav.charts': 84,
    'nav.directory': 108,
    'nav.create': 84,
  };

  protected itemMinWidth(item: MenuItem) {
    return this.itemMinWidths[item.labelKey] ?? 84;
  }
}
