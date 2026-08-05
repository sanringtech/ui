import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-component-docs-layout',
  imports: [RouterOutlet],
  template: `
    <section class="min-w-0">
      <div class="min-w-0">
        <router-outlet />
      </div>
    </section>
  `,
})
export class ComponentDocsLayoutComponent {}
