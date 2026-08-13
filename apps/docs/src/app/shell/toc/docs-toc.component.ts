import { afterNextRender, Component, DestroyRef, effect, inject, Injector, signal } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { DocsTocItem, DocsTocService } from './docs-toc.service';

const SCROLL_OFFSET = 76;
const ACTIVE_OFFSET = SCROLL_OFFSET + 24;

@Component({
  selector: 'app-docs-toc',
  template: `
    <aside
      class="sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto bg-[color-mix(in_srgb,var(--docs-bg)_60%,transparent)] pb-12 pl-4 pr-8 pt-10 backdrop-blur-xl max-[1180px]:pr-5 max-[980px]:hidden"
    >
      <nav
        class="mb-11 rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_72%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_62%,transparent)] p-4 shadow-[var(--docs-shadow-soft)]"
        [attr.aria-label]="i18n.t('toc.label')"
      >
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--docs-muted)]">
          {{ i18n.t('toc.label') }}
        </p>
        @for (item of items(); track item.id) {
          <a [class]="itemClass(item)" href="#" (click)="scrollTo(item.id, $event)">
            {{ item.label }}
          </a>
        }
      </nav>
    </aside>
  `,
})
export class DocsTocComponent {
  protected readonly i18n = inject(I18nService);
  private readonly toc = inject(DocsTocService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  protected readonly activeId = signal<string | null>(null);

  constructor() {
    const updateActiveSection = () => this.updateActiveSection();

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    });

    effect(() => {
      this.toc.items();
      afterNextRender(updateActiveSection, { injector: this.injector });
    });
  }

  protected scrollTo(id: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const marginTop = parseInt(getComputedStyle(el).marginTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET - marginTop;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.pushState(null, '', `#${id}`);
  }

  protected items() {
    return this.toc.items();
  }

  protected itemClass(item: DocsTocItem) {
    const active = this.activeId() === item.id;
    const indentClasses: Record<2 | 3 | 4, string> = {
      2: '',
      3: 'pl-[18px]',
      4: 'pl-9',
    };

    return [
      'my-3 block border-l border-transparent py-0.5 text-sm no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-focus-ring)]',
      active
        ? 'border-[var(--docs-accent)] text-[var(--docs-fg)]'
        : 'text-[var(--docs-muted)] hover:text-[var(--docs-fg)]',
      indentClasses[item.level ?? 2],
    ]
      .filter(Boolean)
      .join(' ');
  }

  private updateActiveSection(): void {
    const items = this.toc.items();
    let currentId = items[0]?.id ?? null;

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
        currentId = item.id;
      } else {
        break;
      }
    }

    this.activeId.set(currentId);
  }
}
