import { Component } from '@angular/core';

@Component({
  selector: 'sanring-menu-separator',
  standalone: true,
  template: `<hr class="sanring-separator" role="separator" />`,
  styles: [
    `
      .sanring-separator {
        margin: 8px 0;
        border: none;
        border-top: 1px solid #e5e7eb; /* 淺灰色分隔線 */
      }
    `,
  ],
})
export class MenuSeparatorComponent {}
