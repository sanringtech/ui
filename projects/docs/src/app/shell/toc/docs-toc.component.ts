import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { DocsTocItem, DocsTocService } from './docs-toc.service';

@Component({
  selector: 'app-docs-toc',
  imports: [RouterLink],
  template: `
    <aside
      class="sticky top-[76px] h-[calc(100dvh-76px)] overflow-auto bg-[var(--docs-bg)] pb-12 pl-2.5 pr-8 pt-12 max-[1180px]:hidden"
    >
      <nav class="mb-11" [attr.aria-label]="i18n.t('toc.label')">
        <p class="mb-4 text-sm font-semibold leading-normal text-[var(--docs-muted)]">
          {{ i18n.t('toc.label') }}
        </p>
        @for (item of items(); track item.id) {
          <a [class]="itemClass(item)" [routerLink]="[]" [fragment]="item.id">
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

  protected items() {
    return this.toc.items();
  }

  protected itemClass(item: DocsTocItem) {
    const indentClasses: Record<2 | 3 | 4, string> = {
      2: '',
      3: 'pl-[18px]',
      4: 'pl-9',
    };

    return [
      'my-3 block text-sm text-[var(--docs-muted)] no-underline',
      indentClasses[item.level ?? 2],
    ]
      .filter(Boolean)
      .join(' ');
  }
}
