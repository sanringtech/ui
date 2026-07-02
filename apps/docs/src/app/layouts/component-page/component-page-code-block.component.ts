import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { LucideClipboard } from '@lucide/angular';
import { ToastService } from '@sanring/ui';

import { I18nService } from '../../i18n/i18n.service';

export interface ComponentPageCodeCopyEvent {
  code: string;
  success: boolean;
  error?: unknown;
}

export type ComponentPageCodeLanguage =
  | 'angular-html'
  | 'angular-ts'
  | 'typescript'
  | 'html'
  | 'css'
  | 'bash';

interface CodeToken {
  text: string;
  color?: string;
}

interface CodeLine {
  number: number;
  tokens: CodeToken[];
}

interface ShikiToken {
  content: string;
  color?: string;
}

interface ShikiHighlighter {
  codeToTokensBase(
    code: string,
    options: { lang: ComponentPageCodeLanguage; theme: typeof codeTheme },
  ): ShikiToken[][];
}

const codeTheme = 'vitesse-dark';

@Component({
  selector: 'app-component-page-code-block',
  imports: [LucideClipboard],
  standalone: true,
  template: `
    <div class="relative bg-[var(--docs-code)]">
      <button
        type="button"
        class="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] text-[var(--docs-muted)] transition-colors hover:text-[var(--docs-fg)]"
        [attr.aria-label]="i18n.t('actions.copyCode')"
        (click)="copyCode()"
      >
        <svg class="size-4" lucideClipboard></svg>
      </button>

      <div
        class="overflow-auto px-6 py-7 pr-16 font-mono text-[15px] leading-7 text-[#d4d4d4]"
      >
        <code class="block min-w-max">
          @for (line of highlightedLines(); track line.number) {
            <span class="grid grid-cols-[3rem_minmax(0,1fr)]">
              <span class="select-none pr-5 text-right text-[var(--docs-muted)]">
                {{ line.number }}
              </span>
              <span class="min-w-0 whitespace-pre">
                @for (token of line.tokens; track $index) {
                  <span [style.color]="token.color">{{ token.text }}</span>
                }
                @if (!line.tokens.length) {
                  <span>&nbsp;</span>
                }
              </span>
            </span>
          }
        </code>
      </div>
    </div>
  `,
})
export class ComponentPageCodeBlock {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  protected readonly i18n = inject(I18nService);
  private readonly toast = inject(ToastService);
  protected readonly highlightedLines = signal<CodeLine[]>([]);

  private currentCode = '';
  private highlightVersion = 0;
  private static highlighterPromise: Promise<ShikiHighlighter> | null = null;

  constructor() {
    effect(() => {
      void this.highlightCode(this.normalizeCode(this.code()), this.language());
    });
  }

  protected async copyCode() {
    const code = this.currentCode;

    try {
      await navigator.clipboard.writeText(code);
      this.codeCopy.emit({ code, success: true });
      this.toast.show({ type: 'success', title: this.i18n.t('actions.copied'), duration: 2000, closable: false });
    } catch (error) {
      this.codeCopy.emit({ code, success: false, error });
      this.toast.show({ type: 'error', title: this.i18n.t('actions.copyFailed'), duration: 3000, closable: true });
    }
  }

  private async highlightCode(code: string, language: ComponentPageCodeLanguage) {
    const version = ++this.highlightVersion;
    this.currentCode = code;

    if (!code) {
      this.highlightedLines.set([]);
      return;
    }

    try {
      const highlighter = await this.getHighlighter();
      const lines = highlighter.codeToTokensBase(code, {
        lang: language,
        theme: codeTheme,
      });

      if (version !== this.highlightVersion) {
        return;
      }

      this.highlightedLines.set(
        lines.map((line, index) => ({
          number: index + 1,
          tokens: line.map((token) => ({
            text: token.content,
            color: token.color,
          })),
        })),
      );
    } catch {
      if (version !== this.highlightVersion) {
        return;
      }

      this.highlightedLines.set(this.plainTextLines(code));
    }
  }

  private normalizeCode(code: string) {
    return code.replace(/^\n/, '').replace(/\n\s*$/, '');
  }

  private getHighlighter() {
    ComponentPageCodeBlock.highlighterPromise ??= this.createHighlighter();

    return ComponentPageCodeBlock.highlighterPromise;
  }

  private async createHighlighter(): Promise<ShikiHighlighter> {
    const [
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      angularHtml,
      angularTs,
      typescript,
      html,
      css,
      bash,
      vitesseDark,
    ] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('shiki/langs/angular-html.mjs'),
      import('shiki/langs/angular-ts.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/themes/vitesse-dark.mjs'),
    ]);

    return createHighlighterCore({
      themes: [vitesseDark.default],
      langs: [
        angularHtml.default,
        angularTs.default,
        typescript.default,
        html.default,
        css.default,
        bash.default,
      ],
      engine: createJavaScriptRegexEngine(),
    });
  }

  private plainTextLines(code: string): CodeLine[] {
    return code.split('\n').map((line, index) => ({
      number: index + 1,
      tokens: line ? [{ text: line }] : [],
    }));
  }
}
