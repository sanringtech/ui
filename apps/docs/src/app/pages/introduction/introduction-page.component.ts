import { Component, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
} from '../../layouts/component-page';
import { docsComponentItems } from '../../navigation/docs-navigation';
import { TranslationKey } from '../../i18n/translations';

interface IntroStatusCard {
  value: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

@Component({
  selector: 'app-introduction-page',
  imports: [ComponentPageCodeBlock, ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('sidebar.introduction') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('intro.page.description') }}
        </p>
      </header>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('intro.whatIs.body') }}
        </p>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <div class="grid gap-3 sm:grid-cols-3">
          @for (item of statusCards; track item.titleKey) {
            <div
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4 shadow-sm"
            >
              <div class="text-2xl font-semibold leading-none text-[var(--docs-fg)]">
                {{ item.value }}
              </div>
              <h3 class="mb-0 mt-3 text-sm font-semibold text-[var(--docs-fg)]">
                {{ i18n.t(item.titleKey) }}
              </h3>
              <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(item.descriptionKey) }}
              </p>
            </div>
          }
        </div>
        <div class="mt-5 flex flex-wrap gap-2">
          <a
            class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-1.5 text-sm font-medium text-[var(--docs-fg)] no-underline transition-colors hover:bg-[var(--docs-active)]"
            href="/components"
          >
            {{ i18n.t('nav.components') }}
          </a>
          <a
            class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-1.5 text-sm font-medium text-[var(--docs-fg)] no-underline transition-colors hover:bg-[var(--docs-active)]"
            href="/roadmap"
          >
            {{ i18n.t('sidebar.roadmap') }}
          </a>
          <a
            class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-1.5 text-sm font-medium text-[var(--docs-fg)] no-underline transition-colors hover:bg-[var(--docs-active)]"
            href="/changelog"
          >
            {{ i18n.t('sidebar.changelog') }}
          </a>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <ul class="mt-0 space-y-2 text-sm text-[var(--docs-muted)] list-none p-0">
          <li><span class="font-medium text-[var(--docs-fg)]">Angular</span> &mdash; 22+</li>
          <li><span class="font-medium text-[var(--docs-fg)]">Tailwind CSS</span> &mdash; v4</li>
          <li><span class="font-medium text-[var(--docs-fg)]">Node.js</span> &mdash; 18+</li>
        </ul>
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.installation.body') }}</p>
        <div class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="installCommand" language="bash" />
        </div>
        <p class="mt-6 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.installation.tailwind') }}</p>
        <div class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="tailwindSource" language="css" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.workflow.body') }}</p>
        <div class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="cliWorkflow" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.firstComponent.body') }}</p>
        <div class="mt-4 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="firstComponent" language="angular-ts" />
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class IntroductionPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly componentCount = docsComponentItems.length;

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'what-is', titleKey: 'intro.whatIs.title' },
    { id: 'current-coverage', titleKey: 'intro.coverage.title' },
    { id: 'requirements', titleKey: 'intro.requirements.title' },
    { id: 'installation', titleKey: 'intro.installation.title' },
    { id: 'workflow', titleKey: 'intro.workflow.title' },
    { id: 'first-component', titleKey: 'intro.firstComponent.title' },
  ];

  protected readonly statusCards: IntroStatusCard[] = [
    {
      value: String(this.componentCount),
      titleKey: 'intro.coverage.components.title',
      descriptionKey: 'intro.coverage.components.description',
    },
    {
      value: '4',
      titleKey: 'intro.coverage.groups.title',
      descriptionKey: 'intro.coverage.groups.description',
    },
    {
      value: '2',
      titleKey: 'intro.coverage.next.title',
      descriptionKey: 'intro.coverage.next.description',
    },
  ];

  protected readonly installCommand = `npm install @sanring/ui`;

  protected readonly tailwindSource = `@import './sanring-theme.css';

@source "../node_modules/@sanring/ui/src";
@source "./app/components/ui";`;

  protected readonly cliWorkflow = `npx @sanring/cli@latest init
npx @sanring/cli@latest add file-upload`;

  protected readonly firstComponent = `import {
  FileDropzoneComponent,
  FileTriggerDirective,
  FileUploadComponent,
} from './components/ui/file-upload';

@Component({
  imports: [FileDropzoneComponent, FileTriggerDirective, FileUploadComponent],
  template: \`
    <sanring-file-upload>
      <sanring-file-dropzone>
        <button sanringFileTrigger type="button">Browse files</button>
      </sanring-file-dropzone>
    </sanring-file-upload>
  \`,
})
export class AppComponent {}`;
}
