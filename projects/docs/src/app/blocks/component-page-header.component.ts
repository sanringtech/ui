import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy } from '@lucide/angular';
import { Button } from '@sanring/ui';
import {
  DocsComponentId,
  DocsComponentNavItem,
  getAdjacentDocsComponent,
} from '../docs-navigation';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-component-page-header',
  imports: [Button, LucideArrowLeft, LucideArrowRight, LucideChevronDown, LucideCopy],
  template: `
    <header
      class="mb-10 flex items-start justify-between gap-6 border-b border-[var(--docs-border)] pb-7 max-[720px]:block"
    >
      <div class="min-w-0">
        <h1
          class="m-0 text-[30px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ title }}
        </h1>
        <p class="mb-0 mt-2 max-w-[560px] text-base leading-relaxed text-[var(--docs-muted)]">
          {{ description }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2 max-[720px]:mt-6">
        <sanring-button type="button" variant="secondary" size="sm">
          <svg class="size-4" lucideCopy></svg>
          <span>{{ i18n.t('actions.copyPage') }}</span>
          <svg class="size-4" lucideChevronDown></svg>
        </sanring-button>

        <sanring-button
          type="button"
          variant="secondary"
          size="icon"
          [ariaLabel]="i18n.t('actions.previousPage')"
          [disabled]="!previousComponent"
          (click)="goToComponent(previousComponent)"
        >
          <svg class="size-4" lucideArrowLeft></svg>
        </sanring-button>

        <sanring-button
          type="button"
          variant="secondary"
          size="icon"
          [ariaLabel]="i18n.t('actions.nextPage')"
          [disabled]="!nextComponent"
          (click)="goToComponent(nextComponent)"
        >
          <svg class="size-4" lucideArrowRight></svg>
        </sanring-button>
      </div>
    </header>
  `,
})
export class ComponentPageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input() componentId: DocsComponentId | null = null;

  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  protected get previousComponent() {
    return this.componentId ? getAdjacentDocsComponent(this.componentId).previous : null;
  }

  protected get nextComponent() {
    return this.componentId ? getAdjacentDocsComponent(this.componentId).next : null;
  }

  protected goToComponent(component: DocsComponentNavItem | null) {
    if (!component) {
      return;
    }

    void this.router.navigateByUrl(component.path);
  }
}
