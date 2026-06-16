import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cn } from '@sanring/ui';
import { DocsTocComponent } from './docs-toc.component';
import { HeaderComponent } from '../section/header/header.component';
import { DocsSidebarComponent } from '../section/sidebar/docs-sidebar.component';

const docsLayoutClasses = {
  shell: cn(
    'grid min-h-[calc(100dvh-76px)] grid-cols-[260px_minmax(0,1fr)_280px]',
    'max-[1180px]:grid-cols-[240px_minmax(0,1fr)] max-[860px]:block',
  ),
  main: cn('min-w-0 px-12 pb-24 pt-16', 'max-[860px]:px-5 max-[860px]:pb-[72px] max-[860px]:pt-8'),
};

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, HeaderComponent, DocsSidebarComponent, DocsTocComponent],
  template: `
    <app-header />

    <div [class]="classes.shell">
      <app-docs-sidebar />

      <main [class]="classes.main">
        <router-outlet />
      </main>

      <app-docs-toc />
    </div>
  `,
})
export class DocsLayoutComponent {
  protected readonly classes = docsLayoutClasses;
}
