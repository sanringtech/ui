import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { openComponentInStackBlitz } from '../../stackblitz/open-stackblitz';
import {
  ComponentPageCodeBlock,
  ComponentPageCodeCopyEvent,
  ComponentPageCodeLanguage,
} from './component-page-code-block.component';

@Component({
  selector: 'app-component-page-code-previewer',
  imports: [ComponentPageCodeBlock],
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <div class="mt-9 grid gap-4">
      <section
        class="min-w-0 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_92%,transparent)] shadow-[var(--docs-shadow-strong)]"
        role="group"
        [attr.aria-label]="i18n.t('component.previewer.preview')"
      >
        <div
          class="flex min-w-0 items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-elevated)_76%,transparent)] px-3.5 py-2.5 font-mono"
        >
          <span
            class="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-[var(--docs-fg)]"
          >
            <span class="text-[var(--docs-accent-strong)]">01</span>
            <span class="uppercase tracking-[0.08em]">{{
              i18n.t('component.previewer.preview')
            }}</span>
          </span>
          <span
            class="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-[var(--docs-muted)]"
          >
            <span class="size-1.5 rounded-full bg-[var(--docs-success)]" aria-hidden="true"></span>
            {{ i18n.t('component.previewer.rendered') }}
          </span>
        </div>

        <div
          class="grid place-items-center [background:linear-gradient(180deg,color-mix(in_srgb,var(--docs-elevated)_62%,transparent),color-mix(in_srgb,var(--docs-panel)_76%,transparent)),linear-gradient(var(--docs-bg-grid)_1px,transparent_1px),linear-gradient(90deg,var(--docs-bg-grid)_1px,transparent_1px)] [background-size:auto,30px_30px,30px_30px]"
          [class]="
            wide()
              ? 'min-h-[340px] p-4 max-[720px]:min-h-[280px] max-[720px]:p-3'
              : 'min-h-[320px] p-10 max-[720px]:min-h-[280px] max-[720px]:p-5'
          "
        >
          <ng-content select="[previewer]" />
        </div>
      </section>

      <section
        class="grid min-w-0 gap-2"
        role="group"
        [attr.aria-label]="i18n.t('component.previewer.source')"
      >
        <div class="flex min-w-0 flex-wrap items-center justify-between gap-2 px-1 font-mono">
          <span class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--docs-fg)]">
            <span class="text-[var(--docs-accent-strong)]">02</span>
            <span class="uppercase tracking-[0.08em]">{{
              i18n.t('component.previewer.source')
            }}</span>
          </span>
          <span class="flex items-center gap-3 text-[11px] text-[var(--docs-muted)]">
            <span>{{ language() }} · {{ i18n.t('component.header.copyReady') }}</span>
            @if (componentId) {
              <button
                type="button"
                class="rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] px-2 py-1 font-medium text-[var(--docs-fg)] hover:bg-[var(--docs-elevated)]"
                [disabled]="opening()"
                (click)="openStackBlitz()"
              >
                {{ opening() ? i18n.t('actions.openingStackBlitz') : i18n.t('actions.openInStackBlitz') }}
              </button>
            }
          </span>
        </div>

        <app-component-page-code-block
          [code]="code()"
          [language]="language()"
          (codeCopy)="codeCopy.emit($event)"
        />
      </section>
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');
  readonly wide = input(false);

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  protected readonly opening = signal(false);

  protected get componentId(): string | null {
    const match = /\/components\/([a-z0-9-]+)/.exec(this.router.url);
    return match?.[1] ?? null;
  }

  protected async openStackBlitz(): Promise<void> {
    const id = this.componentId;
    if (!id || this.opening()) return;
    this.opening.set(true);
    try {
      await openComponentInStackBlitz(id, this.code());
    } catch {
      this.opening.set(false);
    }
    this.opening.set(false);
  }
}
