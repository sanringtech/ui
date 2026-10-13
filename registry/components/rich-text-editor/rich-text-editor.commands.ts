import type { ChainedCommands, Editor } from '@tiptap/core';

export type RichTextEditorToggleCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock';

export type RichTextEditorActionCommand =
  | 'undo'
  | 'redo'
  | 'horizontalRule'
  | 'hardBreak'
  | 'clearFormatting';

export type RichTextEditorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type Chain = (chain: ChainedCommands) => ChainedCommands;

interface CommandSpec {
  run: Chain;
  /** Name passed to editor.isActive(); omitted for commands that have no pressed state. */
  active?: string;
}

const TOGGLES: Record<RichTextEditorToggleCommand, CommandSpec> = {
  bold: { run: (c) => c.toggleBold(), active: 'bold' },
  italic: { run: (c) => c.toggleItalic(), active: 'italic' },
  underline: { run: (c) => c.toggleUnderline(), active: 'underline' },
  strike: { run: (c) => c.toggleStrike(), active: 'strike' },
  code: { run: (c) => c.toggleCode(), active: 'code' },
  bulletList: { run: (c) => c.toggleBulletList(), active: 'bulletList' },
  orderedList: { run: (c) => c.toggleOrderedList(), active: 'orderedList' },
  blockquote: { run: (c) => c.toggleBlockquote(), active: 'blockquote' },
  codeBlock: { run: (c) => c.toggleCodeBlock(), active: 'codeBlock' },
};

const ACTIONS: Record<RichTextEditorActionCommand, CommandSpec> = {
  undo: { run: (c) => c.undo() },
  redo: { run: (c) => c.redo() },
  horizontalRule: { run: (c) => c.setHorizontalRule() },
  hardBreak: { run: (c) => c.setHardBreak() },
  clearFormatting: { run: (c) => c.unsetAllMarks().clearNodes() },
};

function specFor(command: RichTextEditorToggleCommand | RichTextEditorActionCommand): CommandSpec {
  return command in TOGGLES
    ? TOGGLES[command as RichTextEditorToggleCommand]
    : ACTIONS[command as RichTextEditorActionCommand];
}

export function runCommand(
  editor: Editor,
  command: RichTextEditorToggleCommand | RichTextEditorActionCommand,
): boolean {
  return specFor(command).run(editor.chain().focus()).run();
}

export function canRunCommand(
  editor: Editor,
  command: RichTextEditorToggleCommand | RichTextEditorActionCommand,
): boolean {
  return editor.isEditable && specFor(command).run(editor.can().chain()).run();
}

export function isCommandActive(editor: Editor, command: RichTextEditorToggleCommand): boolean {
  return editor.isActive(TOGGLES[command].active!);
}

/** 0 means a paragraph; null means neither (for example inside a code block). */
export function activeTextStyle(editor: Editor): RichTextEditorHeadingLevel | 0 | null {
  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    if (editor.isActive('heading', { level })) return level;
  }
  return editor.isActive('paragraph') ? 0 : null;
}

export function setTextStyle(editor: Editor, level: RichTextEditorHeadingLevel | 0): boolean {
  const chain = editor.chain().focus();
  return (level === 0 ? chain.setParagraph() : chain.setHeading({ level })).run();
}
