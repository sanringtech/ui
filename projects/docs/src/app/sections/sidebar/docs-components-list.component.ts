import { Component } from '@angular/core';
import { DocsSectionComponent } from '../../blocks/docs-section.component';
import { docsComponentItems } from '../../app.routes';

@Component({
  selector: 'app-docs-components-list',
  imports: [DocsSectionComponent],
  template: `
    <app-docs-section
      title="Components"
      [items]="items"
      sectionClass="mt-11 max-[860px]:mt-0 max-[860px]:min-w-max"
    />
  `,
})
export class DocsComponentsListComponent {
  protected readonly items = docsComponentItems;
}
