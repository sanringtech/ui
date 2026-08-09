import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { LucideExternalLink } from '@lucide/angular';
import { ToastService } from '@sanring/ui';
import {
  ComponentPageCodeBlock,
  ComponentPageCodeCopyEvent,
  ComponentPageCodeLanguage,
} from './component-page-code-block.component';
import { I18nService } from '../../i18n/i18n.service';
import { openSanringStackBlitz } from '../../stackblitz/open';

@Component({
  selector: 'app-component-page-code-previewer',
  imports: [ComponentPageCodeBlock, LucideExternalLink],
  standalone: true,
  template: `
    <div
      class="mt-9 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-2xl"
    >
      <div
        class="relative grid place-items-center max-[720px]:min-h-80"
        [class]="
          wide()
            ? 'min-h-[390px] p-4 pt-16 max-[720px]:p-3 max-[720px]:pt-14'
            : 'min-h-[390px] p-11 pt-16 max-[720px]:p-6 max-[720px]:pt-14'
        "
      >
        @if (stackBlitzComponentName()) {
          <button
            type="button"
            class="absolute right-3 top-3 inline-flex h-8 items-center gap-2 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-2.5 text-sm font-medium text-[var(--docs-fg)] shadow-sm transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
            [attr.aria-label]="i18n.t('actions.openStackBlitz')"
            [attr.title]="i18n.t('actions.openStackBlitz')"
            (click)="openStackBlitz()"
          >
            <svg lucideExternalLink class="size-4"></svg>
            <span class="max-[420px]:sr-only">{{ i18n.t('actions.openStackBlitz') }}</span>
          </button>
        }
        <ng-content select="[previewer]" />
      </div>

      <div class="border-t border-[var(--docs-border)]">
        <app-component-page-code-block
          [code]="code()"
          [language]="language()"
          (codeCopy)="codeCopy.emit($event)"
        />
      </div>
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');
  readonly wide = input(false);
  readonly stackBlitzComponentName = input('');
  readonly stackBlitzCode = input('');
  readonly stackBlitzComponentBody = input('');
  readonly stackBlitzImports = input('');
  readonly stackBlitzTitle = input('');

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  protected readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);

  protected async openStackBlitz(): Promise<void> {
    const componentName = this.stackBlitzComponentName();
    if (!componentName) {
      return;
    }

    try {
      await openSanringStackBlitz({
        componentName,
        code: this.stackBlitzCode() || this.code(),
        componentBody: this.stackBlitzComponentBody() || undefined,
        imports: this.stackBlitzImports(),
        title: this.stackBlitzTitle() || undefined,
      });
    } catch {
      this.toast.show({
        type: 'error',
        title: this.i18n.t('actions.openFailed'),
        duration: 3000,
        closable: true,
      });
    }
  }
}
