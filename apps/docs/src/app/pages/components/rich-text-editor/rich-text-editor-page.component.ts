import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideBold,
  LucideCode,
  LucideCornerDownLeft,
  LucideItalic,
  LucideList,
  LucideListOrdered,
  LucideMinus,
  LucideQuote,
  LucideRedo2,
  LucideRemoveFormatting,
  LucideSquareCode,
  LucideStrikethrough,
  LucideUnderline,
  LucideUndo2,
} from '@lucide/angular';
import {
  ButtonDirective,
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
    ButtonDirective,
    DividerComponent,
    ErrorMessageComponent,
    FieldLabelDirective,
    LucideBold,
    LucideCode,
    LucideCornerDownLeft,
    LucideItalic,
    LucideList,
    LucideListOrdered,
    LucideMinus,
    LucideQuote,
    LucideRedo2,
    LucideRemoveFormatting,
    LucideSquareCode,
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

      <app-component-page-section [section]="section('composition')">
        <app-component-page-code-block [code]="examples.composition" language="bash" />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-10">
          <app-component-page-section [section]="section('example-disabled')">
            <app-component-page-code-previewer [code]="examples.disabled" language="angular-html">
              <div previewer class="grid w-[min(520px,100%)] justify-items-start gap-3">
                <sanring-rich-text-editor
                  ariaLabel="Summary"
                  class="w-full"
                  data-testid="rte-disabled"
                  [formControl]="summary"
                >
                  <sanring-rich-text-editor-toolbar>
                    <button sanringRichTextEditorToggle="bold" size="sm" ariaLabel="Bold">
                      <svg lucideBold class="size-4"></svg>
                    </button>
                    <button sanringRichTextEditorToggle="italic" size="sm" ariaLabel="Italic">
                      <svg lucideItalic class="size-4"></svg>
                    </button>
                  </sanring-rich-text-editor-toolbar>
                </sanring-rich-text-editor>
                <button
                  sanringBtn
                  variant="outline"
                  size="sm"
                  type="button"
                  data-testid="rte-disabled-toggle"
                  (click)="toggleSummary()"
                >
                  {{ summary.disabled ? 'Enable editing' : 'Disable editing' }}
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-validation')">
            <app-component-page-code-previewer [code]="examples.validation" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-field>
                  <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                  <label sanringLabel id="rte-docs-description-label">Description</label>
                  <sanring-rich-text-editor
                    ariaLabelledBy="rte-docs-description-label"
                    required
                    data-testid="rte-validation"
                    [formControl]="description"
                  />
                  <sanring-error-message>Description is required.</sanring-error-message>
                </sanring-field>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-commands')">
            <app-component-page-code-previewer [code]="examples.commands" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-rich-text-editor
                  ariaLabel="Snippet"
                  class="flex-row"
                  contentClass="min-w-0 flex-1"
                  data-testid="rte-commands"
                  [formControl]="snippet"
                >
                  <sanring-rich-text-editor-toolbar orientation="vertical" data-testid="rte-commands-toolbar">
                    <sanring-rich-text-editor-heading-menu [levels]="[2, 3, 4]" />
                    <button sanringRichTextEditorToggle="code" size="sm" ariaLabel="Inline code">
                      <svg lucideCode class="size-4"></svg>
                    </button>
                    <button sanringRichTextEditorToggle="codeBlock" size="sm" ariaLabel="Code block">
                      <svg lucideSquareCode class="size-4"></svg>
                    </button>
                    <button
                      sanringRichTextEditorAction="horizontalRule"
                      variant="ghost"
                      size="icon"
                      ariaLabel="Divider"
                    >
                      <svg lucideMinus class="size-4"></svg>
                    </button>
                    <button
                      sanringRichTextEditorAction="hardBreak"
                      variant="ghost"
                      size="icon"
                      ariaLabel="Line break"
                    >
                      <svg lucideCornerDownLeft class="size-4"></svg>
                    </button>
                    <button
                      sanringRichTextEditorAction="clearFormatting"
                      variant="ghost"
                      size="icon"
                      ariaLabel="Clear formatting"
                    >
                      <svg lucideRemoveFormatting class="size-4"></svg>
                    </button>
                  </sanring-rich-text-editor-toolbar>
                </sanring-rich-text-editor>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-character-count')">
            <app-component-page-code-previewer [code]="examples.characterCount" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-field>
                  <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                  <label sanringLabel id="rte-docs-comment-label">Comment</label>
                  <sanring-rich-text-editor
                    ariaLabelledBy="rte-docs-comment-label"
                    placeholder="Write a comment…"
                    data-testid="rte-limited"
                    [maxCharacters]="140"
                    [formControl]="comment"
                  >
                    <sanring-rich-text-editor-character-count data-testid="rte-character-count" />
                  </sanring-rich-text-editor>
                </sanring-field>
                <button
                  sanringBtn
                  variant="outline"
                  size="sm"
                  type="button"
                  class="mt-3"
                  data-testid="rte-load-long"
                  (click)="comment.setValue(longComment)"
                >
                  Load a long comment
                </button>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-readonly')">
            <app-component-page-code-previewer [code]="examples.readonly" language="angular-html">
              <div previewer class="w-[min(520px,100%)]">
                <sanring-rich-text-editor
                  ariaLabel="Release notes"
                  readonly
                  data-testid="rte-readonly"
                  [formControl]="notes"
                >
                  <sanring-rich-text-editor-toolbar>
                    <sanring-rich-text-editor-heading-menu />
                    <button sanringRichTextEditorToggle="bold" size="sm" ariaLabel="Bold">
                      <svg lucideBold class="size-4"></svg>
                    </button>
                    <button sanringRichTextEditorToggle="italic" size="sm" ariaLabel="Italic">
                      <svg lucideItalic class="size-4"></svg>
                    </button>
                  </sanring-rich-text-editor-toolbar>
                </sanring-rich-text-editor>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
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

  protected readonly comment = new FormControl('', { nonNullable: true });
  protected readonly longComment =
    '<p>This comment came from the server and is longer than the 140-character limit. The editor shows all of it, the count turns red, and you can only delete text until it fits again.</p>';
  protected readonly summary = new FormControl(
    { value: '<p>Quarterly results are <strong>final</strong>; editing is locked until review.</p>', disabled: true },
    { nonNullable: true },
  );
  protected readonly description = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly snippet = new FormControl(
    '<h3>Install</h3><p>Run <code>pnpm add @tiptap/core</code>, then:</p><pre><code>sanring add rich-text-editor</code></pre>',
    { nonNullable: true },
  );

  constructor() {
    // Show the validation state right away, like the input and radio docs.
    this.description.markAsTouched();
  }

  protected toggleSummary(): void {
    if (this.summary.disabled) {
      this.summary.enable();
    } else {
      this.summary.disable();
    }
  }
  protected readonly notes = new FormControl(
    '<h2>Version 2.4</h2><ul><li><p>Faster search</p></li><li><p>New <strong>export</strong> menu</p></li></ul><blockquote><p>Upgrade notes are in the changelog.</p></blockquote>',
    { nonNullable: true },
  );

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
