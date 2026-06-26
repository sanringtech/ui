import { Component, Input } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { cn } from '../../utils';
import { ScrollAreaOrientation } from './scroll-area.type';

@Component({
  selector: 'sanring-scroll-area',
  standalone: true,
  hostDirectives: [CdkScrollable],
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.role]': 'scrollAreaRole',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    '[class]': 'scrollAreaClass',
  },
  styles: [
    `
      :host {
        display: block;
        box-sizing: border-box;
        min-width: 0;
        max-width: 100%;
        --scrollbar-thumb: #cbd5e1;
        --scrollbar-track: transparent;
      }

      :host::-webkit-scrollbar {
        width: 8px;
      }

      :host::-webkit-scrollbar:horizontal {
        height: 8px;
      }

      :host::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 4px;
      }

      :host::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
      }
    `,
  ],
})
export class ScrollAreaComponent {
  @Input() class = '';
  @Input() orientation: ScrollAreaOrientation = 'vertical';
  @Input() hideScrollbar = false;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledby?: string;

  protected get scrollAreaClass() {
    return cn(
      'relative',
      this.orientationClass,
      this.hideScrollbar && '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
      this.class,
    );
  }

  protected get scrollAreaRole() {
    return this.ariaLabel || this.ariaLabelledby ? 'region' : null;
  }

  private get orientationClass() {
    switch (this.orientation) {
      case 'horizontal':
        return 'overflow-x-auto overflow-y-hidden';
      case 'both':
        return 'overflow-auto';
      default:
        return 'overflow-y-auto overflow-x-hidden';
    }
  }
}
