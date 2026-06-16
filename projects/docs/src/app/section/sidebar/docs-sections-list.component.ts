import { Component } from '@angular/core';
import { DocsSectionComponent } from '../../blocks/docs-section.component';
import { docsSectionItems } from '../../app.routes';

@Component({
  selector: 'app-docs-sections-list',
  imports: [DocsSectionComponent],
  template: ` <app-docs-section title="Sections" [items]="items" /> `,
})
export class DocsSectionsListComponent {
  protected readonly items = docsSectionItems;
}
