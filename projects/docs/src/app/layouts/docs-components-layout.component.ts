import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cn } from '@sanring/ui';

const docsComponentsLayoutClasses = {
  root: cn('mx-auto min-w-0 max-w-[832px]'),
  content: cn('min-w-0'),
};

@Component({
  selector: 'app-docs-components-layout',
  imports: [RouterOutlet],
  template: `
    <section [class]="classes.root">
      <div [class]="classes.content">
        <router-outlet />
      </div>
    </section>
  `,
})
export class DocsComponentsLayoutComponent {
  protected readonly classes = docsComponentsLayoutClasses;
}
