import { Component, Input } from '@angular/core';
import { LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy } from '@lucide/angular';
import { cn } from '@sanring/ui';

const componentPageHeaderClasses = {
  root: cn(
    'mb-10 flex items-start justify-between gap-6 border-b border-[var(--docs-border)] pb-7',
    'max-[720px]:block',
  ),
  heading: cn('min-w-0'),
  title: cn('m-0 text-[30px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]'),
  description: cn('mb-0 mt-2 max-w-[560px] text-base leading-relaxed text-[var(--docs-muted)]'),
  actions: cn('flex shrink-0 items-center gap-2 max-[720px]:mt-6'),
  copyButton: cn(
    'inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border-0',
    'bg-[var(--docs-elevated)] px-3 text-sm font-semibold text-[var(--docs-fg)]',
  ),
  iconButton: cn(
    'grid size-8 cursor-pointer place-items-center rounded-lg border-0',
    'bg-[var(--docs-elevated)] text-[var(--docs-fg)]',
  ),
  icon: cn('size-4'),
};

@Component({
  selector: 'app-component-page-header',
  imports: [LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy],
  template: `
    <header [class]="classes.root">
      <div [class]="classes.heading">
        <h1 [class]="classes.title">{{ title }}</h1>
        <p [class]="classes.description">{{ description }}</p>
      </div>

      <div [class]="classes.actions">
        <button type="button" [class]="classes.copyButton">
          <svg [class]="classes.icon" lucideCopy></svg>
          <span>Copy Page</span>
          <svg [class]="classes.icon" lucideChevronDown></svg>
        </button>

        <button type="button" [class]="classes.iconButton" aria-label="Previous page">
          <svg [class]="classes.icon" lucideArrowLeft></svg>
        </button>

        <button type="button" [class]="classes.iconButton" aria-label="Next page">
          <svg [class]="classes.icon" lucideArrowRight></svg>
        </button>
      </div>
    </header>
  `,
})
export class ComponentPageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';

  protected readonly classes = componentPageHeaderClasses;
}
