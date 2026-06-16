import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cn } from '@sanring/ui';
import { DocsTocComponent } from './docs-toc.component';
import { DocsSidebarComponent } from '../section/sidebar/docs-sidebar.component';

const docsArticleLayoutClasses = {
  shell: cn(
    'grid min-h-[calc(100dvh-76px)] grid-cols-[260px_minmax(0,1fr)_280px]',
    'max-[1180px]:grid-cols-[240px_minmax(0,1fr)] max-[860px]:block',
  ),
  content: cn(
    'min-w-0 px-12 pb-24 pt-16',
    'max-[860px]:px-5 max-[860px]:pb-[72px] max-[860px]:pt-8',
  ),
};

@Component({
  selector: 'app-docs-article-layout',
  imports: [RouterOutlet, DocsSidebarComponent, DocsTocComponent],
  template: `
    <section [class]="classes.shell">
      <app-docs-sidebar />

      <div [class]="classes.content">
        <router-outlet />
      </div>

      <app-docs-toc />
    </section>
  `,
})
export class DocsArticleLayoutComponent {
  protected readonly classes = docsArticleLayoutClasses;
}
