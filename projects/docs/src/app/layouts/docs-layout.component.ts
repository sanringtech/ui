import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cn } from '@sanring/ui';
import { FooterComponent } from '../section/footer/footer.component';
import { HeaderComponent } from '../section/header/header.component';

const docsLayoutClasses = {
  root: cn('min-h-dvh bg-[var(--docs-bg)] text-[var(--docs-fg)]'),
  main: cn('min-h-[calc(100dvh-76px)]'),
};

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div [class]="classes.root">
      <app-header />

      <main [class]="classes.main">
        <router-outlet />
      </main>

      <!-- <app-footer /> -->
    </div>
  `,
})
export class DocsLayoutComponent {
  protected readonly classes = docsLayoutClasses;
}
