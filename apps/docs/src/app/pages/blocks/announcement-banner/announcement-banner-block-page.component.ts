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
import {
  ANNOUNCEMENT_BANNER_LABELS_EN,
  ANNOUNCEMENT_BANNER_LABELS_ZH_HANT,
  AnnouncementBannerComponent,
  type AnnouncementBannerItem,
  type AnnouncementBannerLinkClick,
} from '../../../../registry-stage/announcement-banner';
import { BlockCompositionComponent } from '../block-composition.component';
import { getDocsBlock } from '../blocks.catalog';

@Component({
  selector: 'app-announcement-banner-block-page',
  imports: [
    AnnouncementBannerComponent,
    BlockCompositionComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
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
        <div class="mt-4">
          <app-block-composition
            [componentDeps]="block.componentDeps"
            [peerDependencies]="block.peerDependencies"
            [componentsLabel]="i18n.t('blocks.section.components')"
            [peersLabel]="i18n.t('blocks.section.peers')"
          />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <app-component-page-installation
          [componentName]="block.installName"
          manualSnippet="import { AnnouncementBannerComponent } from './components/ui/announcement-banner';"
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
          <!-- transform makes this frame the containing block for the fixed cards, so they stay inside the preview -->
          <div
            previewer
            data-testid="announcement-preview-frame"
            class="relative h-[340px] w-full min-w-0 overflow-hidden bg-[var(--docs-surface)] [transform:translateZ(0)]"
          >
            <div class="flex items-center justify-between border-b border-[var(--docs-border)] px-4 py-2">
              <span class="text-sm font-semibold">blueprint</span>
              <span class="text-xs text-[var(--docs-muted)]">{{ i18n.t('blocks.announcement.preview.hint') }}</span>
            </div>
            <div class="grid gap-2 p-4" aria-hidden="true">
              <div class="h-4 w-1/3 rounded bg-[var(--docs-elevated)]"></div>
              <div class="h-4 w-2/3 rounded bg-[var(--docs-elevated)]"></div>
              <div class="h-4 w-1/2 rounded bg-[var(--docs-elevated)]"></div>
            </div>
            @if (visible().length === 0) {
              <div class="p-4">
                <button
                  type="button"
                  class="cursor-pointer rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-1.5 text-sm hover:bg-[var(--docs-elevated)]"
                  (click)="dismissedIds.set([])"
                >
                  {{ i18n.locale() === 'zh' ? '重新顯示公告' : 'Show announcements again' }}
                </button>
              </div>
            }
            <sanring-announcement-banner
              [items]="visible()"
              [labels]="labels()"
              (dismissed)="dismiss($event)"
              (linkClicked)="onLink($event)"
            />
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.notesKey!) }}
        </p>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class AnnouncementBannerBlockPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly block = getDocsBlock('announcement-banner');
  protected readonly dismissedIds = signal<string[]>([]);

  protected readonly labels = () =>
    this.i18n.locale() === 'zh' ? ANNOUNCEMENT_BANNER_LABELS_ZH_HANT : ANNOUNCEMENT_BANNER_LABELS_EN;

  private readonly items = (): AnnouncementBannerItem[] => [
    {
      id: 'maintenance',
      text:
        this.i18n.locale() === 'zh'
          ? '今晚 22:00–23:00 系統維護，期間無法存檔。'
          : 'Scheduled maintenance tonight 22:00–23:00. Saving is unavailable during this time.',
      link: '#maintenance',
    },
  ];

  protected readonly visible = () => this.items().filter((item) => !this.dismissedIds().includes(item.id));

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
    { id: 'notes', titleKey: 'blocks.section.notes' },
  ];

  protected readonly usageTs = `import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnnouncementBannerComponent,
  type AnnouncementBannerItem,
  type AnnouncementBannerLinkClick,
} from './components/ui/announcement-banner';

@Component({
  imports: [AnnouncementBannerComponent],
  templateUrl: './app-shell.html',
})
export class AppShell {
  private readonly router = inject(Router);
  // From your backend (proxying sanring-notify GET /api/v1/banners/active),
  // with text already picked for the current language.
  readonly banners = signal<AnnouncementBannerItem[]>([]);

  hide(id: string) {
    // e.g. remember in sessionStorage and filter it out
  }

  onLink({ item, event }: AnnouncementBannerLinkClick) {
    const url = new URL(item.link!, location.href);
    if (url.origin !== location.origin) return; // other sites: normal link
    event.preventDefault();
    this.router.navigateByUrl(url.pathname + url.search + url.hash);
  }
}`;

  protected readonly usageHtml = `<!-- anywhere in the shell: the cards are fixed and never change your layout -->
<sanring-announcement-banner
  [items]="banners()"
  (dismissed)="hide($event)"
  (linkClicked)="onLink($event)"
/>`;

  protected dismiss(id: string): void {
    this.dismissedIds.update((ids) => [...ids, id]);
  }

  protected onLink({ event }: AnnouncementBannerLinkClick): void {
    event.preventDefault();
  }
}
