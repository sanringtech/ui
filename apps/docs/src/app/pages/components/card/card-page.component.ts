import { Component, inject } from '@angular/core';
import { LucideActivity, LucideKey, LucidePlus } from '@lucide/angular';
import { BadgeDirective, ButtonDirective, SANRING_CARD_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { cardPage, cardPageExamples } from './card.docs';

@Component({
  selector: 'app-card-page',
  imports: [
    ComponentPageApiTableComponent,
    BadgeDirective,
    ButtonDirective,
    SANRING_CARD_IMPORTS,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    LucideActivity,
    LucideKey,
    LucidePlus,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="flex w-full justify-center">
            <sanring-card class="w-[min(350px,100%)]">
              <sanring-card-header>
                <h3 sanringCardTitle>Card title</h3>
                <p sanringCardDescription>Card description</p>
              </sanring-card-header>
              <sanring-card-content>
                <p class="text-sm text-[var(--docs-muted)]">
                  Compose any content with native HTML.
                </p>
              </sanring-card-content>
            </sanring-card>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports
            [code]="examples.usageImport"
            [individualCode]="examples.usageIndividualImports"
          />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="card"
          manualSnippet="import { SANRING_CARD_IMPORTS } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <div
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="examples.composition" language="bash" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-form')">
            <app-component-page-code-previewer [code]="examples.form" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-card class="w-[min(350px,100%)]">
                  <sanring-card-header>
                    <h3 sanringCardTitle>建立新專案</h3>
                    <p sanringCardDescription>一鍵部署你的新專案環境。</p>
                  </sanring-card-header>

                  <sanring-card-content>
                    <div class="grid w-full items-center gap-4">
                      <div class="flex flex-col space-y-1.5">
                        <div class="text-sm font-medium">專案名稱</div>
                        <div
                          class="h-9 w-full rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] px-3 py-1"
                        ></div>
                      </div>
                      <div class="flex flex-col space-y-1.5">
                        <div class="text-sm font-medium">框架</div>
                        <div
                          class="h-9 w-full rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] px-3 py-1"
                        ></div>
                      </div>
                    </div>
                  </sanring-card-content>

                  <sanring-card-footer class="flex justify-between">
                    <button sanringBtn type="button" variant="outline">取消</button>
                    <button sanringBtn type="button">部署</button>
                  </sanring-card-footer>
                </sanring-card>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-metric')">
            <app-component-page-code-previewer [code]="examples.metric" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-card class="w-[min(300px,100%)]">
                  <sanring-card-header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                  >
                    <h3 sanringCardTitle class="text-sm font-medium">總金鑰呼叫次數</h3>
                    <svg lucideActivity class="size-4 text-[var(--docs-muted)]"></svg>
                  </sanring-card-header>

                  <sanring-card-content>
                    <div class="text-2xl font-bold">+23,541</div>
                    <p sanringCardDescription class="mt-1 text-xs">較上個月增長 20.1%</p>
                  </sanring-card-content>
                </sanring-card>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-image')">
            <app-component-page-code-previewer [code]="examples.image" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-card class="w-[min(320px,100%)] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=160&fit=crop"
                    alt="封面圖"
                    class="h-[160px] w-full object-cover transition-transform hover:scale-105"
                  />

                  <sanring-card-header>
                    <h3 sanringCardTitle>如何建構 UI 素材庫</h3>
                    <p sanringCardDescription>前端架構設計指南</p>
                  </sanring-card-header>

                  <sanring-card-content>
                    <p class="text-sm text-[var(--docs-muted)]">
                      從零開始學習使用 Angular 與 Tailwind CSS 建構企業級的高擴充性元件。
                    </p>
                  </sanring-card-content>
                </sanring-card>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-list')">
            <app-component-page-code-previewer [code]="examples.list" language="angular-html">
              <div previewer class="flex w-full justify-center">
                <sanring-card class="w-[min(380px,100%)]">
                  <sanring-card-header>
                    <h3 sanringCardTitle>API 金鑰狀態</h3>
                    <p sanringCardDescription>你目前有 2 個運行中的金鑰。</p>
                  </sanring-card-header>

                  <sanring-card-content class="grid gap-4">
                    <div
                      class="flex items-center space-x-4 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] p-4"
                    >
                      <svg lucideKey class="size-5 text-[var(--docs-fg)]"></svg>
                      <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium leading-none">Production Key</p>
                        <p class="text-sm text-[var(--docs-muted)]">sk_prod_...8f2a</p>
                      </div>
                      <span sanringBadge variant="outline">
                        <span class="size-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </div>

                    <div
                      class="flex items-center space-x-4 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] p-4"
                    >
                      <svg lucideKey class="size-5 text-[var(--docs-muted)]"></svg>
                      <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium leading-none text-[var(--docs-muted)]">
                          Test Key
                        </p>
                        <p class="text-sm text-[var(--docs-muted)]">sk_test_...1b9c</p>
                      </div>
                      <span sanringBadge variant="secondary">Revoked</span>
                    </div>
                  </sanring-card-content>

                  <sanring-card-footer>
                    <button sanringBtn class="w-full" type="button">
                      <svg lucidePlus class="mr-2 size-4"></svg>
                      產生新金鑰
                    </button>
                  </sanring-card-footer>
                </sanring-card>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class CardPageComponent {
  protected readonly page = cardPage;
  protected readonly examples = cardPageExamples;
  protected readonly i18n = inject(I18nService);

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
