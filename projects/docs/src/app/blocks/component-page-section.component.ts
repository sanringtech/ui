import { Component, inject, Input } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { ComponentPageSectionDefinition } from './component-page.types';

@Component({
  selector: 'app-component-page-section',
  standalone: true,
  template: `
    <section [id]="sectionId" class="pt-16">
      <div class="mb-3.5">
        @if (level === 3) {
          <h3 class="m-0 text-[22px] tracking-normal">
            {{ i18n.t(section.titleKey) }}
          </h3>
        } @else {
          <h2 class="m-0 text-[28px] tracking-normal">
            {{ i18n.t(section.titleKey) }}
          </h2>
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
}
