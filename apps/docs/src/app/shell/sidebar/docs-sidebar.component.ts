import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SANRING_SHEET_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { DocsNavStateService } from '../docs-nav-state.service';
import { DocsComponentsListComponent } from './docs-components-list.component';
import { DocsSectionsListComponent } from './docs-sections-list.component';

@Component({
  selector: 'app-docs-sidebar',
  imports: [
    DocsSectionsListComponent,
    DocsComponentsListComponent,
    SANRING_SHEET_IMPORTS,
  ],
  template: `
    <sanring-sheet [(isOpen)]="navState.mobileNavOpen">
      <aside
        class="docs-sidebar-scroll sticky top-[76px] hidden h-[calc(100dvh-76px)] overflow-auto border-r border-[var(--docs-border)] bg-[var(--docs-bg)] py-12 pl-[30px] pr-7 min-[861px]:block"
      >
        <app-docs-sections-list />
        <app-docs-components-list />
      </aside>

      <sanring-sheet-content side="left" class="flex flex-col">
        <sanring-sheet-header>
          <sanring-sheet-title>{{ i18n.t('sidebar.navigationTitle') }}</sanring-sheet-title>
        </sanring-sheet-header>

        <div
          class="min-h-0 flex-1 overflow-auto px-6 pb-6"
          (click)="navState.mobileNavOpen.set(false)"
        >
          <app-docs-sections-list />
          <app-docs-components-list />
        </div>
      </sanring-sheet-content>
    </sanring-sheet>
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
  protected readonly i18n = inject(I18nService);
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
