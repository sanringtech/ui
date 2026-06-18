import { Component, inject } from '@angular/core';
import { Divider } from '@sanring/ui';
import { I18nService } from '../../../i18n/i18n.service';
import { ComponentPageHeaderComponent } from '../../../layouts/component-page';

@Component({
  selector: 'app-divider-page',
  imports: [Divider, ComponentPageHeaderComponent],
  template: `
    <article class="mx-auto max-w-[832px] text-[var(--docs-fg)]">
      <app-component-page-header
        componentId="divider"
        [title]="i18n.t('component.divider')"
        [description]="i18n.t('divider.description')"
      />

      <section
        class="mt-9 overflow-hidden rounded-lg border border-[var(--docs-border)] bg-[var(--docs-panel)]"
        id="usage"
      >
        <div class="grid min-h-[390px] place-items-center p-11 max-[720px]:p-6">
          <div class="grid w-[min(520px,100%)] gap-10">
            <div>
              <p class="mb-4 mt-0 text-sm font-semibold text-[var(--docs-muted)]">
                {{ i18n.t('divider.demo.horizontal') }}
              </p>
              <div class="rounded-lg border border-[var(--docs-border)] p-5">
                <p class="m-0 text-sm font-semibold">{{ i18n.t('divider.demo.account') }}</p>
                <p class="mb-4 mt-1 text-sm text-[var(--docs-muted)]">
                  {{ i18n.t('divider.demo.profile') }}
                </p>
                <sanring-divider />
                <p class="mb-0 mt-4 text-sm text-[var(--docs-muted)]">
                  {{ i18n.t('divider.demo.billing') }}
                </p>
              </div>
            </div>

            <div>
              <p class="mb-4 mt-0 text-sm font-semibold text-[var(--docs-muted)]">
                {{ i18n.t('divider.demo.inset') }}
              </p>
              <div class="rounded-lg border border-[var(--docs-border)] py-3">
                <div class="flex items-center gap-3 px-5 py-3">
                  <div
                    class="grid size-7 place-items-center rounded-full bg-[var(--docs-elevated)] text-xs font-semibold"
                  >
                    A
                  </div>
                  <span class="text-sm">{{ i18n.t('divider.demo.account') }}</span>
                </div>
                <sanring-divider inset="start" />
                <div class="flex items-center gap-3 px-5 py-3">
                  <div
                    class="grid size-7 place-items-center rounded-full bg-[var(--docs-elevated)] text-xs font-semibold"
                  >
                    B
                  </div>
                  <span class="text-sm">{{ i18n.t('divider.demo.billing') }}</span>
                </div>
              </div>
            </div>

            <div>
              <p class="mb-4 mt-0 text-sm font-semibold text-[var(--docs-muted)]">
                {{ i18n.t('divider.demo.vertical') }}
              </p>
              <div
                class="flex h-10 items-center rounded-lg border border-[var(--docs-border)] px-5 text-sm"
              >
                <span>{{ i18n.t('divider.demo.profile') }}</span>
                <sanring-divider class="mx-4" [vertical]="true" />
                <span>{{ i18n.t('divider.demo.billing') }}</span>
                <sanring-divider class="mx-4" [vertical]="true" />
                <span>{{ i18n.t('divider.demo.settings') }}</span>
              </div>
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
          {{ i18n.t('divider.installation.description') }}
        </p>
      </section>

      <section id="composition" class="pt-16">
        <h2 class="mb-3.5 mt-0 text-[28px] tracking-normal">
          {{ i18n.t('toc.composition') }}
        </h2>
        <p class="m-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('divider.composition.description') }}
        </p>
      </section>
    </article>
  `,
})
export class DividerPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly codeExample = `import { Divider } from '@sanring/ui';

<sanring-divider />

<sanring-divider inset="start" />

<sanring-divider [vertical]="true" />`;
}
