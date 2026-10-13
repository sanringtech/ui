import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import type { AnyExtension, Editor } from '@tiptap/core';
import { cn, uniqueId } from '../../utils';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { SkeletonDirective } from '../skeleton/skeleton.directive';
import { RichTextEditorContext, SANRING_RICH_TEXT_EDITOR } from './rich-text-editor.context';

@Component({
  selector: 'sanring-rich-text-editor',
  standalone: true,
  imports: [SkeletonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: RichTextEditorComponent) =>
        new SanringFieldControlAdapter(FieldType.richTextEditor, host),
      deps: [forwardRef(() => RichTextEditorComponent)],
    },
    {
      provide: SANRING_RICH_TEXT_EDITOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
    },
  ],
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-busy]': 'ready() ? null : "true"',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-invalid]': 'errorState || null',
  },
  template: `
    <ng-content select="sanring-rich-text-editor-toolbar" />
    <div #content class="contents"></div>
    @if (!ready()) {
      <div class="grid gap-2 px-3 py-3">
        <div sanringSkeleton class="h-4 w-3/4"></div>
        <div sanringSkeleton class="h-4 w-1/2"></div>
      </div>
    }
    <ng-content />
  `,
})
export class RichTextEditorComponent extends SanringCvaBase<string> implements RichTextEditorContext {
  readonly class = input<string | undefined>();
  readonly contentClass = input<string | undefined>();
  readonly id = input(uniqueId('sanring-rich-text-editor'));
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  // Read once when the editor is created; later changes are ignored.
  readonly extensions = input<readonly AnyExtension[]>([]);

  readonly editorReady = output<Editor>();

  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly editorInstance = signal<Editor | null>(null);
  private readonly transactions = signal(0);
  private currentValue = '';
  private destroyed = false;

  readonly editor = this.editorInstance.asReadonly();
  readonly state = this.transactions.asReadonly();
  readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  readonly contentId = computed(() => this.id());
  protected readonly ready = computed(() => this.editorInstance() !== null);

  protected readonly computedAriaDescribedBy = this.makeComputedAriaDescribedBy(
    this.ariaDescribedBy,
  );

  protected readonly hostClass = computed(() =>
    cn(
      'flex w-full flex-col rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-sm text-[var(--sanring-foreground)]',
      'focus-within:ring-2 focus-within:ring-[var(--sanring-border-strong)]',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      this.errorState && 'border-[var(--sanring-error-50)] focus-within:ring-[var(--sanring-error-40)]',
      this.class(),
    ),
  );

  // ProseMirror owns the contenteditable element, so its attributes are pushed
  // through editorProps instead of a template binding.
  private readonly contentAttributes = computed(() => {
    const attributes: Record<string, string> = {
      id: this.id(),
      'aria-multiline': 'true',
      class: cn('min-h-[80px] px-3 py-2 outline-none', this.contentClass()),
    };
    const optional: Record<string, string | undefined> = {
      'aria-label': this.ariaLabel(),
      'aria-labelledby': this.ariaLabelledBy(),
      'aria-describedby': this.computedAriaDescribedBy(),
      'aria-invalid': this.errorState ? 'true' : undefined,
      'aria-required': this.fieldRequired ? 'true' : undefined,
      'aria-disabled': this.isDisabled() ? 'true' : undefined,
    };
    for (const [key, value] of Object.entries(optional)) {
      if (value) attributes[key] = value;
    }
    return attributes;
  });

  get fieldValue(): string {
    return this.currentValue;
  }

  get fieldEmpty(): boolean {
    return this.currentValue === '';
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  protected override hasInputRequired(): boolean {
    return this.required();
  }

  constructor() {
    super();

    afterNextRender(() => {
      void this.createEditor();
    });

    effect(() => {
      const editor = this.editorInstance();
      const attributes = this.contentAttributes();
      untracked(() => editor?.setOptions({ editorProps: { attributes } }));
    });

    effect(() => {
      const editor = this.editorInstance();
      const editable = !this.isDisabled();
      untracked(() => editor?.setEditable(editable, false));
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.editorInstance()?.destroy();
    });
  }

  override writeValue(value: string | null | undefined): void {
    const html = value ?? '';
    if (html === this.currentValue) return;

    this.currentValue = html;
    // Before the editor exists the value is only queued; createEditor() picks it up.
    this.editorInstance()?.commands.setContent(html, { emitUpdate: false });
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    const editor = this.editorInstance();
    if (editor) {
      editor.commands.focus();
    } else {
      this.content().nativeElement.focus(options);
    }
  }

  // Tiptap is loaded with dynamic import(): @tiptap/starter-kit and
  // @tiptap/extensions have no sideEffects flag, so a static import would pull
  // them into the initial bundle of every app that imports @sanring/ui, even
  // apps that never render this component (ADR-0003, spike A4).
  private async createEditor(): Promise<void> {
    const [{ Editor }, { default: StarterKit }] = await Promise.all([
      import('@tiptap/core'),
      import('@tiptap/starter-kit'),
    ]);
    if (this.destroyed) return;

    const editor = new Editor({
      element: this.content().nativeElement,
      // Link stays off until the link UI ships (PRD M2).
      extensions: [StarterKit.configure({ link: false }), ...this.extensions()],
      content: this.currentValue,
      editable: !this.isDisabled(),
      editorProps: { attributes: this.contentAttributes() },
      onTransaction: () => this.transactions.update((v) => v + 1),
      onUpdate: ({ editor: instance }) => this.handleUpdate(instance),
      onFocus: () => this.onFocus(),
      onBlur: () => this.onBlur(),
    });

    this.editorInstance.set(editor);
    this.editorReady.emit(editor);
  }

  private handleUpdate(editor: Editor): void {
    const value = editor.isEmpty ? '' : editor.getHTML();
    if (value === this.currentValue) return;

    this.currentValue = value;
    this.onChange(value);
    this.emitStateChanges();
  }
}
