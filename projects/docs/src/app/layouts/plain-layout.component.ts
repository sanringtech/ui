import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { cn } from '@sanring/ui';
import { HeaderComponent } from '../section/header/header.component';

const plainLayoutClasses = {
  main: cn('min-h-[calc(100dvh-76px)] px-8 pb-24 pt-16', 'max-[860px]:px-5 max-[860px]:pt-8'),
};

@Component({
  selector: 'app-plain-layout',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />

    <main [class]="classes.main">
      <router-outlet />
    </main>
  `,
})
export class PlainLayoutComponent {
  protected readonly classes = plainLayoutClasses;
}
