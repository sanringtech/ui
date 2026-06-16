import { Component } from '@angular/core';
import { cn } from '@sanring/ui';
import { DocsSectionComponent } from '../../blocks/docs-section.component';
import { docsComponentItems } from '../../app.routes';

const docsComponentsListClasses = {
  root: cn('mt-11 max-[860px]:mt-0 max-[860px]:min-w-max'),
};

@Component({
  selector: 'app-docs-components-list',
  imports: [DocsSectionComponent],
  template: `
    <app-docs-section title="Components" [items]="items" [sectionClass]="classes.root" />
  `,
})
export class DocsComponentsListComponent {
  protected readonly classes = docsComponentsListClasses;
  protected readonly items = docsComponentItems;
}
