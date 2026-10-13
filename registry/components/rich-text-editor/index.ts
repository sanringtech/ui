export * from './rich-text-editor.component';
export * from './rich-text-editor.context';
export * from './rich-text-editor.commands';
export * from './rich-text-editor-toolbar.component';
export * from './rich-text-editor-buttons.directive';
export * from './rich-text-editor-heading-menu.component';
export * from './rich-text-editor-character-count.component';
export { RICH_TEXT_EDITOR_EXTERNAL_VALUE } from './rich-text-editor.extensions';

import { RichTextEditorComponent } from './rich-text-editor.component';
import {
  RichTextEditorActionDirective,
  RichTextEditorToggleDirective,
} from './rich-text-editor-buttons.directive';
import { RichTextEditorHeadingMenuComponent } from './rich-text-editor-heading-menu.component';
import { RichTextEditorCharacterCountComponent } from './rich-text-editor-character-count.component';
import { RichTextEditorToolbarComponent } from './rich-text-editor-toolbar.component';

export const SANRING_RICH_TEXT_EDITOR_IMPORTS = [
  RichTextEditorComponent,
  RichTextEditorToolbarComponent,
  RichTextEditorToggleDirective,
  RichTextEditorActionDirective,
  RichTextEditorHeadingMenuComponent,
  RichTextEditorCharacterCountComponent,
];
