import { Component } from '@angular/core';
import { DocsComponentsListComponent } from './docs-components-list.component';
import { DocsSectionsListComponent } from './docs-sections-list.component';

@Component({
  selector: 'app-docs-sidebar',
  imports: [DocsSectionsListComponent, DocsComponentsListComponent],
  template: `
    <aside
      class="docs-sidebar-scroll sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto border-r border-[var(--docs-border)] bg-[var(--docs-bg)] py-12 pl-[30px] pr-7 max-[860px]:static max-[860px]:flex max-[860px]:h-auto max-[860px]:gap-5 max-[860px]:overflow-x-auto max-[860px]:overflow-y-hidden max-[860px]:border-b max-[860px]:border-r-0 max-[860px]:px-5 max-[860px]:py-[18px]"
    >
      <app-docs-sections-list />
      <app-docs-components-list />
    </aside>
  `,
  styles: [
    `
      .docs-sidebar-scroll {
        scrollbar-width: none;
        -ms-overflow-style: none;
        mask-image: linear-gradient(
          to bottom,
          transparent 0,
          #000 42px,
          #000 calc(100% - 42px),
          transparent 100%
        );
      }

      .docs-sidebar-scroll::-webkit-scrollbar {
        display: none;
      }

      @media (max-width: 860px) {
        .docs-sidebar-scroll {
          mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 22px,
            #000 calc(100% - 22px),
            transparent 100%
          );
        }
      }
    `,
  ],
})
export class DocsSidebarComponent {}
