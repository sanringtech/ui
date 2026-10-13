import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideBold,
  LucideItalic,
  LucideList,
  LucideListOrdered,
  LucideQuote,
  LucideRedo2,
  LucideStrikethrough,
  LucideUnderline,
  LucideUndo2,
} from '@lucide/angular';
import {
  DividerComponent,
  ErrorMessageComponent,
  FieldLabelDirective,
  SANRING_RICH_TEXT_EDITOR_IMPORTS,
  SANRING_TOOLTIP_IMPORTS,
  SanringFieldComponent,
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageKeyboardTableComponent,
  ComponentPageUsageImportsComponent,
  ComponentPageSectionComponent,
} from '../../../layouts/component-page';
import { richTextEditorPage, richTextEditorPageExamples } from './rich-text-editor.docs';

@Component({
  selector: 'app-rich-text-editor-page',
  imports: [
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageKeyboardTableComponent,
    ComponentPageUsageImportsComponent,
    ComponentPageSectionComponent,
    DividerComponent,
    ErrorMessageComponent,
    FieldLabelDirective,
    LucideBold,
    LucideItalic,
    LucideList,
    LucideListOrdered,
    LucideQuote,
    LucideRedo2,
    LucideStrikethrough,
    LucideUnderline,
    LucideUndo2,
    ReactiveFormsModule,
    SANRING_RICH_TEXT_EDITOR_IMPORTS,
    SANRING_TOOLTIP_IMPORTS,
    SanringFieldComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections" [componentId]="page.componentId">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
        [registryDeps]="page.registryDeps"
        [ssrSafe]="page.ssrSafe"
        [hasAccessibilityNotes]="true"
        [hasKeyboardSupport]="true"
        [stateModelLabel]="i18n.t('component.header.stateful')"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="grid w-[min(520px,100%)] gap-3">
            <sanring-field>
              <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
              <label sanringLabel id="rte-docs-message-label">Message</label>
              <sanring-rich-text-editor
                ariaLabelledBy="rte-docs-message-label"
                data-testid="rte-basic"
                [formControl]="message"
              >
                <sanring-rich-text-editor-toolbar data-testid="rte-toolbar">
                  <button sanringRichTextEditorAction="undo" variant="ghost" size="icon" ariaLabel="Undo">
                    <svg lucideUndo2 class="size-4"></svg>
                  </button>
                  <button sanringRichTextEditorAction="redo" variant="ghost" size="icon" ariaLabel="Redo">
                    <svg lucideRedo2 class="size-4"></svg>
                  </button>
                  <sanring-divider vertical class="mx-1 my-1" />
                  <sanring-rich-text-editor-heading-menu />
                  <sanring-divider vertical class="mx-1 my-1" />
                  <sanring-tooltip>
                    <button
                      sanringRichTextEditorToggle="bold"
                      sanringTooltipTrigger
                      size="sm"
                      ariaLabel="Bold"
                      data-testid="rte-btn-bold"
                    >
                      <svg lucideBold class="size-4"></svg>
                    </button>
                    <sanring-tooltip-content>Bold (Ctrl+B)</sanring-tooltip-content>
                  </sanring-tooltip>
                  <sanring-tooltip>
                    <button
                      sanringRichTextEditorToggle="italic"
                      sanringTooltipTrigger
                      size="sm"
                      ariaLabel="Italic"
                      data-testid="rte-btn-italic"
                    >
                      <svg lucideItalic class="size-4"></svg>
                    </button>
                    <sanring-tooltip-content>Italic (Ctrl+I)</sanring-tooltip-content>
                  </sanring-tooltip>
                  <button sanringRichTextEditorToggle="underline" size="sm" ariaLabel="Underline">
                    <svg lucideUnderline class="size-4"></svg>
                  </button>
                  <button sanringRichTextEditorToggle="strike" size="sm" ariaLabel="Strikethrough">
                    <svg lucideStrikethrough class="size-4"></svg>
                  </button>
                  <sanring-divider vertical class="mx-1 my-1" />
                  <button sanringRichTextEditorToggle="bulletList" size="sm" ariaLabel="Bulleted list">
                    <svg lucideList class="size-4"></svg>
                  </button>
                  <button sanringRichTextEditorToggle="orderedList" size="sm" ariaLabel="Numbered list">
                    <svg lucideListOrdered class="size-4"></svg>
                  </button>
                  <button sanringRichTextEditorToggle="blockquote" size="sm" ariaLabel="Quote">
                    <svg lucideQuote class="size-4"></svg>
                  </button>
                </sanring-rich-text-editor-toolbar>
              </sanring-rich-text-editor>
              <sanring-error-message>Message is required.</sanring-error-message>
            </sanring-field>
            <pre
              data-testid="rte-basic-value"
              class="overflow-x-auto rounded-[var(--sanring-radius-sm)] bg-[var(--sanring-surface-strong)] p-3 text-xs"
              >{{ messageValue() }}</pre
            >
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="rich-text-editor"
          manualSnippet="import { SANRING_RICH_TEXT_EDITOR_IMPORTS } from './components/ui/rich-text-editor';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('accessibility')" />

      <app-component-page-section [section]="section('keyboard')">
        <app-component-page-keyboard-table [rows]="page.keyboardRows!" />
      </app-component-page-section>

      <app-component-page-section [section]="section('stateModel')" />
    </app-component-page>
  `,
})
export class RichTextEditorPageComponent {
  protected readonly page = richTextEditorPage;
  protected readonly examples = richTextEditorPageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly message = new FormControl('<p>Hello <strong>Sanring</strong></p>', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly messageValue = toSignal(this.message.valueChanges, {
    initialValue: this.message.value,
  });

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
