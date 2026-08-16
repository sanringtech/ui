import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideLayers3 } from '@lucide/angular';
import { ButtonDirective, DialogService, SANRING_DIALOG_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-home-hero-demo-panel',
  standalone: true,
  imports: [ButtonDirective, SANRING_DIALOG_IMPORTS, LucideLayers3],
  template: `
    <div
      class="min-w-0 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-code)] p-5 text-[var(--docs-code-fg)] shadow-[var(--docs-shadow-soft)] lg:mt-6 lg:p-6 max-[520px]:p-4"
    >
      <div
        class="flex min-w-0 items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] pb-4"
      >
        <div
          class="flex min-w-0 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--docs-accent)]"
        >
          <svg class="size-4 shrink-0" lucideLayers3></svg
          ><span class="truncate">{{ i18n.t('home.hero.panel.eyebrow') }}</span>
        </div>
        <span
          class="shrink-0 font-mono text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]"
          >{{ i18n.t('home.hero.panel.status') }}</span
        >
      </div>

      <div
        class="mt-5 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-code-fg)_22%,transparent)] bg-[var(--docs-code)]"
      >
        <div
          class="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]"
        >
          <span>{{ i18n.t('home.hero.panel.terminalLabel') }}</span>
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-[var(--sanring-radius-sm)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--docs-accent)] transition-colors hover:bg-[color-mix(in_srgb,var(--docs-code-fg)_14%,transparent)]"
            (click)="copyCommand()"
          >
            {{ copied() ? i18n.t('home.hero.panel.copied') : i18n.t('home.hero.panel.copy') }}
          </button>
        </div>

        <div class="p-4 font-mono text-[13px] leading-6 max-[520px]:p-3 max-[520px]:text-[12px]">
          <p class="m-0 break-all text-[color-mix(in_srgb,var(--docs-code-fg)_92%,transparent)]">
            <span class="text-[var(--docs-accent)]">$</span> {{ installCommand }}
          </p>
          <p class="m-0 mt-3 text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]">
            {{ i18n.t('home.hero.panel.resolving') }}
          </p>
          <div
            class="mt-2 grid gap-1 text-[color-mix(in_srgb,var(--docs-code-fg)_82%,transparent)]"
          >
            @for (file of writtenFiles; track file) {
              <p class="m-0 break-all">
                <span class="text-[var(--docs-success)]">✓</span> {{ file }}
              </p>
            }
          </div>
          <p
            class="m-0 mt-3 border-t border-[color-mix(in_srgb,var(--docs-code-fg)_14%,transparent)] pt-3 text-[var(--docs-accent-strong)]"
          >
            {{ i18n.t('home.hero.panel.writtenSummary') }}
          </p>
        </div>
      </div>

      <div
        class="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] pt-5"
      >
        <div class="min-w-0">
          <p class="m-0 text-sm font-semibold text-[var(--docs-code-fg)]">
            {{ i18n.t('home.hero.panel.tryHeading') }}
          </p>
          <p class="m-0 mt-1 text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]">
            {{ i18n.t('home.hero.panel.tryCaption') }}
          </p>
        </div>
        <button
          sanringBtn
          type="button"
          variant="default"
          size="md"
          class="min-h-11 min-w-[150px] shrink-0"
          [sanringDialogTrigger]="demoDialog"
        >
          {{ i18n.t('home.hero.panel.demoButton') }}
        </button>
      </div>
    </div>

    <ng-template #demoDialog>
      <sanring-dialog-content>
        <sanring-dialog-header>
          <h2 sanringDialogTitle>{{ i18n.t('home.hero.panel.dialogTitle') }}</h2>
          <p sanringDialogDescription>{{ i18n.t('home.hero.panel.dialogDescription') }}</p>
        </sanring-dialog-header>
        <sanring-dialog-footer>
          <button sanringBtn type="button" variant="outline" sanringDialogClose>
            {{ i18n.t('home.hero.panel.dialogClose') }}
          </button>
          <button sanringBtn type="button" variant="default" (click)="viewButtonDocs()">
            {{ i18n.t('home.hero.panel.dialogAction') }}
          </button>
        </sanring-dialog-footer>
      </sanring-dialog-content>
    </ng-template>
  `,
  styles: [':host { display: block; min-width: 0; }'],
})
export class HomeHeroDemoPanelComponent {
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  protected readonly copied = signal(false);

  protected readonly installCommand = 'npx @sanring/cli@latest add button';
  protected readonly writtenFiles = [
    'src/app/components/ui/button/button.directive.ts',
    'src/app/components/ui/button/button.styles.ts',
    'src/app/components/ui/button/button.types.ts',
    'src/app/components/ui/button/index.ts',
    'src/app/components/ui/shared/utils.ts',
  ];

  protected async copyCommand(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCommand);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      // Clipboard permission denied or unavailable (e.g. insecure context) — leave button inert.
    }
  }

  protected viewButtonDocs(): void {
    this.dialogService.closeAll();
    void this.router.navigateByUrl('/components/button');
  }
}
