import { Component, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { docsSectionItems } from '../../navigation/docs-navigation';
import { DocsSectionComponent } from './docs-section.component';

@Component({
  selector: 'app-docs-sections-list',
  imports: [DocsSectionComponent],
  template: ` <app-docs-section [title]="i18n.t('sidebar.sections')" [items]="items" /> `,
})
export class DocsSectionsListComponent {
  protected readonly items = docsSectionItems;
  protected readonly i18n = inject(I18nService);
}
