import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocsSidebarComponent } from '../shell/sidebar/docs-sidebar.component';
import { DocsTocComponent } from '../shell/toc/docs-toc.component';

@Component({
  selector: 'app-docs-article-shell',
  imports: [RouterOutlet, DocsSidebarComponent, DocsTocComponent],
  template: `
    <section
      class="grid min-h-[calc(100dvh-76px)] grid-cols-[260px_minmax(0,1fr)_260px] max-[1180px]:grid-cols-[240px_minmax(0,1fr)_210px] max-[980px]:grid-cols-[240px_minmax(0,1fr)] max-[860px]:block"
    >
      <app-docs-sidebar />

      <div
        class="min-w-0 px-12 pb-24 pt-14 max-[1180px]:px-8 max-[980px]:px-7 max-[860px]:px-5 max-[860px]:pb-[72px] max-[860px]:pt-8"
      >
        <router-outlet />
      </div>

      <app-docs-toc />
    </section>
  `,
})
export class DocsArticleShellComponent {}
