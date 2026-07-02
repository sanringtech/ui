import { Component, inject, Input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-section',
  standalone: true,
  host: {
    /*
      當這個元件被放進 grid 容器（例如各頁面 EXAMPLE 區塊的 grid gap-2）當 grid item 時，
      預設 min-width: auto 會被內部 code block 的 min-w-max 長行撐開，造成該區塊比其他
      非 grid 排列的區塊還寬。明確設 min-width: 0 讓內容改用自身的 overflow-auto 捲動。
    */
    class: 'block min-w-0',
  },
  template: `
    <section [id]="sectionId" [class]="sectionClass">
      <div class="mb-3.5">
        @switch (level) {
          @case (4) {
            <h4 [class]="headingClass">
              {{ i18n.t(section.titleKey) }}
            </h4>
          }
          @case (3) {
            <h3 [class]="headingClass">
              {{ i18n.t(section.titleKey) }}
            </h3>
          }
          @default {
            <h2 [class]="headingClass">
              {{ i18n.t(section.titleKey) }}
            </h2>
          }
        }

        @if (section.descriptionKey) {
          <p class="mb-0 mt-3 text-base leading-[1.7] text-[var(--docs-muted)]">
            {{ i18n.t(section.descriptionKey) }}
          </p>
        }
        <ng-content select="[section-content]" />
      </div>

      <ng-content />
    </section>
  `,
})
export class ComponentPageSectionComponent {
  @Input({ required: true }) section!: ComponentPageSectionDefinition;

  protected readonly i18n = inject(I18nService);

  protected get sectionId() {
    return this.section.id;
  }

  protected get level() {
    return this.section.level ?? 2;
  }

  protected get sectionClass() {
    return this.level === 2 ? 'mt-16 scroll-mt-[80px]' : 'mt-10 scroll-mt-[80px]';
  }

  protected get headingClass() {
    const headingClasses: Record<2 | 3 | 4, string> = {
      2: 'm-0 text-[28px] tracking-normal',
      3: 'm-0 text-[22px] tracking-normal',
      4: 'm-0 text-lg font-semibold tracking-normal',
    };

    return headingClasses[this.level];
  }
}
