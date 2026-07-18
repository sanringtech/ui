import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const cardPage = {
  componentId: 'card',
  titleKey: 'component.card',
  descriptionKey: 'card.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'card.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'card.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'card.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'card.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-form',
          titleKey: 'card.demo.form',
          level: 3,
        },
        {
          id: 'example-metric',
          titleKey: 'card.demo.metric',
          level: 3,
        },
        {
          id: 'example-image',
          titleKey: 'card.demo.image',
          level: 3,
        },
        {
          id: 'example-list',
          titleKey: 'card.demo.list',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'card.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'card.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const cardPageExamples = {
  composition: `sanring-card
├── sanring-card-header
│   ├── [sanringCardTitle]
│   └── [sanringCardDescription]
├── sanring-card-content
└── sanring-card-footer`,
  basic: `<sanring-card class="w-[350px]">
  <sanring-card-header>
    <h3 sanringCardTitle>Card title</h3>
    <p sanringCardDescription>Card description</p>
  </sanring-card-header>
  <sanring-card-content>
    <p class="text-sm text-[var(--docs-muted)]">
      Compose any content with native HTML.
    </p>
  </sanring-card-content>
</sanring-card>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_CARD_IMPORTS } from './components/ui/card';

@Component({
  imports: [SANRING_CARD_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-card>
  <sanring-card-header>
    <h3 sanringCardTitle>建立新專案</h3>
    <p sanringCardDescription>一鍵部署你的新專案環境。</p>
  </sanring-card-header>
  <sanring-card-content>
    Content
  </sanring-card-content>
</sanring-card>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { CardComponent, CardContentComponent, CardDescriptionDirective, CardFooterComponent, CardHeaderComponent, CardTitleDirective } from './components/ui/card';

@Component({
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CardDescriptionDirective,
    CardContentComponent,
    CardFooterComponent,
  ],
})
export class ExampleComponent {}`,
  form: `<sanring-card class="w-[350px]">
  <sanring-card-header>
    <h3 sanringCardTitle>建立新專案</h3>
    <p sanringCardDescription>一鍵部署你的新專案環境。</p>
  </sanring-card-header>

  <sanring-card-content>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <label class="text-sm font-medium">專案名稱</label>
        <div class="h-9 w-full rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] px-3 py-1"></div>
      </div>
      <div class="flex flex-col space-y-1.5">
        <label class="text-sm font-medium">框架</label>
        <div class="h-9 w-full rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] px-3 py-1"></div>
      </div>
    </div>
  </sanring-card-content>

  <sanring-card-footer class="flex justify-between">
    <button sanringBtn variant="outline">取消</button>
    <button sanringBtn>部署</button>
  </sanring-card-footer>
</sanring-card>`,
  metric: `<sanring-card class="w-[300px]">
  <sanring-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
    <h3 sanringCardTitle class="text-sm font-medium">總金鑰呼叫次數</h3>
    <svg lucideActivity class="size-4 text-[var(--docs-muted)]"></svg>
  </sanring-card-header>

  <sanring-card-content>
    <div class="text-2xl font-bold">+23,541</div>
    <p sanringCardDescription class="mt-1 text-xs">
      較上個月增長 20.1%
    </p>
  </sanring-card-content>
</sanring-card>`,
  image: `<sanring-card class="w-[320px] overflow-hidden">
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
</sanring-card>`,
  list: `<sanring-card class="w-[380px]">
  <sanring-card-header>
    <h3 sanringCardTitle>API 金鑰狀態</h3>
    <p sanringCardDescription>你目前有 2 個運行中的金鑰。</p>
  </sanring-card-header>

  <sanring-card-content class="grid gap-4">
    <div class="flex items-center space-x-4 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] p-4">
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

    <div class="flex items-center space-x-4 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] p-4">
      <svg lucideKey class="size-5 text-[var(--docs-muted)]"></svg>
      <div class="flex-1 space-y-1">
        <p class="text-sm font-medium leading-none text-[var(--docs-muted)]">Test Key</p>
        <p class="text-sm text-[var(--docs-muted)]">sk_test_...1b9c</p>
      </div>
      <span sanringBadge variant="secondary">Revoked</span>
    </div>
  </sanring-card-content>

  <sanring-card-footer>
    <button sanringBtn class="w-full">
      <svg lucidePlus class="mr-2 size-4"></svg>
      產生新金鑰
    </button>
  </sanring-card-footer>
</sanring-card>`,
} as const;
