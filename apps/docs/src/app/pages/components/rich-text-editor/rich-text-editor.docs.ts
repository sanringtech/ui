import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const richTextEditorPage = {
  componentId: 'rich-text-editor',
  titleKey: 'component.richTextEditor',
  descriptionKey: 'richTextEditor.description',
  registryDeps: ['cva-base', 'utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'richTextEditor.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'richTextEditor.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'richTextEditor.installation.description',
      level: 2,
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'richTextEditor.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'richTextEditor.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'richTextEditor.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'richTextEditor.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'id',
      type: 'string',
      defaultValue: 'auto',
      descriptionKey: 'richTextEditor.api.id.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'richTextEditor.api.class.description',
    },
    {
      property: 'contentClass',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'richTextEditor.api.contentClass.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'richTextEditor.api.disabled.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'richTextEditor.api.required.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaDescribedBy.description',
    },
    {
      property: 'extensions',
      type: 'AnyExtension[]',
      defaultValue: '[]',
      descriptionKey: 'richTextEditor.api.extensions.description',
    },
    {
      property: '(editorReady)',
      type: 'Editor',
      defaultValue: '-',
      descriptionKey: 'richTextEditor.api.editorReady.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Tab', descriptionKey: 'richTextEditor.keyboard.tab' },
    { keys: 'Mod+B / Mod+I / Mod+U', descriptionKey: 'richTextEditor.keyboard.marks' },
    { keys: 'Mod+Z / Mod+Shift+Z', descriptionKey: 'richTextEditor.keyboard.history' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const richTextEditorPageExamples = {
  basic: `<sanring-field>
  <label sanringLabel id="message-label">Message</label>
  <sanring-rich-text-editor ariaLabelledBy="message-label" [formControl]="message" />
  <sanring-error-message>Message is required.</sanring-error-message>
</sanring-field>`,
  usageImport: `import { RichTextEditorComponent } from './components/ui/rich-text-editor';`,
  usageMain: `<sanring-rich-text-editor ariaLabel="Notes" [formControl]="notes" />`,
} as const;
