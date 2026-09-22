import { afterNextRender, Component, DestroyRef, effect, inject, Injector, signal } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { DocsTocItem, DocsTocService } from './docs-toc.service';

const SCROLL_OFFSET = 76;
const ACTIVE_OFFSET = SCROLL_OFFSET + 24;
/** Reading line as a fraction of the viewport. Tall example blocks otherwise keep the previous TOC item active. */
const ACTIVE_VIEWPORT_RATIO = 0.32;

@Component({
  selector: 'app-docs-toc',
  template: `
    <aside
      class="sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto bg-[var(--docs-bg)] pb-12 pl-4 pr-8 pt-10 max-[1180px]:pr-5 max-[980px]:hidden"
    >
      <nav class="mb-11" [attr.aria-label]="i18n.t('toc.label')">
        <p class="docs-eyebrow mb-3">
          {{ i18n.t('toc.label') }}
        </p>
        @for (item of items(); track item.id) {
          <a
            [class]="itemClass(item)"
            [attr.aria-current]="activeId() === item.id ? 'location' : null"
            [href]="'#' + item.id"
            (click)="scrollTo(item.id, $event)"
          >
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
    this.activeId.set(id);
    const marginTop = parseInt(getComputedStyle(el).marginTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET - marginTop;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.pushState(null, '', `#${id}`);
  }

  protected items() {
    return this.toc.items();
  }

  protected itemClass(item: DocsTocItem) {
    const indentClasses: Record<2 | 3 | 4, string> = {
      2: '',
      3: 'level-3',
      4: 'level-4',
    };

    return ['docs-toc-item', indentClasses[item.level ?? 2]].filter(Boolean).join(' ');
  }

  private activationLine(): number {
    return Math.max(ACTIVE_OFFSET, Math.round(window.innerHeight * ACTIVE_VIEWPORT_RATIO));
  }

  private updateActiveSection(): void {
    const items = this.toc.items();
    if (items.length === 0) {
      this.activeId.set(null);
      return;
    }

    const line = this.activationLine();
    let currentId = items[0].id;

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= line) {
        currentId = item.id;
      }
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (nearBottom) {
      currentId = items[items.length - 1].id;
    }

    this.activeId.set(currentId);
  }
}
