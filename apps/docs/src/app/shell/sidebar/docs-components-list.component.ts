import { Component, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { visibleDocsComponentItems } from '../../navigation/docs-navigation';
import { isRecentlyUpdatedComponentId } from '../../pages/changelog/component-changelog';
import { DocsSectionComponent } from './docs-section.component';

@Component({
  selector: 'app-docs-components-list',
  imports: [DocsSectionComponent],
  template: `
    <app-docs-section [title]="i18n.t('sidebar.components')" [items]="items" sectionClass="mt-11" />
  `,
})
export class DocsComponentsListComponent {
  protected readonly items = visibleDocsComponentItems.map((item) => ({
    ...item,
    badge: isRecentlyUpdatedComponentId(item.id),
  }));
  protected readonly i18n = inject(I18nService);
}
