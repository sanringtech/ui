import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBlocks,
  LucideBox,
  LucideChevronRight,
  LucideCode2,
  LucideLayers3,
  LucidePalette,
  LucideSparkles,
  LucideTerminalSquare,
} from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { docsComponentItems } from '../../navigation/docs-navigation';

interface HomeFeature {
  title: string;
  description: string;
  icon: 'layers' | 'palette' | 'code' | 'box';
}

interface HomeHighlight {
  label: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ButtonDirective,
    LucideBlocks,
    LucideBox,
    LucideChevronRight,
    LucideCode2,
    LucideLayers3,
    LucidePalette,
    LucideSparkles,
    LucideTerminalSquare,
  ],
  template: `
    <section class="mx-auto flex w-full max-w-[1180px] flex-col gap-16 px-8 pb-24 pt-14 max-[860px]:gap-12 max-[860px]:px-5 max-[860px]:pt-9">
      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div class="min-w-0">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--docs-accent)_42%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_9%,var(--docs-surface))] px-3 py-1 text-sm font-medium text-[var(--docs-muted)]"
          >
            <svg class="size-4 text-[var(--docs-accent-strong)]" lucideSparkles></svg>
            Angular component primitives
          </div>

          <h1 class="m-0 max-w-[760px] text-[56px] font-semibold leading-[1.04] tracking-normal text-[var(--docs-fg)] max-[860px]:text-[40px] max-[520px]:text-[34px]">
            Sanring UI
          </h1>

          <p class="mb-0 mt-6 max-w-[680px] text-[18px] leading-[1.75] text-[var(--docs-muted)] max-[520px]:text-base">
            一套為 Angular 應用打造的元件 primitives、文件站與 registry 工作流。你可以直接組合低耦合元件、覆寫樣式，並透過 CLI 把需要的片段帶進產品。
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              sanringBtn
              class="border-[var(--docs-accent)] bg-[var(--docs-accent)] text-[var(--docs-accent-fg)] hover:bg-[var(--docs-accent-strong)]"
              routerLink="/components"
              variant="default"
              size="md"
            >
              瀏覽元件
              <svg class="size-4" lucideChevronRight></svg>
            </a>
            <a sanringBtn routerLink="/components/button" variant="outline" size="md">
              查看範例
            </a>
          </div>
        </div>

        <div
          class="min-w-0 rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[0_24px_80px_color-mix(in_srgb,var(--docs-bg)_72%,transparent)]"
        >
          <div class="flex items-center justify-between border-b border-[var(--docs-border)] pb-4">
            <div>
              <p class="m-0 text-sm font-medium text-[var(--docs-muted)]">Registry snapshot</p>
              <h2 class="m-0 mt-1 text-xl font-semibold text-[var(--docs-fg)]">可用元件與工具</h2>
            </div>
            <div class="rounded-[6px] border border-[color-mix(in_srgb,var(--docs-accent)_35%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-surface))] p-2 text-[var(--docs-accent-strong)]">
              <svg class="size-5" lucideBlocks></svg>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 py-5 max-[1180px]:grid-cols-2 max-[520px]:grid-cols-1">
            @for (highlight of highlights; track highlight.label) {
              <div class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4">
                <p
                  class="m-0 min-w-0 whitespace-nowrap text-[22px] font-semibold leading-tight text-[var(--docs-accent-strong)]"
                >
                  {{ highlight.value }}
                </p>
                <p class="m-0 mt-1 text-sm font-medium text-[var(--docs-fg)]">{{ highlight.label }}</p>
                <p class="m-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">{{ highlight.description }}</p>
              </div>
            }
          </div>

          <div class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-code)] p-4 font-mono text-sm leading-7 text-[var(--docs-fg)]">
            <div class="flex items-center gap-2 text-[var(--docs-muted)]">
              <svg class="size-4" lucideTerminalSquare></svg>
              install components
            </div>
            <pre class="m-0 mt-3 overflow-x-auto"><code>pnpm dlx &#64;sanring/cli add button dialog toast</code></pre>
          </div>
        </div>
      </div>

      <section>
        <div class="mb-6 flex items-end justify-between gap-6 max-[720px]:block">
          <div>
            <p class="m-0 text-sm font-semibold uppercase text-[var(--docs-muted)]">Highlights</p>
            <h2 class="m-0 mt-2 text-[30px] font-semibold leading-tight text-[var(--docs-fg)]">重點特色</h2>
          </div>
          <p class="m-0 max-w-[520px] text-base leading-7 text-[var(--docs-muted)] max-[720px]:mt-3">
            從互動狀態、樣式擴充到發佈流程，Sanring UI 將常見產品介面拆成可預期、可維護的組合單元。
          </p>
        </div>

        <div class="grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
          @for (feature of features; track feature.title) {
            <article class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-5">
              <div class="mb-5 inline-flex rounded-[6px] border border-[color-mix(in_srgb,var(--docs-accent)_28%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-elevated))] p-2 text-[var(--docs-accent-strong)]">
                @switch (feature.icon) {
                  @case ('layers') {
                    <svg class="size-5" lucideLayers3></svg>
                  }
                  @case ('palette') {
                    <svg class="size-5" lucidePalette></svg>
                  }
                  @case ('code') {
                    <svg class="size-5" lucideCode2></svg>
                  }
                  @case ('box') {
                    <svg class="size-5" lucideBox></svg>
                  }
                }
              </div>
              <h3 class="m-0 text-lg font-semibold text-[var(--docs-fg)]">{{ feature.title }}</h3>
              <p class="m-0 mt-3 text-sm leading-6 text-[var(--docs-muted)]">{{ feature.description }}</p>
            </article>
          }
        </div>
      </section>

      <section class="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <p class="m-0 text-sm font-semibold uppercase text-[var(--docs-muted)]">Components</p>
          <h2 class="m-0 mt-2 text-[30px] font-semibold leading-tight text-[var(--docs-fg)]">已整理的元件入口</h2>
          <p class="m-0 mt-4 text-base leading-7 text-[var(--docs-muted)]">
            文件站目前收錄 {{ componentCount }} 個可用元件，涵蓋基礎操作、回饋訊息、overlay、導覽與資料呈現。
          </p>
        </div>

        <nav class="grid grid-cols-3 gap-3 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="Component shortcuts">
          @for (item of componentItems; track item.id) {
            <a
              class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-sm font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
              [routerLink]="item.path"
            >
              {{ item.name }}
            </a>
          }
        </nav>
      </section>
    </section>
  `,
})
export class HomePageComponent {
  protected readonly componentCount = docsComponentItems.length;
  protected readonly componentItems = docsComponentItems.slice(0, 12).map((item) => ({
    id: item.id,
    path: item.path,
    name: this.toTitle(item.id),
  }));

  protected readonly highlights: HomeHighlight[] = [
    {
      label: 'Components',
      value: String(this.componentCount),
      description: '目前文件站已收錄的 primitives。',
    },
    {
      label: 'Registry',
      value: '1',
      description: '以檔案 registry 管理可安裝片段。',
    },
    {
      label: 'CLI',
      value: '@sanring/cli',
      description: '用指令加入需要的元件來源碼。',
    },
  ];

  protected readonly features: HomeFeature[] = [
    {
      title: 'Composable primitives',
      description: '每個元件保留清楚的 root、trigger、content 或 directive 邊界，適合依產品需求自由組合。',
      icon: 'layers',
    },
    {
      title: 'Theme friendly',
      description: '文件站與元件共享 CSS variables，可在深色、淺色與品牌樣式之間穩定覆寫。',
      icon: 'palette',
    },
    {
      title: 'Angular first',
      description: '以 standalone component、directive、Angular CDK 與 template control flow 建構，貼近現代 Angular 專案。',
      icon: 'code',
    },
    {
      title: 'Registry workflow',
      description: '元件來源碼集中在 registry，搭配 CLI 可挑選式安裝，不必把整套設計系統綁進產品。',
      icon: 'box',
    },
  ];

  private toTitle(value: string) {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
