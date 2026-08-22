import {
  ComponentPageApiRow,
  ComponentPageDefinition,
  ComponentPageKeyboardRow,
} from '../../../docs-schema/component-page.types';

export const sheetPage = {
  componentId: 'sheet',
  titleKey: 'component.sheet',
  descriptionKey: 'sheet.description',
  registryDeps: ['utils', 'component-styles', 'component-timing'],
  ssrSafe: false,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'sheet.examples.basic.description',
      level: 2,
    },
    { id: 'usage', titleKey: 'toc.usage', descriptionKey: 'sheet.usage.description', level: 2 },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'sheet.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'sheet.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-side', titleKey: 'sheet.demo.side', level: 3 },
        { id: 'example-with-form', titleKey: 'sheet.demo.withForm', level: 3 },
        { id: 'example-custom-close', titleKey: 'sheet.demo.customClose', level: 3 },
      ],
    },
    { id: 'api', titleKey: 'toc.apiReference', descriptionKey: 'sheet.api.description', level: 2 },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'sheet.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'sheet.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'sheet.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'isOpen',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'sheet.api.isOpen.description',
    },
    {
      property: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      defaultValue: "'right'",
      descriptionKey: 'sheet.api.side.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'sheet.api.class.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: "'Sheet'",
      descriptionKey: 'sheet.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'sheet.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'sheet.api.ariaDescribedBy.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Tab / Shift + Tab', descriptionKey: 'sheet.keyboard.tabShiftTab' },
    { keys: 'Escape', descriptionKey: 'sheet.keyboard.escape' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const sheetPageExamples = {
  basic: `<sanring-sheet>
  <button sanringBtn sanringSheetTrigger>Open Sheet</button>

  <sanring-sheet-content>
    <sanring-sheet-header>
      <sanring-sheet-title>Sheet title</sanring-sheet-title>
      <sanring-sheet-description>Sheet description goes here.</sanring-sheet-description>
    </sanring-sheet-header>
    <p class="px-6 text-sm">Sheet body content.</p>
    <sanring-sheet-footer>
      <button sanringBtn variant="outline" sanringSheetClose>Cancel</button>
      <button sanringBtn sanringSheetClose>Save</button>
    </sanring-sheet-footer>
  </sanring-sheet-content>
</sanring-sheet>`,

  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective } from './components/ui/button';
import { SANRING_SHEET_IMPORTS } from './components/ui/sheet';

@Component({
  imports: [ButtonDirective, SANRING_SHEET_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-sheet>
  <button sanringBtn sanringSheetTrigger>Open</button>

  <sanring-sheet-content side="right">
    <sanring-sheet-header>
      <sanring-sheet-title>Title</sanring-sheet-title>
    </sanring-sheet-header>
    <div class="px-6">Content</div>
    <sanring-sheet-footer>
      <button sanringBtn sanringSheetClose>Close</button>
    </sanring-sheet-footer>
  </sanring-sheet-content>
</sanring-sheet>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { ButtonDirective } from './components/ui/button';
import { SheetCloseDirective, SheetComponent, SheetContentComponent, SheetDescriptionComponent, SheetFooterComponent, SheetHeaderComponent, SheetTitleComponent, SheetTriggerDirective } from './components/ui/sheet';

@Component({
  imports: [
    ButtonDirective,
    SheetComponent,
    SheetTriggerDirective,
    SheetContentComponent,
    SheetHeaderComponent,
    SheetTitleComponent,
    SheetDescriptionComponent,
    SheetFooterComponent,
    SheetCloseDirective,
  ],
})
export class ExampleComponent {}`,

  composition: `sanring-sheet
├── [sanringSheetTrigger]
├── sanring-sheet-content
│   ├── sanring-sheet-header
│   │   ├── sanring-sheet-title
│   │   └── sanring-sheet-description
│   └── sanring-sheet-footer
└── [sanringSheetClose]`,

  side: `<!-- Change [side] to move the sheet; the close pattern is the same for all four. -->
<sanring-sheet>
  <button sanringBtn sanringSheetTrigger>Top</button>

  <sanring-sheet-content side="top">
    <!-- X close: use sanringSheetClose on any element -->
    <button type="button" sanringSheetClose aria-label="Close"
      class="absolute right-4 top-4 ...">
      <svg lucideX class="size-4"></svg>
    </button>

    <sanring-sheet-header class="pr-10">
      <sanring-sheet-title>Top Sheet</sanring-sheet-title>
      <sanring-sheet-description>Slides in from the top edge.</sanring-sheet-description>
    </sanring-sheet-header>

    <sanring-sheet-footer>
      <button sanringBtn variant="outline" sanringSheetClose>Close</button>
    </sanring-sheet-footer>
  </sanring-sheet-content>
</sanring-sheet>`,

  withForm: `<sanring-sheet>
  <button sanringBtn sanringSheetTrigger>Edit profile</button>

  <sanring-sheet-content side="right">
    <sanring-sheet-header>
      <sanring-sheet-title>Edit profile</sanring-sheet-title>
      <sanring-sheet-description>
        Make changes to your profile here. Click save when done.
      </sanring-sheet-description>
    </sanring-sheet-header>

    <form class="grid gap-4 px-6">
      <div class="grid gap-1.5">
        <label sanringLabel for="name">Name</label>
        <input sanringInput id="name" placeholder="Pedro Duarte" />
      </div>
      <div class="grid gap-1.5">
        <label sanringLabel for="username">Username</label>
        <input sanringInput id="username" placeholder="@peduarte" />
      </div>
    </form>

    <sanring-sheet-footer>
      <button sanringBtn variant="outline" sanringSheetClose>Cancel</button>
      <button sanringBtn sanringSheetClose>Save changes</button>
    </sanring-sheet-footer>
  </sanring-sheet-content>
</sanring-sheet>`,
  customClose: `<!-- The sheet does not render a built-in close button.
     Place sanringSheetClose on any button you want to use as a close control. -->
<sanring-sheet>
  <button sanringBtn sanringSheetTrigger>Open</button>

  <sanring-sheet-content>
    <button type="button" sanringSheetClose aria-label="Close"
      class="absolute right-4 top-4 ...">
      <svg lucideX class="size-4"></svg>
    </button>

    <sanring-sheet-header>
      <sanring-sheet-title>Confirm deletion</sanring-sheet-title>
      <sanring-sheet-description>
        This action cannot be undone.
      </sanring-sheet-description>
    </sanring-sheet-header>
    <sanring-sheet-footer>
      <button sanringBtn variant="outline" sanringSheetClose>Cancel</button>
      <button sanringBtn variant="destructive" sanringSheetClose>Delete</button>
    </sanring-sheet-footer>
  </sanring-sheet-content>
</sanring-sheet>`,
} as const;
