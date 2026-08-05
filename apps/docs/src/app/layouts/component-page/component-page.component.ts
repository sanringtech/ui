import { Component, effect, inject, Input, OnChanges, OnDestroy, input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { DocsTocItem, DocsTocService } from '../../shell/toc/docs-toc.service';

@Component({
  selector: 'app-component-page',
  standalone: true,
  template: `
    <article
      class="mx-auto text-[var(--docs-fg)]"
      [class]="wide() ? 'max-w-[960px]' : 'max-w-[832px]'"
    >
      <ng-content />
    </article>
  `,
})
export class ComponentPageComponent implements OnChanges, OnDestroy {
  @Input() sections: readonly ComponentPageSectionDefinition[] = [];
  readonly wide = input(false);

  private readonly i18n = inject(I18nService);
  private readonly toc = inject(DocsTocService);

  constructor() {
    effect(() => {
      this.i18n.locale();
      this.updateToc();
    });
  }

  ngOnChanges() {
    this.updateToc();
  }

  ngOnDestroy() {
    this.toc.clearItems();
  }

  private updateToc() {
    this.toc.setItems(this.flattenSections(this.sections));
  }

  private flattenSections(sections: readonly ComponentPageSectionDefinition[]): DocsTocItem[] {
    return sections.flatMap((section) => [
      ...(section.hideFromToc
        ? []
        : [
            {
              id: section.id,
              label: this.i18n.t(section.titleKey),
              level: section.level ?? 2,
            },
          ]),
      ...this.flattenSections(section.children ?? []),
    ]);
  }
}
