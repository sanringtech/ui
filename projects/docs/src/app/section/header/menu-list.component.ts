import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cn } from '@sanring/ui';
import { menuItems } from '../../app.routes';

const menuListClasses = {
  nav: cn('flex min-w-0 items-center'),
  link: cn(
    'whitespace-nowrap rounded-[5px] px-4 py-1.5 text-[15px] font-medium no-underline',
    'text-[var(--docs-fg)] transition-colors',
    'max-[980px]:hidden',
    'hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)]',
  ),
};

@Component({
  selector: 'app-menu-list',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav [class]="classes.nav" aria-label="Primary">
      @for (item of items; track item.path) {
        <a
          [class]="classes.link"
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
  protected readonly classes = menuListClasses;
  protected readonly items = menuItems;
}
