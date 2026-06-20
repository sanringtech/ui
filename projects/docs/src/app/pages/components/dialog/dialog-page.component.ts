import { Component, inject } from '@angular/core';
import {
  ButtonDirective,
  DialogCloseDirective,
  DialogContentComponent,
  DialogDescriptionDirective,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleDirective,
  DialogTriggerDirective,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { dialogPage, dialogPageExamples } from './dialog.docs';

@Component({
  selector: 'app-dialog-page',
  imports: [
    ButtonDirective,
    DialogCloseDirective,
    DialogContentComponent,
    DialogDescriptionDirective,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogTitleDirective,
    DialogTriggerDirective,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
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
          <div previewer class="flex justify-center">
            <button sanringBtn [sanringDialogTrigger]="basicDialog" type="button">
              {{ i18n.t('dialog.demo.open') }}
            </button>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageImport" language="typescript" />
          </div>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')" />

      <app-component-page-section [section]="section('composition')">
        <div class="grid gap-4">
          <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
            Use the following composition to build a
            <code class="rounded-md bg-[var(--docs-elevated)] px-1.5 py-1 font-mono text-xs">
              Dialog
            </code>
            :
          </p>
          <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.composition" language="bash" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div>
          <app-component-page-section [section]="section('example-custom-close')">
            <app-component-page-code-previewer [code]="examples.customClose" language="angular-html">
              <div previewer class="flex justify-center">
                <button sanringBtn [sanringDialogTrigger]="customCloseDialog" type="button">
                  {{ i18n.t('dialog.demo.customClose') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-no-close')">
            <app-component-page-code-previewer [code]="examples.noClose" language="angular-html">
              <div previewer class="flex justify-center">
                <button sanringBtn [sanringDialogTrigger]="noCloseDialog" type="button">
                  {{ i18n.t('dialog.demo.noClose') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-sticky-footer')">
            <app-component-page-code-previewer [code]="examples.stickyFooter" language="angular-html">
              <div previewer class="flex justify-center">
                <button sanringBtn [sanringDialogTrigger]="stickyFooterDialog" type="button">
                  {{ i18n.t('dialog.demo.stickyFooter') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-scrollable')">
            <app-component-page-code-previewer [code]="examples.scrollable" language="angular-html">
              <div previewer class="flex justify-center">
                <button sanringBtn [sanringDialogTrigger]="scrollableDialog" type="button">
                  {{ i18n.t('dialog.demo.scrollable') }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <div class="overflow-hidden rounded-lg border border-[var(--docs-border)]">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
              <tr>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.property') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.type') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.default') }}
                </th>
                <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
                  {{ i18n.t('link.api.descriptionLabel') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-[var(--docs-border)]">
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">class</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">string</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">''</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('dialog.api.class.description') }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">showClose</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">boolean</td>
                <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">true</td>
                <td class="px-4 py-3 text-[var(--docs-muted)]">
                  {{ i18n.t('dialog.api.showClose.description') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-component-page-section>

      <ng-template #basicDialog>
        <sanring-dialog-content>
          <sanring-dialog-header>
            <h2 sanringDialogTitle>Edit profile</h2>
            <p sanringDialogDescription>Make changes to your profile here.</p>
          </sanring-dialog-header>
        </sanring-dialog-content>
      </ng-template>

      <ng-template #customCloseDialog>
        <sanring-dialog-content [showClose]="false">
          <sanring-dialog-header>
            <h2 sanringDialogTitle>Custom close button</h2>
            <p sanringDialogDescription>Close this dialog from an action button.</p>
          </sanring-dialog-header>
          <sanring-dialog-footer>
            <button sanringBtn sanringDialogClose type="button">Done</button>
          </sanring-dialog-footer>
        </sanring-dialog-content>
      </ng-template>

      <ng-template #noCloseDialog>
        <sanring-dialog-content [showClose]="false">
          <sanring-dialog-header>
            <h2 sanringDialogTitle>No close button</h2>
            <p sanringDialogDescription>
              This dialog hides the built-in close control. Press Escape or click the backdrop.
            </p>
          </sanring-dialog-header>
        </sanring-dialog-content>
      </ng-template>

      <ng-template #stickyFooterDialog>
        <sanring-dialog-content
          class="grid max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0"
        >
          <sanring-dialog-header class="p-6 pb-0">
            <h2 sanringDialogTitle>Sticky footer</h2>
            <p sanringDialogDescription>Actions stay visible while content scrolls.</p>
          </sanring-dialog-header>
          <div class="min-h-0 overflow-y-auto px-6 py-4">
            <div class="grid gap-3 text-sm text-[var(--docs-muted)]">
              @for (item of longItems; track item) {
                <p class="m-0">{{ item }}</p>
              }
            </div>
          </div>
          <sanring-dialog-footer class="border-t border-[var(--docs-border)] p-6">
            <button sanringBtn sanringDialogClose type="button">Save changes</button>
          </sanring-dialog-footer>
        </sanring-dialog-content>
      </ng-template>

      <ng-template #scrollableDialog>
        <sanring-dialog-content class="max-h-[80dvh] overflow-y-auto border-0">
          <sanring-dialog-header>
            <h2 sanringDialogTitle>Scrollable content</h2>
            <p sanringDialogDescription>Use scrolling for dense content.</p>
          </sanring-dialog-header>
          <div class="grid gap-3 text-sm text-[var(--docs-muted)]">
            @for (item of longItems; track item) {
              <p class="m-0">{{ item }}</p>
            }
          </div>
        </sanring-dialog-content>
      </ng-template>
    </app-component-page>
  `,
})
export class DialogPageComponent {
  protected readonly page = dialogPage;
  protected readonly examples = dialogPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly longItems = Array.from({ length: 24 }, (_, index) => {
    return `Dialog content paragraph ${index + 1}. This text keeps enough density to demonstrate scroll behavior.`;
  });

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
