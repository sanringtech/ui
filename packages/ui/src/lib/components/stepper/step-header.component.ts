import { NgTemplateOutlet } from '@angular/common';
import { CdkStepHeader } from '@angular/cdk/stepper';
import { Component, TemplateRef, computed, input } from '@angular/core';
import { LucideCheck, LucideCircleAlert } from '@lucide/angular';
import { cn } from '../../utils';
import { StepIconContext, StepState } from './stepper.type';

@Component({
  selector: 'sanring-step-header',
  standalone: true,
  imports: [NgTemplateOutlet, LucideCheck, LucideCircleAlert],
  hostDirectives: [CdkStepHeader],
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': '"tab"',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() || !selected() ? -1 : 0',
  },
  template: `
    <div [class]="circleClass()">
      @if (iconTemplate()) {
        <ng-container
          [ngTemplateOutlet]="iconTemplate()"
          [ngTemplateOutletContext]="iconContext()"
        />
      } @else if (state() === 'completed') {
        <svg class="size-4" lucideCheck></svg>
      } @else if (state() === 'error') {
        <svg class="size-4" lucideCircleAlert></svg>
      } @else {
        <span>{{ index() }}</span>
      }
    </div>

    <div class="min-w-0 flex flex-col items-start justify-center">
      <span [class]="labelClass()">
        @if (labelTemplate()) {
          <ng-container [ngTemplateOutlet]="labelTemplate()" />
        } @else {
          {{ label() }}
        }
      </span>
      @if (optional()) {
        <span class="text-xs text-[var(--sanring-muted)]">{{ optionalLabel() }}</span>
      }
    </div>
  `,
})
export class StepHeaderComponent {
  readonly state = input<StepState>('default');
  readonly selected = input<boolean>(false);
  readonly label = input<string>('');
  readonly labelTemplate = input<TemplateRef<unknown> | null | undefined>();
  readonly index = input<number>(1);
  readonly optional = input<boolean>(false);
  readonly optionalLabel = input('Optional');
  readonly disabled = input<boolean>(false);
  readonly iconTemplate = input<TemplateRef<StepIconContext> | null | undefined>();
  readonly class = input<string | undefined>();

  protected readonly iconContext = computed<StepIconContext>(() => ({
    $implicit: this.index(),
    index: this.index(),
    state: this.state(),
  }));

  protected readonly hostClass = computed(() =>
    cn(
      'group flex min-w-0 cursor-pointer items-center gap-3 rounded-[var(--sanring-radius-sm)] outline-none transition-opacity',
      'focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2',
      this.disabled() && 'pointer-events-none cursor-not-allowed opacity-50',
      this.class(),
    ),
  );

  protected readonly circleClass = computed(() => {
    const state = this.state();

    return cn(
      'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-200',
      state === 'selected' &&
        'border-[var(--sanring-foreground)] bg-[var(--sanring-background)] text-[var(--sanring-foreground)]',
      state === 'completed' &&
        'border-[var(--sanring-foreground)] bg-[var(--sanring-foreground)] text-[var(--sanring-background)]',
      state === 'error' && 'border-red-500 bg-red-500 text-white',
      state !== 'selected' &&
        state !== 'completed' &&
        state !== 'error' &&
        'border-[var(--sanring-border-strong)] text-[var(--sanring-muted)]',
    );
  });

  protected readonly labelClass = computed(() => {
    const state = this.state();

    return cn(
      'truncate text-sm font-medium transition-colors duration-200',
      (state === 'selected' || state === 'completed') && 'text-[var(--sanring-foreground)]',
      state === 'error' && 'text-red-500',
      state !== 'selected' &&
        state !== 'completed' &&
        state !== 'error' &&
        'text-[var(--sanring-muted)]',
    );
  });
}
