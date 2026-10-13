import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  numberAttribute,
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
import {
  RICH_TEXT_EDITOR_EXTERNAL_VALUE,
  loadBuiltInExtensions,
} from './rich-text-editor.extensions';

@Component({
  selector: 'sanring-rich-text-editor',
  standalone: true,
  imports: [SkeletonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The content styles target markup that ProseMirror renders, which Angular's
  // emulated encapsulation never sees; every rule is scoped to .sanring-rte-content.
  encapsulation: ViewEncapsulation.None,
  styles: `
    /* anywhere (not break-word) also shrinks min-content, so a long unbroken
       word cannot widen the editor inside a flex or grid layout. The extra
       class outranks the .ProseMirror rule that Tiptap injects at runtime. */
    .sanring-rte-content.ProseMirror { overflow-wrap: anywhere; }
    .sanring-rte-content > * + * { margin-top: 0.75em; }
    .sanring-rte-content h1 { font-size: 1.5em; font-weight: 600; line-height: 1.25; }
    .sanring-rte-content h2 { font-size: 1.25em; font-weight: 600; line-height: 1.3; }
    .sanring-rte-content h3 { font-size: 1.125em; font-weight: 600; line-height: 1.4; }
    .sanring-rte-content :is(h4, h5, h6) { font-weight: 600; }
    .sanring-rte-content :is(ul, ol) { padding-left: 1.5em; }
    .sanring-rte-content ul { list-style: disc; }
    .sanring-rte-content ol { list-style: decimal; }
    .sanring-rte-content li > p { margin: 0; }
    .sanring-rte-content blockquote {
      border-left: 3px solid var(--sanring-border-strong);
      padding-left: 1em;
      color: var(--sanring-muted);
    }
    .sanring-rte-content code {
      border-radius: var(--sanring-radius-xs);
      background: var(--sanring-surface-strong);
      padding: 0.1em 0.3em;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.875em;
    }
    .sanring-rte-content pre {
      overflow-x: auto;
      border-radius: var(--sanring-radius-sm);
      background: var(--sanring-surface-strong);
      padding: 0.75em 1em;
    }
    .sanring-rte-content pre code { background: none; padding: 0; }
    .sanring-rte-content hr { border: 0; border-top: 1px solid var(--sanring-border); }
    .sanring-rte-content p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
      color: var(--sanring-muted);
    }
  `,
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
    '[attr.data-readonly]': 'isReadonly() || null',
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
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string | undefined>();
  readonly maxCharacters = input<number | undefined, unknown>(undefined, {
    transform: (value: unknown) => (value == null || value === '' ? undefined : numberAttribute(value)),
  });
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
  readonly isReadonly = computed(() => this.readonly());
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
      class: cn('sanring-rte-content min-h-[80px] px-3 py-2 outline-none', this.contentClass()),
    };
    const optional: Record<string, string | undefined> = {
      'aria-label': this.ariaLabel(),
      'aria-labelledby': this.ariaLabelledBy(),
      'aria-describedby': this.computedAriaDescribedBy(),
      'aria-invalid': this.errorState ? 'true' : undefined,
      'aria-required': this.fieldRequired ? 'true' : undefined,
      'aria-disabled': this.isDisabled() ? 'true' : undefined,
      'aria-readonly': this.isReadonly() ? 'true' : undefined,
      'aria-placeholder': this.placeholder() || undefined,
      // A non-editable ProseMirror view drops out of the tab order; keep a
      // read-only one reachable so keyboard users can select and copy.
      tabindex: this.isReadonly() && !this.isDisabled() ? '0' : undefined,
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
      const editable = !this.isDisabled() && !this.isReadonly();
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
    this.editorInstance()
      ?.chain()
      .setMeta(RICH_TEXT_EDITOR_EXTERNAL_VALUE, true)
      .setContent(html, { emitUpdate: false })
      .run();
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
    const [{ Editor }, builtIn] = await Promise.all([
      import('@tiptap/core'),
      loadBuiltInExtensions({
        placeholder: () => this.placeholder(),
        maxCharacters: () => this.maxCharacters(),
      }),
    ]);
    if (this.destroyed) return;

    const editor = new Editor({
      element: this.content().nativeElement,
      extensions: [...builtIn, ...this.extensions()],
      content: this.currentValue,
      editable: !this.isDisabled() && !this.isReadonly(),
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
