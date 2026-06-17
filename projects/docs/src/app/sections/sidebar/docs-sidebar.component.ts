import { Component } from '@angular/core';
import { DocsComponentsListComponent } from './docs-components-list.component';
import { DocsSectionsListComponent } from './docs-sections-list.component';

@Component({
  selector: 'app-docs-sidebar',
  imports: [DocsSectionsListComponent, DocsComponentsListComponent],
  template: `
    <aside
      class="sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto border-r border-[var(--docs-border)] bg-[var(--docs-bg)] py-12 pl-[30px] pr-7 max-[860px]:static max-[860px]:flex max-[860px]:h-auto max-[860px]:gap-5 max-[860px]:overflow-x-auto max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:px-5 max-[860px]:py-[18px]"
    >
      <app-docs-sections-list />
      <app-docs-components-list />
    </aside>
  `,
})
export class DocsSidebarComponent {}
