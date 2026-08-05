import { Component, inject, Input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

interface StructuredDescriptionItem {
  label: string;
  body: string;
}

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
          @if (usesStructuredDescription) {
            <ul
              class="mb-0 mt-4 grid list-none gap-2.5 p-0 text-sm leading-6 text-[var(--docs-muted)]"
            >
              @for (item of structuredDescriptionItems; track item.body) {
                <li
                  class="grid gap-1 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 py-2.5"
                >
                  <strong
                    class="text-xs font-semibold uppercase tracking-normal text-[var(--docs-fg)]"
                  >
                    {{ item.label }}
                  </strong>
                  <span>{{ item.body }}</span>
                </li>
              }
            </ul>
          } @else {
            <p class="mb-0 mt-3 text-base leading-[1.7] text-[var(--docs-muted)]">
              {{ sectionDescription }}
            </p>
          }
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

  protected get sectionDescription() {
    return this.section.descriptionKey ? this.i18n.t(this.section.descriptionKey) : '';
  }

  protected get usesStructuredDescription() {
    return this.section.id === 'accessibility' || this.section.id === 'stateModel';
  }

  protected get structuredDescriptionItems(): StructuredDescriptionItem[] {
    return this.splitDescription(this.sectionDescription).map((body, index) => ({
      label: this.descriptionLabel(body, index),
      body,
    }));
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

  private splitDescription(description: string): string[] {
    const parts = description
      .match(/[^。！？.!?]+[。！？.!?]?/g)
      ?.map((part) => part.trim())
      .filter(Boolean);

    return parts?.length ? parts : [description];
  }

  private descriptionLabel(body: string, index: number): string {
    const text = body.toLowerCase();
    const zh = this.i18n.locale() === 'zh';

    if (this.section.id === 'accessibility') {
      if (this.includesAny(text, ['role', 'aria', '語意', '公告', 'label', 'liveannouncer'])) {
        return zh ? '語意與 ARIA' : 'Semantics';
      }

      if (this.includesAny(text, ['keyboard', 'focus', 'tab', 'escape', '焦點', '鍵盤'])) {
        return zh ? '焦點與鍵盤' : 'Focus';
      }

      if (this.includesAny(text, ['screen reader', 'assistive', '輔助科技', '讀屏'])) {
        return zh ? '輔助科技' : 'Assistive Tech';
      }

      if (
        this.includesAny(text, [
          'disabled',
          'invalid',
          'required',
          'active',
          'current',
          '停用',
          '錯誤',
          '目前',
        ])
      ) {
        return zh ? '狀態標記' : 'State Cues';
      }

      return zh ? `重點 ${index + 1}` : `Point ${index + 1}`;
    }

    if (
      this.includesAny(text, [
        'controlvalueaccessor',
        'cva',
        'ngmodel',
        'formcontrol',
        'forms',
        '表單',
      ])
    ) {
      return zh ? '表單整合' : 'Forms';
    }

    if (
      this.includesAny(text, ['two-way', 'model', 'binding', '[(]', '[(ngmodel)]', '雙向', '綁定'])
    ) {
      return zh ? '綁定方式' : 'Binding';
    }

    if (this.includesAny(text, ['output', 'emit', 'event', 'change', '輸出', '事件', '回報'])) {
      return zh ? '事件輸出' : 'Events';
    }

    if (this.includesAny(text, ['stateless', 'no internal', '無內部狀態', '不保存'])) {
      return zh ? '狀態歸屬' : 'State Owner';
    }

    if (
      this.includesAny(text, [
        'disabled',
        'open',
        'selected',
        'value',
        'checked',
        'pressed',
        'page',
        'query',
        '停用',
        '展開',
        '選取',
        '值',
      ])
    ) {
      return zh ? '狀態欄位' : 'State Fields';
    }

    return zh ? `重點 ${index + 1}` : `Point ${index + 1}`;
  }

  private includesAny(text: string, needles: readonly string[]): boolean {
    return needles.some((needle) => text.includes(needle));
  }
}
