import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../sections/header/header.component';

@Component({
  selector: 'app-docs-shell',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-dvh bg-[var(--docs-bg)] text-[var(--docs-fg)]">
      <app-header />

      <main class="min-h-[calc(100dvh-76px)]">
        <router-outlet />
      </main>

      <!-- <app-footer /> -->
    </div>
  `,
})
export class DocsShellComponent {}
