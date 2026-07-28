import { Component, inject, signal } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideX } from '@lucide/angular';
import { ButtonDirective, CheckboxComponent, InputDirective, SANRING_TRANSFER_IMPORTS, TransferItem } from '@sanring/ui';
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
import { transferPage, transferPageExamples } from './transfer.docs';

@Component({
  selector: 'app-transfer-page',
  imports: [
    SANRING_TRANSFER_IMPORTS,
    ButtonDirective,
    CheckboxComponent,
    InputDirective,
    LucideChevronLeft,
    LucideChevronRight,
    LucideX,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
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
          <div previewer class="w-[min(480px,100%)]">
            <sanring-transfer
              #basicTransfer
              [items]="items"
              [(selectedKeys)]="basicSelectedKeys"
              class="flex items-stretch gap-2"
            >
              <sanring-transfer-panel direction="source" class="h-72 w-56" #basicSourcePanel="sanringTransferPanel">
                <sanring-transfer-header isShow>
                  <sanring-checkbox
                    size="sm"
                    [checked]="basicSourcePanel.selectAllChecked()"
                    [disabled]="!basicSourcePanel.interactive()"
                    (checkedChange)="basicSourcePanel.toggleSelectAll()"
                  />
                  <span>{{ i18n.t('transfer.demo.available') }}</span>
                </sanring-transfer-header>
                <sanring-transfer-list />
              </sanring-transfer-panel>

              <div sanringTransferAction>
                <button
                  sanringBtn
                  variant="outline"
                  size="icon"
                  [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                  (click)="basicTransfer.moveToTarget()"
                >
                  <svg lucideChevronRight class="size-4"></svg>
                </button>
                <button
                  sanringBtn
                  variant="outline"
                  size="icon"
                  [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                  (click)="basicTransfer.moveToSource()"
                >
                  <svg lucideChevronLeft class="size-4"></svg>
                </button>
              </div>

              <sanring-transfer-panel direction="target" class="h-72 w-56" #basicTargetPanel="sanringTransferPanel">
                <sanring-transfer-header isShow>
                  <sanring-checkbox
                    size="sm"
                    [checked]="basicTargetPanel.selectAllChecked()"
                    [disabled]="!basicTargetPanel.interactive()"
                    (checkedChange)="basicTargetPanel.toggleSelectAll()"
                  />
                  <span>{{ i18n.t('transfer.demo.selected') }}</span>
                </sanring-transfer-header>
                <sanring-transfer-list />
              </sanring-transfer-panel>
            </sanring-transfer>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <div
            class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="transfer"
          manualSnippet="import { SANRING_TRANSFER_IMPORTS } from './components/ui/transfer';"
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
          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #disabledTransfer
                  [items]="itemsWithDisabled"
                  [(selectedKeys)]="disabledSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #disabledSourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="disabledSourcePanel.selectAllChecked()"
                        [disabled]="!disabledSourcePanel.interactive()"
                        (checkedChange)="disabledSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="disabledTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                      (click)="disabledTransfer.moveToSource()"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #disabledTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="disabledTargetPanel.selectAllChecked()"
                        [disabled]="!disabledTargetPanel.interactive()"
                        (checkedChange)="disabledTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-header-count')">
            <app-component-page-code-previewer
              [code]="examples.headerCount"
              language="angular-html"
            >
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #countedTransfer
                  [items]="items"
                  [(selectedKeys)]="countedSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #countedSourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="countedSourcePanel.selectAllChecked()"
                        [disabled]="!countedSourcePanel.interactive()"
                        (checkedChange)="countedSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="countedTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                      (click)="countedTransfer.moveToSource()"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #countedTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="countedTargetPanel.selectAllChecked()"
                        [disabled]="!countedTargetPanel.interactive()"
                        (checkedChange)="countedTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-custom-actions')">
            <app-component-page-code-previewer [code]="examples.customActions" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #customActionsTransfer
                  [items]="items"
                  [(selectedKeys)]="customActionsSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #customActionsSourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="customActionsSourcePanel.selectAllChecked()"
                        [disabled]="!customActionsSourcePanel.interactive()"
                        (checkedChange)="customActionsSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button sanringBtn variant="outline" size="sm" (click)="customActionsTransfer.moveToTarget()">
                      <svg lucideChevronRight class="size-4"></svg>
                      {{ i18n.t('transfer.demo.add') }}
                    </button>
                    <button sanringBtn variant="ghost" size="sm" (click)="customActionsTransfer.moveToSource()">
                      <svg lucideChevronLeft class="size-4"></svg>
                      {{ i18n.t('transfer.demo.remove') }}
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #customActionsTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="customActionsTargetPanel.selectAllChecked()"
                        [disabled]="!customActionsTargetPanel.interactive()"
                        (checkedChange)="customActionsTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-one-way')">
            <app-component-page-code-previewer [code]="examples.oneWay" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #oneWayTransfer
                  [items]="items"
                  [(selectedKeys)]="oneWaySelectedKeys"
                  mode="one-way"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #oneWaySourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="oneWaySourcePanel.selectAllChecked()"
                        [disabled]="!oneWaySourcePanel.interactive()"
                        (checkedChange)="oneWaySourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="oneWayTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #oneWayTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="oneWayTargetPanel.selectAllChecked()"
                        [disabled]="!oneWayTargetPanel.interactive()"
                        (checkedChange)="oneWayTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-search')">
            <app-component-page-code-previewer [code]="examples.search" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #searchTransfer
                  [items]="items"
                  [(selectedKeys)]="searchSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #searchSourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="searchSourcePanel.selectAllChecked()"
                        [disabled]="!searchSourcePanel.interactive()"
                        (checkedChange)="searchSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <div class="relative mx-2 my-1.5">
                      <input
                        #searchSrcInput
                        sanringInput
                        type="text"
                        [placeholder]="i18n.t('transfer.demo.searchPlaceholder')"
                        class="h-8 w-full pr-6 text-xs"
                        (input)="searchSourceQuery.set(searchSrcInput.value); searchSourcePanel.setQuery(searchSrcInput.value)"
                      />
                      @if (searchSourceQuery()) {
                        <button
                          type="button"
                          class="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--sanring-muted)] transition-colors hover:text-[var(--sanring-foreground)]"
                          [attr.aria-label]="i18n.t('transfer.demo.clearSearch')"
                          (click)="searchSourceQuery.set(''); searchSourcePanel.setQuery(''); searchSrcInput.value = ''"
                        >
                          <svg lucideX class="size-3"></svg>
                        </button>
                      }
                    </div>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="searchTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                      (click)="searchTransfer.moveToSource()"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #searchTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="searchTargetPanel.selectAllChecked()"
                        [disabled]="!searchTargetPanel.interactive()"
                        (checkedChange)="searchTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <div class="relative mx-2 my-1.5">
                      <input
                        #searchTgtInput
                        sanringInput
                        type="text"
                        [placeholder]="i18n.t('transfer.demo.searchPlaceholder')"
                        class="h-8 w-full pr-6 text-xs"
                        (input)="searchTargetQuery.set(searchTgtInput.value); searchTargetPanel.setQuery(searchTgtInput.value)"
                      />
                      @if (searchTargetQuery()) {
                        <button
                          type="button"
                          class="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--sanring-muted)] transition-colors hover:text-[var(--sanring-foreground)]"
                          [attr.aria-label]="i18n.t('transfer.demo.clearSearch')"
                          (click)="searchTargetQuery.set(''); searchTargetPanel.setQuery(''); searchTgtInput.value = ''"
                        >
                          <svg lucideX class="size-3"></svg>
                        </button>
                      }
                    </div>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-pagination')">
            <app-component-page-code-previewer [code]="examples.pagination" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #paginationTransfer
                  [items]="items"
                  [(selectedKeys)]="paginationSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel
                    direction="source"
                    class="h-72 w-56"
                    [pageSize]="4"
                    #paginationSourcePanel="sanringTransferPanel"
                  >
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="paginationSourcePanel.selectAllChecked()"
                        [disabled]="!paginationSourcePanel.interactive()"
                        (checkedChange)="paginationSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                    <div
                      class="flex items-center justify-between border-t border-[var(--sanring-border)] px-2 py-1.5 text-xs text-[var(--sanring-muted)]"
                    >
                      <button
                        sanringBtn
                        variant="ghost"
                        size="sm"
                        [disabled]="!paginationSourcePanel.hasPreviousPage()"
                        [attr.aria-label]="i18n.t('transfer.demo.previousPage')"
                        (click)="paginationSourcePanel.previousPage()"
                      >
                        {{ i18n.t('transfer.demo.previousPage') }}
                      </button>
                      <span>{{ paginationSourcePanel.currentPage() + 1 }} / {{ paginationSourcePanel.totalPages() }}</span>
                      <button
                        sanringBtn
                        variant="ghost"
                        size="sm"
                        [disabled]="!paginationSourcePanel.hasNextPage()"
                        [attr.aria-label]="i18n.t('transfer.demo.nextPage')"
                        (click)="paginationSourcePanel.nextPage()"
                      >
                        {{ i18n.t('transfer.demo.nextPage') }}
                      </button>
                    </div>
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="paginationTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                      (click)="paginationTransfer.moveToSource()"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #paginationTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="paginationTargetPanel.selectAllChecked()"
                        [disabled]="!paginationTargetPanel.interactive()"
                        (checkedChange)="paginationTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-select-all')">
            <app-component-page-code-previewer [code]="examples.selectAll" language="angular-html">
              <div previewer class="w-[min(480px,100%)]">
                <sanring-transfer
                  #selectAllTransfer
                  [items]="items"
                  [(selectedKeys)]="selectAllSelectedKeys"
                  class="flex items-stretch gap-2"
                >
                  <sanring-transfer-panel direction="source" class="h-72 w-56" #selectAllSourcePanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="selectAllSourcePanel.selectAllChecked()"
                        [disabled]="!selectAllSourcePanel.interactive()"
                        (checkedChange)="selectAllSourcePanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.available') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>

                  <div sanringTransferAction>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToTarget')"
                      (click)="selectAllTransfer.moveToTarget()"
                    >
                      <svg lucideChevronRight class="size-4"></svg>
                    </button>
                    <button
                      sanringBtn
                      variant="outline"
                      size="icon"
                      [attr.aria-label]="i18n.t('transfer.demo.moveToSource')"
                      (click)="selectAllTransfer.moveToSource()"
                    >
                      <svg lucideChevronLeft class="size-4"></svg>
                    </button>
                  </div>

                  <sanring-transfer-panel direction="target" class="h-72 w-56" #selectAllTargetPanel="sanringTransferPanel">
                    <sanring-transfer-header isShow>
                      <sanring-checkbox
                        size="sm"
                        [checked]="selectAllTargetPanel.selectAllChecked()"
                        [disabled]="!selectAllTargetPanel.interactive()"
                        (checkedChange)="selectAllTargetPanel.toggleSelectAll()"
                      />
                      <span>{{ i18n.t('transfer.demo.selected') }}</span>
                    </sanring-transfer-header>
                    <sanring-transfer-list />
                  </sanring-transfer-panel>
                </sanring-transfer>
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
export class TransferPageComponent {
  protected readonly page = transferPage;
  protected readonly examples = transferPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly items: TransferItem[] = [
    { key: 'html', label: 'HTML' },
    { key: 'css', label: 'CSS' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'typescript', label: 'TypeScript' },
    { key: 'angular', label: 'Angular' },
    { key: 'react', label: 'React' },
    { key: 'vue', label: 'Vue' },
    { key: 'svelte', label: 'Svelte' },
  ];

  protected readonly itemsWithDisabled: TransferItem[] = [
    { key: 'html', label: 'HTML' },
    { key: 'css', label: 'CSS' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'typescript', label: 'TypeScript', disabled: true },
    { key: 'angular', label: 'Angular' },
    { key: 'react', label: 'React' },
    { key: 'vue', label: 'Vue', disabled: true },
    { key: 'svelte', label: 'Svelte' },
  ];

  protected basicSelectedKeys: string[] = ['angular', 'react'];
  protected disabledSelectedKeys: string[] = ['angular'];
  protected countedSelectedKeys: string[] = ['angular', 'react'];
  protected customActionsSelectedKeys: string[] = ['angular', 'react'];
  protected oneWaySelectedKeys: string[] = ['angular'];
  protected searchSelectedKeys: string[] = ['angular', 'react'];
  protected readonly searchSourceQuery = signal('');
  protected readonly searchTargetQuery = signal('');
  protected paginationSelectedKeys: string[] = ['angular', 'react'];
  protected selectAllSelectedKeys: string[] = ['angular', 'react'];

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
