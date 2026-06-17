import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menuItems } from '../../app.routes';

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex min-w-0 items-center" aria-label="Primary">
      @for (item of items; track item.path) {
        <a
          class="whitespace-nowrap rounded-[5px] px-4 py-1.5 text-[15px] font-medium text-[var(--docs-fg)] no-underline transition-colors hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] max-[980px]:hidden"
          [routerLink]="item.path"
          routerLinkActive="!block"
          [routerLinkActiveOptions]="{ exact: item.exact }"
        >
          {{ item.name }}
        </a>
      }
    </nav>
  `,
})
export class MenuListComponent {
  protected readonly items = menuItems;
}
