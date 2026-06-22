import { Component, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'cardClass',
  },
})
export class CardComponent {
  @Input() class = '';

  protected get cardClass() {
    return cn(
      // 加上 block 確保自定義標籤能佔滿寬度
      'block rounded-xl border border-[var(--sanring-border)] bg-[var(--sanring-surface)] text-[var(--sanring-foreground)] shadow-sm',
      this.class,
    );
  }
}
