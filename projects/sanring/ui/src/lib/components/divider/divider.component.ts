import { Component, Input } from '@angular/core';
import { DividerInset } from './divider.type';

@Component({
  selector: 'sanring-divider',
  standalone: true,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': "vertical ? 'vertical' : 'horizontal'",
    '[class]': 'dividerClass',
  },
  template: ``,
})
export class DividerComponent {
  @Input() vertical = false;
  @Input() inset: DividerInset = 'none';

  protected get dividerClass() {
    if (this.vertical) {
      return 'inline-block min-h-4 w-px shrink-0 self-stretch bg-[var(--sanring-border)]';
    }

    return ['block h-px bg-[var(--sanring-border)]', this.insetClass].filter(Boolean).join(' ');
  }

  private get insetClass() {
    const insetClasses: Record<DividerInset, string> = {
      none: 'w-full',
      start: 'ml-10 w-[calc(100%-2.5rem)]',
      end: 'mr-10 w-[calc(100%-2.5rem)]',
      both: 'mx-10 w-[calc(100%-5rem)]',
    };

    return insetClasses[this.inset];
  }
}
