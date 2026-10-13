import { InjectionToken, Signal } from '@angular/core';
import type { Editor } from '@tiptap/core';

// Child parts (toolbar, buttons, character count) read the editor through this
// context instead of holding their own Editor reference, so only the root
// component ever creates or destroys one.
export interface RichTextEditorContext {
  /** The Tiptap editor, or null until it has loaded in the browser. */
  readonly editor: Signal<Editor | null>;
  /** Bumped on every editor transaction; read it inside computed() to re-derive editor state. */
  readonly state: Signal<number>;
  /** Disabled through the input or the bound form control. */
  readonly isDisabled: Signal<boolean>;
  /** id of the contenteditable element, for aria-controls. */
  readonly contentId: Signal<string>;
}

export const SANRING_RICH_TEXT_EDITOR = new InjectionToken<RichTextEditorContext>(
  'SanringRichTextEditor',
);
