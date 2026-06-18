import { Component, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { DocsTocService } from '../sections/toc/docs-toc.service';
import { ComponentPageSectionDefinition } from './component-page.types';

@Component({
  selector: 'app-component-page',
  standalone: true,
  template: `
    <article class="mx-auto max-w-[832px] text-[var(--docs-fg)]">
      <ng-content />
    </article>
  `,
})
export class ComponentPageComponent implements OnChanges, OnDestroy {
  @Input() sections: readonly ComponentPageSectionDefinition[] = [];

  private readonly i18n = inject(I18nService);
  private readonly toc = inject(DocsTocService);

  ngOnChanges() {
    this.toc.setItems(
      this.sections
        .filter((section) => !section.hideFromToc)
        .map((section) => ({
          id: section.id,
          label: this.i18n.t(section.titleKey),
          level: section.level ?? 2,
        })),
    );
  }

  ngOnDestroy() {
    this.toc.clearItems();
  }
}
