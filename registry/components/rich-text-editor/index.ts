export * from './rich-text-editor.component';
export * from './rich-text-editor.context';
export * from './rich-text-editor.commands';
export * from './rich-text-editor-toolbar.component';
export * from './rich-text-editor-buttons.directive';
export * from './rich-text-editor-heading-menu.component';

import { RichTextEditorComponent } from './rich-text-editor.component';
import {
  RichTextEditorActionDirective,
  RichTextEditorToggleDirective,
} from './rich-text-editor-buttons.directive';
import { RichTextEditorHeadingMenuComponent } from './rich-text-editor-heading-menu.component';
import { RichTextEditorToolbarComponent } from './rich-text-editor-toolbar.component';

export const SANRING_RICH_TEXT_EDITOR_IMPORTS = [
  RichTextEditorComponent,
  RichTextEditorToolbarComponent,
  RichTextEditorToggleDirective,
  RichTextEditorActionDirective,
  RichTextEditorHeadingMenuComponent,
];
