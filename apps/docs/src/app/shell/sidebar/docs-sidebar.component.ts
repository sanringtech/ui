import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DocsNavStateService } from '../docs-nav-state.service';
import { DocsComponentsListComponent } from './docs-components-list.component';
import { DocsSectionsListComponent } from './docs-sections-list.component';

@Component({
  selector: 'app-docs-sidebar',
  imports: [DocsSectionsListComponent, DocsComponentsListComponent],
  template: `
    <aside
      class="docs-sidebar-scroll sticky top-[76px] hidden h-[calc(100dvh-76px)] overflow-auto border-r border-[color-mix(in_srgb,var(--docs-border)_76%,transparent)] bg-[color-mix(in_srgb,var(--docs-bg)_72%,transparent)] py-10 pl-[30px] pr-7 backdrop-blur-xl min-[861px]:block"
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
    `,
  ],
})
export class DocsSidebarComponent implements OnInit {
  protected readonly navState = inject(DocsNavStateService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.navState.hasSidebar.set(true);
    this.destroyRef.onDestroy(() => {
      this.navState.hasSidebar.set(false);
      this.navState.mobileNavOpen.set(false);
    });
  }
}
