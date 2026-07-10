import { Component, inject } from '@angular/core';
import { ButtonDirective, CommandDialogComponent, SANRING_COMMAND_IMPORTS } from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { commandPage, commandPageExamples } from './command.docs';

@Component({
  selector: 'app-command-page',
  imports: [
    ButtonDirective,
    SANRING_COMMAND_IMPORTS,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
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
          <div previewer class="w-[min(420px,100%)]">
            <sanring-command
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
              (valueChange)="onSelect($event)"
            >
              <sanring-command-input [placeholder]="i18n.t('command.demo.placeholder')" />
              <sanring-command-list>
                <sanring-command-empty>{{ i18n.t('command.demo.empty') }}</sanring-command-empty>

                <sanring-command-group [heading]="i18n.t('command.demo.suggestions')">
                  @for (item of suggestions; track item.value) {
                    <sanring-command-item [value]="item.value">{{ item.label }}</sanring-command-item>
                  }
                </sanring-command-group>

                <sanring-command-group [heading]="i18n.t('command.demo.settingsGroup')">
                  @for (item of settingsItems; track item.value) {
                    <sanring-command-item [value]="item.value">{{ item.label }}</sanring-command-item>
                  }
                </sanring-command-group>
              </sanring-command-list>
            </sanring-command>
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
          componentName="command"
          manualSnippet="import { SANRING_COMMAND_IMPORTS } from '@sanring/ui';"
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
          <app-component-page-section [section]="section('example-dialog')">
            <app-component-page-code-previewer [code]="examples.dialog" language="angular-html">
              <div previewer class="flex min-h-[160px] items-center justify-center">
                <button
                  sanringBtn
                  type="button"
                  variant="outline"
                  (click)="commandDialog.open()"
                >
                  {{ i18n.t('command.demo.openDialog') }}
                  <span
                    class="ml-2 rounded-[var(--sanring-radius-xs)] border border-[var(--docs-border)] px-1.5 py-0.5 text-xs text-[var(--docs-muted)]"
                  >
                    {{ commandDialog.shortcutHint() }}
                  </span>
                </button>

                <sanring-command-dialog #commandDialog>
                  <sanring-command (valueChange)="onDialogSelect($event, commandDialog)">
                    <sanring-command-input [placeholder]="i18n.t('command.demo.placeholder')" />
                    <sanring-command-list>
                      <sanring-command-empty>{{ i18n.t('command.demo.empty') }}</sanring-command-empty>
                      <sanring-command-group [heading]="i18n.t('command.demo.suggestions')">
                        @for (item of suggestions; track item.value) {
                          <sanring-command-item [value]="item.value">{{ item.label }}</sanring-command-item>
                        }
                      </sanring-command-group>
                    </sanring-command-list>
                  </sanring-command>
                </sanring-command-dialog>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-shortcuts')">
            <app-component-page-code-previewer [code]="examples.shortcuts" language="angular-html">
              <div previewer class="w-[min(420px,100%)]">
                <sanring-command class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <sanring-command-input [placeholder]="i18n.t('command.demo.placeholder')" />
                  <sanring-command-list>
                    <sanring-command-empty>{{ i18n.t('command.demo.empty') }}</sanring-command-empty>
                    <sanring-command-group [heading]="i18n.t('command.demo.settingsGroup')">
                      <sanring-command-item value="profile">
                        Profile
                        <sanring-command-shortcut>⌘P</sanring-command-shortcut>
                      </sanring-command-item>
                      <sanring-command-item value="billing">
                        Billing
                        <sanring-command-shortcut>⌘B</sanring-command-shortcut>
                      </sanring-command-item>
                      <sanring-command-item value="archive" [disabled]="true">
                        {{ i18n.t('command.demo.disabledItem') }}
                        <sanring-command-shortcut>⌘⇧A</sanring-command-shortcut>
                      </sanring-command-item>
                    </sanring-command-group>
                  </sanring-command-list>
                </sanring-command>
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
export class CommandPageComponent {
  protected readonly page = commandPage;
  protected readonly examples = commandPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly suggestions = [
    { value: 'calendar', label: 'Calendar' },
    { value: 'emoji', label: 'Search Emoji' },
    { value: 'calculator', label: 'Calculator' },
  ];

  protected readonly settingsItems = [
    { value: 'profile', label: 'Profile' },
    { value: 'billing', label: 'Billing' },
  ];

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected onSelect(value: string): void {
    console.log('Selected:', value);
  }

  protected onDialogSelect(value: string, dialog: CommandDialogComponent): void {
    console.log('Selected:', value);
    dialog.close();
  }
}
