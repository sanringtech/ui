import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { MenuItem as ngMenuItem } from '@angular/aria/menu';
import { LucideChevronRight } from '@lucide/angular';
import { cn } from '../shared/utils';
import { MENU_ITEM_SIZE_CLASS } from '../shared/component-styles';
import { DropdownMenuSubComponent } from './dropdown-menu-sub.component';
import { DropdownMenuItemVariant } from './dropdown-menu.type';

@Component({
  selector: 'sanring-dropdown-menu-sub-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideChevronRight],
  hostDirectives: [
    {
      directive: ngMenuItem,
      inputs: ['value', 'disabled', 'submenu'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[class]': 'itemClass()',
  },
  template: `
    <ng-content></ng-content>
    <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
  `,
})
export class DropdownMenuSubTriggerComponent {
  private readonly sub = inject(DropdownMenuSubComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string | undefined>();
  readonly variant = input<DropdownMenuItemVariant>('default');

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[active=true]:bg-[var(--sanring-surface-strong)] data-[expanded=true]:bg-[var(--sanring-surface-strong)]',
      this.variant() === 'destructive' &&
        'text-[var(--sanring-error-50)] hover:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] focus:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] data-[active=true]:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)]',
      'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    this.sub.registerTrigger(this.elementRef);
  }
}
