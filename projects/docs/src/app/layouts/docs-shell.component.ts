import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent, ToastService } from '@sanring/ui';
import { HeaderComponent } from '../shell/header/header.component';

@Component({
  selector: 'app-docs-shell',
  imports: [RouterOutlet, HeaderComponent, ToasterComponent],
  providers: [ToastService],
  template: `
    <div class="min-h-dvh bg-[var(--docs-bg)] text-[var(--docs-fg)]">
      <app-header />

      <main class="min-h-[calc(100dvh-76px)]">
        <router-outlet />
      </main>

      <!-- <app-footer /> -->
    </div>

    <sanring-toaster position="bottom-right" [maxToasts]="3" />
  `,
})
export class DocsShellComponent {}
