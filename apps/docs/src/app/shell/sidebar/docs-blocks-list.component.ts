import { Component, inject, Input } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { docsBlockItems } from '../../navigation/docs-navigation';
import { DocsSectionComponent } from './docs-section.component';

@Component({
  selector: 'app-docs-blocks-list',
  imports: [DocsSectionComponent],
  template: `
    <app-docs-section [title]="i18n.t('sidebar.blocks')" [items]="items" [sectionClass]="sectionClass" />
  `,
})
export class DocsBlocksListComponent {
  @Input() sectionClass = 'mt-11';

  protected readonly items = docsBlockItems;
  protected readonly i18n = inject(I18nService);
}
