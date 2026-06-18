import {
  AfterContentChecked,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { LucideClipboard } from '@lucide/angular';

import { I18nService } from '../i18n/i18n.service';

export interface ComponentPageCodeCopyEvent {
  code: string;
  success: boolean;
  error?: unknown;
}

interface CodeToken {
  text: string;
  className: string;
}

interface CodeLine {
  number: number;
  tokens: CodeToken[];
}

@Component({
  selector: 'app-component-page-code-block',
  imports: [LucideClipboard],
  standalone: true,
  template: `
    <div class="relative bg-[var(--docs-code)]">
      <button
        type="button"
        class="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-md border border-[var(--docs-border)] bg-[var(--docs-elevated)] text-[var(--docs-muted)] transition-colors hover:text-[var(--docs-fg)]"
        [attr.aria-label]="i18n.t('actions.copyCode')"
        (click)="copyCode()"
      >
        <svg class="size-4" lucideClipboard></svg>
      </button>

      <div #projectedCode class="hidden">
        <ng-content select="[code]" />
      </div>

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
                  <span [class]="token.className">{{ token.text }}</span>
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
export class ComponentPageCodeBlock implements AfterContentChecked {
  @Input() code: string | null = null;
  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  @ViewChild('projectedCode', { static: true })
  private projectedCode?: ElementRef<HTMLElement>;

  protected readonly i18n = inject(I18nService);
  protected readonly highlightedLines = signal<CodeLine[]>([]);

  private currentCode = '';

  ngAfterContentChecked() {
    this.syncCode();
  }

  protected async copyCode() {
    const code = this.currentCode;

    try {
      await navigator.clipboard.writeText(code);
      this.codeCopy.emit({ code, success: true });
    } catch (error) {
      this.codeCopy.emit({ code, success: false, error });
    }
  }

  private syncCode() {
    const projectedText = this.projectedCode?.nativeElement.textContent ?? '';
    const nextCode = this.normalizeCode(this.code ?? projectedText);

    if (nextCode === this.currentCode) {
      return;
    }

    this.currentCode = nextCode;
    this.highlightedLines.set(
      nextCode.split('\n').map((line, index) => ({
        number: index + 1,
        tokens: this.tokenizeLine(line),
      })),
    );
  }

  private normalizeCode(code: string) {
    return code.replace(/^\n/, '').replace(/\n\s*$/, '');
  }

  private tokenizeLine(line: string): CodeToken[] {
    const tokens: CodeToken[] = [];
    let remaining = line;

    while (remaining.length) {
      const token = this.nextToken(remaining);
      tokens.push(token);
      remaining = remaining.slice(token.text.length);
    }

    return tokens;
  }

  private nextToken(input: string): CodeToken {
    const matchers: Array<[RegExp, string]> = [
      [/^\/\/.*/, 'text-[#7a8699]'],
      [/^(['"`])(?:\\.|(?!\1)[\s\S])*\1/, 'text-[#7dd3fc]'],
      [/^<\/?[A-Za-z][\w-]*/, 'text-[#60a5fa]'],
      [/^[A-Za-z_:@[\]()][\w:.@[\]()-]*(?==)/, 'text-[#a78bfa]'],
      [
        /^(?:import|from|export|function|return|const|let|class|interface|type|protected|readonly|private|public|as|true|false|null|undefined)\b/,
        'text-[#fb7185]',
      ],
      [/^\b\d+\b/, 'text-[#facc15]'],
      [/^[{}()[\];,]/, 'text-[#d4d4d4]'],
      [/^[=]/, 'text-[#fb7185]'],
      [/^\s+/, 'text-[#d4d4d4]'],
      [/^[^\s{}()[\];,='"`<]+/, 'text-[#d4d4d4]'],
    ];

    for (const [pattern, className] of matchers) {
      const match = input.match(pattern);

      if (match?.[0]) {
        return { text: match[0], className };
      }
    }

    return { text: input[0], className: 'text-[#d4d4d4]' };
  }
}
