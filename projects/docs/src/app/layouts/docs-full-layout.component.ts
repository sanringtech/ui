import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs-full-layout',
  imports: [RouterOutlet],
  template: `
    <section
      class="mx-auto w-full max-w-[1180px] px-8 pb-24 pt-16 max-[860px]:px-5 max-[860px]:pt-8"
    >
      <router-outlet />
    </section>
  `,
})
export class DocsFullLayoutComponent {}
