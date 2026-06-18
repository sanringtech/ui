import { Component, inject } from '@angular/core';
import { LucideArrowRight, LucideDownload, LucideSettings } from '@lucide/angular';
import { Button } from '@sanring/ui';
import { ComponentPageHeaderComponent } from '../../../blocks/component-page-header.component';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'app-button-page',
  imports: [Button, ComponentPageHeaderComponent, LucideArrowRight, LucideDownload, LucideSettings],
  template: `
    <article class="mx-auto max-w-[832px] text-[var(--docs-fg)]">
      <app-component-page-header
        componentId="button"
        [title]="i18n.t('component.button')"
        [description]="i18n.t('button.description')"
      />

      <section
        class="mt-9 overflow-hidden rounded-lg border border-[var(--docs-border)] bg-[var(--docs-panel)]"
        id="usage"
      >
        <div class="grid min-h-[390px] place-items-center p-11 max-[720px]:p-6">
          <div class="grid gap-8">
            <div class="flex flex-wrap items-center justify-center gap-3">
              <sanring-button type="button" variant="default">
                {{ i18n.t('button.demo.default') }}
              </sanring-button>
              <sanring-button type="button" variant="secondary">
                {{ i18n.t('button.demo.secondary') }}
              </sanring-button>
              <sanring-button type="button" variant="outline">
                {{ i18n.t('button.demo.outline') }}
              </sanring-button>
              <sanring-button type="button" variant="ghost">
                {{ i18n.t('button.demo.ghost') }}
              </sanring-button>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3">
              <sanring-button type="button" variant="secondary" size="sm">
                <svg class="size-4" lucideDownload></svg>
                <span>{{ i18n.t('button.demo.small') }}</span>
              </sanring-button>
              <sanring-button type="button" variant="outline" size="md">
                <span>{{ i18n.t('button.demo.medium') }}</span>
                <svg class="size-4" lucideArrowRight></svg>
              </sanring-button>
              <sanring-button
                type="button"
                variant="outline"
                size="icon"
                [ariaLabel]="i18n.t('button.demo.icon')"
              >
                <svg class="size-4" lucideSettings></svg>
              </sanring-button>
            </div>
          </div>
        </div>

        <pre
          class="m-0 overflow-auto border-t border-[var(--docs-border)] bg-[var(--docs-code)] px-10 py-7 text-[15px] leading-[1.7] text-[#d4d4d4]"
        ><code>{{ codeExample }}</code></pre>
      </section>

      <section id="installation" class="pt-16">
        <h2 class="mb-3.5 mt-0 text-[28px] tracking-normal">
          {{ i18n.t('sidebar.installation') }}
        </h2>
        <p class="m-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('button.installation.description') }}
        </p>
      </section>

      <section id="composition" class="pt-16">
        <h2 class="mb-3.5 mt-0 text-[28px] tracking-normal">
          {{ i18n.t('toc.composition') }}
        </h2>
        <p class="m-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('button.composition.description') }}
        </p>
      </section>
    </article>
  `,
})
export class ButtonPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly codeExample = `import { Button } from '@sanring/ui';

<sanring-button type="button" variant="default">
  Button
</sanring-button>

<sanring-button type="button" variant="outline" size="icon" ariaLabel="Settings">
  <svg class="size-4" lucideSettings></svg>
</sanring-button>`;
}
