import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SANRING_RICH_TEXT_EDITOR } from './rich-text-editor.context';

// Shows "n" or "n/limit". Content written through the form control is never
// trimmed (PRD §12), so the count can go past the limit; it then turns to the
// error color. Screen readers hear the count through aria-live="polite".
@Component({
  selector: 'sanring-rich-text-editor-character-count',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-live': 'polite',
    '[class]': 'countClass()',
    '[attr.data-over-limit]': 'overLimit() || null',
  },
  template: `{{ text() }}`,
})
export class RichTextEditorCharacterCountComponent {
  readonly class = input<string | undefined>();

  private readonly context = inject(SANRING_RICH_TEXT_EDITOR);

  readonly characters = computed(() => {
    this.context.state();
    return this.context.editor()?.storage.characterCount.characters() ?? 0;
  });

  readonly overLimit = computed(() => {
    const limit = this.context.maxCharacters();
    return limit !== undefined && this.characters() > limit;
  });

  protected readonly text = computed(() => {
    const limit = this.context.maxCharacters();
    return limit === undefined ? `${this.characters()}` : `${this.characters()}/${limit}`;
  });

  protected readonly countClass = computed(() =>
    cn(
      'self-end px-3 pb-2 text-xs tabular-nums text-[var(--sanring-muted)]',
      this.overLimit() && 'text-[var(--sanring-error-50)]',
      this.class(),
    ),
  );
}
