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
  NOTIFICATION_BELL_LABELS_EN,
  NOTIFICATION_BELL_LABELS_ZH_HANT,
  NotificationBellComponent,
  type NotificationBellItem,
} from '../../../../registry-stage/notification-bell';
import { ToasterComponent, ToastService } from '../../../../registry-stage/toast';
import { BlockCompositionComponent } from '../block-composition.component';
import { getDocsBlock } from '../blocks.catalog';

@Component({
  selector: 'app-notification-bell-block-page',
  imports: [
    BlockCompositionComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
    NotificationBellComponent,
    ToasterComponent,
  ],
  // The bell injects ToastService; the docs page provides one so the preview can show the new-notification toast.
  providers: [ToastService],
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
            [peerDependencies]="block.peerDependencies"
            [componentsLabel]="i18n.t('blocks.section.components')"
            [peersLabel]="i18n.t('blocks.section.peers')"
          />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <app-component-page-installation
          [componentName]="block.installName"
          manualSnippet="import { NotificationBellComponent } from './components/ui/notification-bell';"
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
          <div previewer class="flex min-h-[320px] w-full min-w-0 flex-col items-center gap-6 bg-[var(--docs-surface)] p-6">
            <div class="flex w-full max-w-md items-center justify-between rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-4 py-2">
              <span class="text-sm font-semibold">blueprint</span>
              <sanring-notification-bell
                [items]="items()"
                [unreadCount]="unread()"
                [labels]="labels()"
                (itemSelected)="onSelected($event)"
                (markAllRead)="onMarkAllRead()"
              />
            </div>
            <button
              type="button"
              class="cursor-pointer rounded-[var(--sanring-radius)] border border-[var(--docs-border)] px-3 py-1.5 text-sm hover:bg-[var(--docs-elevated)]"
              (click)="simulate()"
            >
              {{ i18n.t('blocks.bell.preview.simulate') }}
            </button>
          </div>
        </app-component-page-code-previewer>
        <sanring-toaster position="bottom-right" />
      </app-component-page-section>

      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.notesKey!) }}
        </p>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class NotificationBellBlockPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly block = getDocsBlock('notification-bell');

  private readonly samples = [
    { zh: '業務小王送出方案 SP-1042，等你核准', en: 'Proposal SP-1042 awaits your approval' },
    { zh: '平面圖辨識完成：A 棟 3F', en: 'Floor plan recognized: Building A 3F' },
    { zh: '報價單 Q-2201 已被退回', en: 'Quote Q-2201 was returned' },
  ];
  private next = 0;
  private readonly rows = signal<{ id: string; sample: number; createdAt: Date; read: boolean }[]>([
    { id: 'n2', sample: 1, createdAt: new Date(Date.now() - 3_600_000), read: false },
    { id: 'n1', sample: 2, createdAt: new Date(Date.now() - 86_400_000), read: true },
  ]);
  protected readonly unread = signal<number | null>(1);

  protected readonly labels = () =>
    this.i18n.locale() === 'zh' ? NOTIFICATION_BELL_LABELS_ZH_HANT : NOTIFICATION_BELL_LABELS_EN;

  protected readonly items = (): NotificationBellItem[] =>
    this.rows().map((row) => ({
      id: row.id,
      text: this.i18n.locale() === 'zh' ? this.samples[row.sample].zh : this.samples[row.sample].en,
      createdAt: row.createdAt,
      read: row.read,
    }));

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
  NotificationBellComponent,
  type NotificationBellItem,
  type NotificationBellState,
} from './components/ui/notification-bell';

@Component({
  imports: [NotificationBellComponent],
  templateUrl: './app-header.html',
})
export class AppHeader {
  private readonly router = inject(Router);
  readonly items = signal<NotificationBellItem[]>([]);
  readonly unread = signal<number | null>(null); // null until the first poll returns
  readonly state = signal<NotificationBellState>('loading');

  // Poll your own backend (which proxies sanring-notify) every 60 s:
  // this.unread.set((await api.unreadCount()).count);

  onOpen(open: boolean) {
    // fetch the list only while the panel is open, then this.state.set('ready')
  }

  onSelected(item: NotificationBellItem) {
    // mark as read on your backend, then go to the notification's link
  }
}`;

  protected readonly usageHtml = `<sanring-notification-bell
  [items]="items()"
  [unreadCount]="unread()"
  [state]="state()"
  (openChange)="onOpen($event)"
  (itemSelected)="onSelected($event)"
  (markAllRead)="markAllRead()"
  (retry)="onOpen(true)"
/>

<!-- once in the app, for the new-notification toast (with ToastService in providers) -->
<sanring-toaster />`;

  protected simulate(): void {
    const sample = this.next++ % this.samples.length;
    this.rows.update((rows) => [{ id: `new-${Date.now()}`, sample, createdAt: new Date(), read: false }, ...rows]);
    this.unread.update((count) => (count ?? 0) + 1);
  }

  protected onSelected(item: NotificationBellItem): void {
    if (item.read) return;
    this.rows.update((rows) => rows.map((row) => (row.id === item.id ? { ...row, read: true } : row)));
    this.unread.update((count) => Math.max(0, (count ?? 0) - 1));
  }

  protected onMarkAllRead(): void {
    this.rows.update((rows) => rows.map((row) => ({ ...row, read: true })));
    this.unread.set(0);
  }
}
