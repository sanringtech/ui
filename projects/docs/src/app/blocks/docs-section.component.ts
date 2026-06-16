import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { cn } from '@sanring/ui';
import { DocsSidebarItem } from '../app.routes';

const docsSectionClasses = {
  heading: cn('mb-3.5 text-sm font-semibold text-[var(--docs-muted)]'),
  link: cn(
    'my-[3px] flex min-h-8 w-fit items-center rounded-lg px-3',
    'text-[15px] text-[var(--docs-fg)] no-underline',
  ),
  disabledLink: cn(
    'my-[3px] flex min-h-8 w-fit cursor-not-allowed items-center rounded-lg px-3',
    'text-[15px] text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] no-underline',
  ),
  badge: cn('ml-2 h-2 w-2 rounded-full bg-blue-500'),
};

@Component({
  selector: 'app-docs-section',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <section [class]="sectionClass">
      <p [class]="classes.heading">{{ title }}</p>

      @for (item of items; track item.name) {
        @if (item.disabled) {
          <a [class]="classes.disabledLink">{{ item.name }}</a>
        } @else {
          <a
            [class]="classes.link"
            [routerLink]="item.path"
            [routerLinkActive]="item.active ? 'bg-[var(--docs-active)]' : ''"
          >
            {{ item.name }}
            @if (item.badge) {
              <span [class]="classes.badge"></span>
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

  protected readonly classes = docsSectionClasses;
}
