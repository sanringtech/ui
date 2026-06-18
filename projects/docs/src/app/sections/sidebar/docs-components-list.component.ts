import { Component, inject } from '@angular/core';
import { DocsSectionComponent } from '../../blocks/docs-section.component';
import { docsComponentItems } from '../../docs-navigation';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-docs-components-list',
  imports: [DocsSectionComponent],
  template: `
    <app-docs-section
      [title]="i18n.t('sidebar.components')"
      [items]="items"
      sectionClass="mt-11 max-[860px]:mt-0 max-[860px]:min-w-max"
    />
  `,
})
export class DocsComponentsListComponent {
  protected readonly items = docsComponentItems;
  protected readonly i18n = inject(I18nService);
}
