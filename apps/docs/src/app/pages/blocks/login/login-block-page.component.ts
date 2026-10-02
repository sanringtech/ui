import { Component, effect, inject, signal } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../../docs-schema/component-page.types';
import { I18nService } from '../../../i18n/i18n.service';
import { SeoService } from '../../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../../layouts/component-page';
import { LoginComponent } from '../../../../registry-stage/login';
import { BlockCompositionComponent } from '../block-composition.component';
import { getDocsBlock } from '../blocks.catalog';

@Component({
  selector: 'app-login-block-page',
  imports: [
    BlockCompositionComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
    LoginComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t(block.titleKey)"
        [description]="i18n.t(block.descriptionKey)"
        eyebrow="blocks / {{ block.id }}"
      />

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.scenarioKey) }}
        </p>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.compositionKey) }}
        </p>
        <p class="mt-2 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('blocks.section.compositionHint') }}
        </p>
        <div class="mt-4">
          <app-block-composition
            [componentDeps]="block.componentDeps"
            [componentsLabel]="i18n.t('blocks.section.components')"
            [peersLabel]="i18n.t('blocks.section.peers')"
          />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <app-component-page-installation
          [componentName]="block.installName"
          manualSnippet="import { LoginComponent } from './components/ui/login';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <div class="grid gap-6">
          <app-component-page-code-block [code]="usageTs" language="typescript" />
          <app-component-page-code-block [code]="usageHtml" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <app-component-page-code-previewer [code]="usageHtml" language="angular-html">
          <div previewer class="w-full min-w-0 overflow-hidden bg-[var(--docs-surface)]">
            <sanring-login
              class="min-h-[420px]"
              [error]="loginError()"
              (submitted)="onSubmitted($event)"
            />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class LoginBlockPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly block = getDocsBlock('login');
  protected readonly loginError = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t(this.block.titleKey),
        description: this.i18n.t(this.block.descriptionKey),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'scenario', titleKey: 'blocks.section.scenario' },
    { id: 'composition', titleKey: 'blocks.section.composition' },
    { id: 'installation', titleKey: 'blocks.section.installation' },
    { id: 'usage', titleKey: 'blocks.section.usage' },
    { id: 'preview', titleKey: 'blocks.section.preview' },
  ];

  protected readonly usageTs = `import { Component, signal } from '@angular/core';
import { LoginComponent } from './components/ui/login';

@Component({
  imports: [LoginComponent],
  templateUrl: './login.page.html',
})
export class LoginPage {
  readonly error = signal<string | null>(null);

  onSubmitted(payload: { email: string; password: string; rememberMe: boolean }) {
    // call your auth API, then:
    // this.error.set('Invalid email or password');
  }
}`;

  protected readonly usageHtml = `<sanring-login
  [error]="error()"
  (submitted)="onSubmitted($event)"
/>`;

  protected onSubmitted(payload: { email: string; password: string; rememberMe: boolean }): void {
    this.loginError.set(
      payload.email.includes('@') ? null : 'Enter a valid email to continue.',
    );
  }
}
