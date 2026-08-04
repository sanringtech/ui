import { Component } from '@angular/core';
import { FeatureListComponent } from './feature-list.component';
import { MenuListComponent } from './menu-list.component';

@Component({
  selector: 'app-header',
  imports: [MenuListComponent, FeatureListComponent],
  template: `
    <header
      class="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-bg)_92%,transparent)] px-8 backdrop-blur-2xl max-[860px]:h-auto max-[860px]:min-h-0 max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-3 max-[860px]:px-5 max-[860px]:py-4 max-[520px]:px-4 max-[520px]:py-3"
    >
      <app-menu-list />
      <app-feature-list />
    </header>
  `,
})
export class HeaderComponent {}
