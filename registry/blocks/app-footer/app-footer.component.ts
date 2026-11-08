import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Sanring family footer (sanring-sso docs/rp-integration.md §4-1): one centred line at the very bottom,
 * full width — `© {year} {owner} · {product} · Powered by {poweredBy}`. The year is always the current year.
 * Project extra items (version, links) after the text with ng-content.
 */
@Component({
  selector: 'sanring-app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex w-full shrink-0 flex-wrap items-center justify-center gap-3 border-t border-[var(--sanring-border)] px-4 py-3' },
  template: `
    <p class="font-mono text-xs text-[var(--sanring-muted)]" data-testid="footer-copyright">{{ copyright() }}</p>
    <p class="font-mono text-xs text-[var(--sanring-muted)]" aria-hidden="true">·</p>
    <p class="font-mono text-xs text-[var(--sanring-muted)]">Powered by {{ poweredBy() }}</p>
    <ng-content />
  `,
})
export class AppFooterComponent {
  /** System name, e.g. 進銷存, 管理主控台, 中台. */
  readonly product = input.required<string>();
  readonly owner = input('聖環科技');
  readonly poweredBy = input('sanring-tech');

  protected readonly year = new Date().getFullYear();
  protected readonly copyright = computed(() => `© ${this.year} ${this.owner()} · ${this.product()}`);
}
