import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { cn } from '../../utils';
import { Badge, type BadgeVariant } from '../badge';

@Component({
  selector: 'sanring-tag',
  standalone: true,
  imports: [Badge, LucideX],
  template: `
    <span sanringBadge [variant]="variant" [class]="tagClass">
      <ng-content />

      @if (closable) {
        <button
          type="button"
          class="ml-1 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-full text-current opacity-60 transition-opacity hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/20 focus-visible:outline-none"
          aria-label="Remove tag"
          (click)="onRemove($event)"
        >
          <svg class="size-3" lucideX></svg>
        </button>
      }
    </span>
  `,
})
export class Tag {
  @Input() class = '';
  @Input() variant: BadgeVariant = 'secondary';
  @Input({ transform: booleanAttribute }) closable = false;

  @Output() remove = new EventEmitter<MouseEvent>();

  protected get tagClass() {
    return cn('pl-2.5', this.closable ? 'pr-1' : 'pr-2.5', this.class);
  }

  protected onRemove(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(event);
  }
}
