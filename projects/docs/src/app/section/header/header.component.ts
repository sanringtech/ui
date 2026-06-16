import { Component } from '@angular/core';
import { cn } from '@sanring/ui';
import { FeatureListComponent } from './feature-list.component';
import { MenuListComponent } from './menu-list.component';

@Component({
  selector: 'app-header',
  imports: [MenuListComponent, FeatureListComponent],
  template: `
    <header [class]="classes.root">
      <app-menu-list />
      <app-feature-list />
    </header>
  `,
})
export class HeaderComponent {
  protected readonly classes = {
    root: cn(
      'sticky top-0 z-20 flex h-[76px] items-center justify-between',
      'border-b border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-bg)_92%,transparent)]',
      'px-8 backdrop-blur-2xl',
      'max-[860px]:h-auto max-[860px]:min-h-[76px] max-[860px]:flex-wrap',
      'max-[860px]:gap-4 max-[860px]:px-5 max-[860px]:py-4',
    ),
  };
}
