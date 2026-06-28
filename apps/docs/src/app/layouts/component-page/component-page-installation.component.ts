import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideClipboard } from '@lucide/angular';
import { TabsComponent, TabsContentComponent, TabsListComponent, TabsTriggerComponent, ToastService } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';

type InstallMode = 'command' | 'manual';
type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

@Component({
  selector: 'app-component-page-installation',
  standalone: true,
  imports: [LucideClipboard, TabsComponent, TabsContentComponent, TabsListComponent, TabsTriggerComponent],
  template: `
    <sanring-tabs
      class="w-full"
      defaultValue="command"
      variant="line"
      (valueChange)="handleModeChange($event)"
    >
      <sanring-tabs-list class="mb-3 gap-4">
        <sanring-tabs-trigger value="command" class="px-0 text-base">
          Command
        </sanring-tabs-trigger>
        <sanring-tabs-trigger value="manual" class="px-0 text-base">
          Manual
        </sanring-tabs-trigger>
      </sanring-tabs-list>

      <sanring-tabs-content value="command" class="mt-0">
        <div class="w-full overflow-hidden rounded-xl border border-[var(--docs-border)] bg-[var(--docs-code)]">
          <div class="flex min-w-0 items-center gap-2 border-b border-[var(--docs-border)] px-3 py-2">
            <span class="grid size-6 shrink-0 place-items-center rounded-md border border-[var(--docs-border)] bg-[var(--docs-bg)] font-mono text-xs text-[var(--docs-fg)]">
              &gt;_
            </span>

            <div class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              @for (manager of packageManagers; track manager) {
                <button
                  type="button"
                  [class]="packageManagerClass(manager)"
                  (click)="selectedPackageManager.set(manager)"
                >
                  {{ manager }}
                </button>
              }
            </div>

            <button
              type="button"
              class="grid size-8 shrink-0 place-items-center rounded-md text-[var(--docs-muted)] transition-colors hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
              [attr.aria-label]="i18n.t('actions.copyCode')"
              (click)="copyCurrentCode()"
            >
              <svg lucideClipboard class="size-4"></svg>
            </button>
          </div>

          <pre class="m-0 overflow-x-auto px-4 py-4 font-mono text-sm leading-7 text-[#cbd5e1]"><code>{{ command() }}</code></pre>
        </div>
      </sanring-tabs-content>

      <sanring-tabs-content value="manual" class="mt-0">
        <div class="w-full overflow-hidden rounded-xl border border-[var(--docs-border)] bg-[var(--docs-code)]">
          <div class="flex min-w-0 items-center gap-2 border-b border-[var(--docs-border)] px-3 py-2">
            <span class="flex-1 text-sm font-medium text-[var(--docs-fg)]">Import</span>
            <button
              type="button"
              class="grid size-8 shrink-0 place-items-center rounded-md text-[var(--docs-muted)] transition-colors hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
              [attr.aria-label]="i18n.t('actions.copyCode')"
              (click)="copyCurrentCode()"
            >
              <svg lucideClipboard class="size-4"></svg>
            </button>
          </div>

          <pre class="m-0 overflow-x-auto px-4 py-4 font-mono text-sm leading-7 text-[#cbd5e1]"><code>{{ manualSnippet() }}</code></pre>
        </div>
      </sanring-tabs-content>
    </sanring-tabs>
  `,
})
export class ComponentPageInstallationComponent {
  readonly componentName = input.required<string>();
  readonly manualSnippet = input('import { } from "@sanring/ui";');

  protected readonly i18n   = inject(I18nService);
  private  readonly toast   = inject(ToastService);

  protected readonly packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];
  protected readonly selectedPackageManager = signal<PackageManager>('pnpm');
  protected readonly selectedMode = signal<InstallMode>('command');

  protected readonly command = computed(() => {
    const name = this.componentName();

    switch (this.selectedPackageManager()) {
      case 'npm':   return `npx shadcn@latest add ${name}`;
      case 'yarn':  return `yarn dlx shadcn@latest add ${name}`;
      case 'bun':   return `bunx shadcn@latest add ${name}`;
      case 'pnpm':
      default:      return `pnpm dlx shadcn@latest add ${name}`;
    }
  });

  protected packageManagerClass(manager: PackageManager) {
    return [
      'rounded-md px-2 py-1 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]',
      this.selectedPackageManager() === manager
        ? 'bg-[var(--docs-bg)] text-[var(--docs-fg)] shadow-sm'
        : 'text-[var(--docs-muted)] hover:text-[var(--docs-fg)]',
    ].join(' ');
  }

  protected handleModeChange(value: string) {
    if (value === 'command' || value === 'manual') {
      this.selectedMode.set(value);
    }
  }

  protected async copyCurrentCode() {
    const code = this.selectedMode() === 'command' ? this.command() : this.manualSnippet();

    try {
      await navigator.clipboard.writeText(code);
      this.toast.show({ type: 'success', title: this.i18n.t('actions.copied'), duration: 2000, closable: false });
    } catch {
      this.toast.show({ type: 'error', title: this.i18n.t('actions.copyFailed'), duration: 3000, closable: true });
    }
  }
}
