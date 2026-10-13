import type { AnyExtension } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';

/**
 * Transaction meta set on writes that come from the form control. The
 * character limit lets them through, so an over-limit value is shown in full
 * instead of being dropped (PRD §12, autoTrim: false).
 */
export const RICH_TEXT_EDITOR_EXTERNAL_VALUE = 'sanringExternalValue';

export interface RichTextEditorBuiltInOptions {
  /** Read on every render, so the placeholder can change after creation. */
  readonly placeholder: () => string | undefined;
  /** Read on every transaction, so the limit can change after creation. */
  readonly maxCharacters: () => number | undefined;
}

// All Tiptap values are loaded with dynamic import() (ADR-0003): a static
// import would pull @tiptap/starter-kit and @tiptap/extensions into the initial
// bundle of every app that imports @sanring/ui.
export async function loadBuiltInExtensions(
  options: RichTextEditorBuiltInOptions,
): Promise<AnyExtension[]> {
  const [{ Extension }, { default: StarterKit }, { CharacterCount, Placeholder }, { Plugin, PluginKey }] =
    await Promise.all([
      import('@tiptap/core'),
      import('@tiptap/starter-kit'),
      import('@tiptap/extensions'),
      import('@tiptap/pm/state'),
    ]);

  // CharacterCount only counts here. Its own `limit` also rejects form writes
  // over the limit (filterTransaction has no way to tell them apart), so the
  // limit is enforced by the plugin below instead.
  const characterLimit = Extension.create({
    name: 'sanringCharacterLimit',
    addProseMirrorPlugins() {
      const editor = this.editor;
      const count = (doc: EditorState['doc']): number =>
        editor.storage.characterCount.characters({ node: doc });

      return [
        new Plugin({
          key: new PluginKey('sanringCharacterLimit'),
          filterTransaction: (tr: Transaction, state: EditorState) => {
            const limit = options.maxCharacters();
            if (!limit || !tr.docChanged || tr.getMeta(RICH_TEXT_EDITOR_EXTERNAL_VALUE)) return true;

            const oldSize = count(state.doc);
            const newSize = count(tr.doc);
            // Within the limit, or shrinking an over-limit document: allowed.
            if (newSize <= limit || newSize <= oldSize) return true;
            if (!tr.getMeta('paste') || oldSize >= limit) return false;

            // Pasted text is cut back from the cursor to fit, as CharacterCount does.
            const pos = tr.selection.$head.pos;
            tr.deleteRange(pos - (newSize - limit), pos);
            return count(tr.doc) <= limit;
          },
        }),
      ];
    },
  });

  return [
    // Link stays off until the link UI ships (PRD M2).
    StarterKit.configure({ link: false }),
    Placeholder.configure({ placeholder: () => options.placeholder() ?? '' }),
    CharacterCount,
    characterLimit,
  ];
}
