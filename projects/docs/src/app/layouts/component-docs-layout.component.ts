import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-component-docs-layout',
  imports: [RouterOutlet],
  template: `
    <section class="mx-auto min-w-0 max-w-[832px]">
      <div class="min-w-0">
        <router-outlet />
      </div>
    </section>
  `,
})
export class ComponentDocsLayoutComponent {}
