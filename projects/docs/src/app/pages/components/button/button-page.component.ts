import { Component, inject } from '@angular/core';
import { LucideSettings } from '@lucide/angular';
import { Button } from '@sanring/ui';
import {
  ComponentPageDefinition,
  ComponentPageSectionDefinition,
} from '../../../docs-schema/component-page.types';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';

const buttonPage = {
  componentId: 'button',
  titleKey: 'component.button',
  descriptionKey: 'button.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'button.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'button.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'button.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'button.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'button.examples.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

@Component({
  selector: 'app-button-page',
  imports: [
    Button,
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageCodePreviewer,
    ComponentPageHeaderComponent,
    ComponentPageSectionComponent,
    LucideSettings,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer>
          <div previewer class="grid gap-8">
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button sanringBtn type="button" variant="outline">
                {{ i18n.t('button.demo.outline') }}
              </button>
              <button
                sanringBtn
                type="button"
                variant="outline"
                size="icon"
                [attr.aria-label]="i18n.t('button.demo.icon')"
              >
                <svg class="size-4" lucideSettings></svg>
              </button>
            </div>
          </div>

          <ng-container code>{{ codeExample() }}</ng-container>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')" />

      <app-component-page-section [section]="section('usage')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="usageExample()" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')" />

      <app-component-page-section [section]="section('example')" />
    </app-component-page>
  `,
})
export class ButtonPageComponent {
  protected readonly page = buttonPage;
  protected readonly i18n = inject(I18nService);

  protected section(id: string): ComponentPageSectionDefinition {
    const section = this.findSection(this.page.sections, id);

    if (!section) {
      throw new Error(`Missing button docs section: ${id}`);
    }

    return section;
  }

  protected codeExample() {
    return `import { Button } from '@sanring/ui';

<button sanringBtn type="button" variant="outline">
  ${this.i18n.t('button.demo.outline')}
</button>

<button sanringBtn type="button" variant="outline" size="icon" aria-label="Settings">
  <svg class="size-4" lucideSettings></svg>
</button>`;
  }

  protected usageExample() {
    return `import { Button } from '@sanring/ui';

<button sanringBtn type="button" variant="outline">
  Button
</button>`;
  }

  private findSection(
    sections: readonly ComponentPageSectionDefinition[],
    id: string,
  ): ComponentPageSectionDefinition | null {
    for (const section of sections) {
      if (section.id === id) {
        return section;
      }

      const childSection = this.findSection(section.children ?? [], id);

      if (childSection) {
        return childSection;
      }
    }

    return null;
  }
}
