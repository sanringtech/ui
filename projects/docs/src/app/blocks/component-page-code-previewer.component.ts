import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { LucideClipboard } from '@lucide/angular';

import { I18nService } from '../i18n/i18n.service';

export interface ComponentPageCodeCopyEvent {
  code: string;
  success: boolean;
  error?: unknown;
}

@Component({
  selector: 'app-component-page-code-previewer',
  imports: [LucideClipboard],
  standalone: true,
  template: `
    <div
      class="mt-9 overflow-hidden rounded-2xl border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-2xl"
    >
      <div class="grid min-h-[390px] place-items-center p-11 max-[720px]:min-h-80 max-[720px]:p-6">
        <ng-content select="[previewer]" />
      </div>

      <div class="relative border-t border-[var(--docs-border)] bg-[var(--docs-code)]">
        <button
          type="button"
          class="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-md border border-[var(--docs-border)] bg-[var(--docs-elevated)] text-[var(--docs-muted)] transition-colors hover:text-[var(--docs-fg)]"
          [attr.aria-label]="i18n.t('actions.copyCode')"
          (click)="copyCode()"
        >
          <svg class="size-4" lucideClipboard></svg>
        </button>

        <pre
          class="m-0 overflow-auto px-10 py-7 pr-16 text-[15px] leading-[1.7] text-[#d4d4d4]"
        ><code #codeContent><ng-content select="[code]" /></code></pre>
      </div>
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  @ViewChild('codeContent', { static: true })
  private codeContent?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(I18nService);

  protected async copyCode() {
    const code = this.codeContent?.nativeElement.textContent ?? '';

    try {
      await navigator.clipboard.writeText(code);
      this.codeCopy.emit({ code, success: true });
    } catch (error) {
      this.codeCopy.emit({ code, success: false, error });
    }
  }
}
