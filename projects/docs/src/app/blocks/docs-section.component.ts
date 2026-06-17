import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocsSidebarItem } from '../app.routes';

@Component({
  selector: 'app-docs-section',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <section [class]="sectionClass">
      <p class="mb-2.5 text-xs font-semibold text-[var(--docs-muted)]">{{ title }}</p>

      @for (item of items; track item.name) {
        @if (item.disabled) {
          <a
            class="my-[3px] flex min-h-8 w-fit cursor-not-allowed items-center rounded-lg px-3 text-sm text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] no-underline"
          >
            {{ item.name }}
          </a>
        } @else {
          <a
            class="my-[3px] flex min-h-8 w-fit items-center rounded-lg px-3 text-sm text-[var(--docs-fg)] no-underline"
            [routerLink]="item.path"
            [routerLinkActive]="item.active ? 'bg-[var(--docs-active)]' : ''"
          >
            {{ item.name }}
            @if (item.badge) {
              <span class="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
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
}
