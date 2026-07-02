import { Component, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent, ComponentPageSectionComponent } from '../../layouts/component-page';

@Component({
  selector: 'app-introduction-page',
  imports: [ComponentPageComponent, ComponentPageSectionComponent],
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
        <ul class="mt-0 space-y-2 text-sm text-[var(--docs-muted)] list-none p-0">
          <li><span class="font-medium text-[var(--docs-fg)]">Angular</span> &mdash; 17+</li>
          <li><span class="font-medium text-[var(--docs-fg)]">Tailwind CSS</span> &mdash; v4</li>
          <li><span class="font-medium text-[var(--docs-fg)]">Node.js</span> &mdash; 18+</li>
        </ul>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.installation.body') }}</p>
        <pre class="mt-4 overflow-x-auto rounded-[var(--sanring-radius)] bg-[var(--docs-code)] px-5 py-4 text-sm leading-7 text-[var(--docs-fg)]">npm install &#64;sanring/ui</pre>
        <p class="mt-6 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.installation.tailwind') }}</p>
        <pre class="mt-4 overflow-x-auto rounded-[var(--sanring-radius)] bg-[var(--docs-code)] px-5 py-4 text-sm leading-7 text-[var(--docs-fg)]">&#64;source "../../node_modules/&#64;sanring/ui/src";</pre>
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('intro.firstComponent.body') }}</p>
        <pre class="mt-4 overflow-x-auto rounded-[var(--sanring-radius)] bg-[var(--docs-code)] px-5 py-4 text-sm leading-7 text-[var(--docs-fg)]">import &#123; ButtonDirective &#125; from '&#64;sanring/ui';

&#64;Component(&#123;
  imports: [ButtonDirective],
  template: '&lt;button sanringBtn&gt;Click me&lt;/button&gt;',
&#125;)
export class AppComponent &#123;&#125;</pre>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class IntroductionPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'what-is', titleKey: 'intro.whatIs.title' },
    { id: 'requirements', titleKey: 'intro.requirements.title' },
    { id: 'installation', titleKey: 'intro.installation.title' },
    { id: 'first-component', titleKey: 'intro.firstComponent.title' },
  ];
}
