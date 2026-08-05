import { Component, ElementRef, inject, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideChevronDown,
  LucideChevronUp,
  LucideCopy,
} from '@lucide/angular';
import { ButtonDirective, SANRING_DROPDOWN_MENU_IMPORTS, ToastService } from '@sanring/ui';
import {
  DocsComponentId,
  DocsComponentNavItem,
  getAdjacentDocsComponent,
} from '../../navigation/docs-navigation';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';

@Component({
  selector: 'app-component-page-header',
  imports: [
    ButtonDirective,
    LucideArrowLeft,
    LucideArrowRight,
    LucideChevronDown,
    LucideChevronUp,
    LucideCopy,
    SANRING_DROPDOWN_MENU_IMPORTS,
  ],
  template: `
    <header
      class="mb-10 flex items-start justify-between gap-6 border-b border-[var(--docs-border)] pb-7 max-[720px]:block"
    >
      <div class="min-w-0">
        <h1
          class="m-0 text-[30px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ title }}
        </h1>
        <p class="mb-0 mt-2 max-w-[560px] text-base leading-relaxed text-[var(--docs-muted)]">
          {{ description }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2 max-[720px]:mt-6">
        <sanring-dropdown-menu>
          <div class="flex items-center">
            <button
              sanringBtn
              type="button"
              variant="secondary"
              size="sm"
              class="rounded-r-none border-r-0"
              (click)="copyPage()"
            >
              <svg class="size-4" lucideCopy></svg>
              <span>{{ i18n.t('actions.copyPage') }}</span>
            </button>
            <button
              sanringBtn
              type="button"
              variant="secondary"
              size="sm"
              class="rounded-l-none px-2"
              sanringDropdownMenuTrigger
              [menu]="copyPageMenu.menu"
              [attr.aria-label]="i18n.t('actions.copyPageOptions')"
            >
              @if (copyPageMenu.menu.visible()) {
                <svg class="size-4" lucideChevronUp></svg>
              } @else {
                <svg class="size-4" lucideChevronDown></svg>
              }
            </button>
          </div>

          <sanring-dropdown-menu-content #copyPageMenu="sanringDropdownMenuContent" class="w-48">
            <button
              type="button"
              sanringDropdownMenuItem
              value="view-markdown"
              (click)="openMarkdownTab()"
            >
              {{ i18n.t('actions.viewAsMarkdown') }}
            </button>
          </sanring-dropdown-menu-content>
        </sanring-dropdown-menu>

        <button
          sanringBtn
          type="button"
          variant="secondary"
          size="icon"
          [attr.aria-label]="i18n.t('actions.previousPage')"
          [disabled]="!previousComponent"
          (click)="goToComponent(previousComponent)"
        >
          <svg class="size-4" lucideArrowLeft></svg>
        </button>

        <button
          sanringBtn
          type="button"
          variant="secondary"
          size="icon"
          [attr.aria-label]="i18n.t('actions.nextPage')"
          [disabled]="!nextComponent"
          (click)="goToComponent(nextComponent)"
        >
          <svg class="size-4" lucideArrowRight></svg>
        </button>
      </div>
    </header>
  `,
})
export class ComponentPageHeaderComponent implements OnChanges {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input() componentId: DocsComponentId | null = null;

  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges() {
    if (this.title && this.description) {
      this.seo.setPage({ title: this.title, description: this.description });
    }
  }

  protected get previousComponent() {
    return this.componentId ? getAdjacentDocsComponent(this.componentId).previous : null;
  }

  protected get nextComponent() {
    return this.componentId ? getAdjacentDocsComponent(this.componentId).next : null;
  }

  protected goToComponent(component: DocsComponentNavItem | null) {
    if (!component) {
      return;
    }

    void this.router.navigateByUrl(component.path);
  }

  protected async copyPage() {
    const markdown = this.buildPageMarkdown();

    try {
      await navigator.clipboard.writeText(markdown);
      this.toast.show({
        type: 'success',
        title: this.i18n.t('actions.copied'),
        duration: 2000,
        closable: false,
      });
    } catch {
      this.toast.show({
        type: 'error',
        title: this.i18n.t('actions.copyFailed'),
        duration: 3000,
        closable: true,
      });
    }
  }

  protected openMarkdownTab() {
    const markdown = this.buildPageMarkdown();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${this.escapeHtml(this.title)} Markdown</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; background: #0f1418; color: #e5e7eb; }
    pre { box-sizing: border-box; min-height: 100vh; margin: 0; padding: 32px; white-space: pre-wrap; word-break: break-word; font: 14px/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
  </style>
</head>
<body><pre>${this.escapeHtml(markdown)}</pre></body>
</html>`;

    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const tab = window.open(url, '_blank', 'noopener,noreferrer');

    if (!tab) {
      URL.revokeObjectURL(url);
      this.toast.show({
        type: 'error',
        title: this.i18n.t('actions.openFailed'),
        duration: 3000,
        closable: true,
      });
      return;
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  private buildPageMarkdown() {
    const lines = [`# ${this.title}`, '', this.description, ''];
    const path = this.componentId ? `/components/${this.componentId}` : this.router.url;
    lines.push(`Source: ${new URL(path, window.location.origin).toString()}`, '');

    const article = this.elementRef.nativeElement.closest('article');
    const sectionMarkdown = article
      ? Array.from(article.children)
          .filter((child) => child.tagName.toLowerCase() === 'app-component-page-section')
          .map((section) => this.elementToMarkdown(section as HTMLElement))
          .filter(Boolean)
      : [];

    lines.push(...sectionMarkdown);
    return this.normalizeMarkdown(lines.join('\n'));
  }

  private elementToMarkdown(element: Element): string {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'app-component-page-code-previewer') {
      const codeBlock = element.querySelector('app-component-page-code-block code');
      return codeBlock ? this.codeElementToMarkdown(codeBlock) : '';
    }

    if (tagName === 'app-component-page-code-block') {
      const code = element.querySelector('code');
      return code ? this.codeElementToMarkdown(code) : '';
    }

    if (tagName === 'pre' || tagName === 'code') {
      return `\`\`\`\n${this.cleanText(element.textContent ?? '')}\n\`\`\``;
    }

    if (/^h[1-6]$/.test(tagName)) {
      const level = Number(tagName.slice(1));
      return `${'#'.repeat(level)} ${this.cleanText(element.textContent ?? '')}`;
    }

    if (tagName === 'p') {
      return this.cleanText(element.textContent ?? '');
    }

    if (tagName === 'li') {
      return `- ${this.cleanText(element.textContent ?? '')}`;
    }

    if (tagName === 'table') {
      return this.tableToMarkdown(element as HTMLTableElement);
    }

    return Array.from(element.children)
      .map((child) => this.elementToMarkdown(child))
      .filter(Boolean)
      .join('\n\n');
  }

  private codeElementToMarkdown(code: Element) {
    const renderedLines = Array.from(code.children);
    const codeText =
      renderedLines.length > 0
        ? renderedLines
            .map((line) =>
              this.cleanText(line.children.item(1)?.textContent ?? line.textContent ?? ''),
            )
            .join('\n')
        : this.cleanText(code.textContent ?? '');

    return `\`\`\`\n${codeText}\n\`\`\``;
  }

  private tableToMarkdown(table: HTMLTableElement) {
    const rows = Array.from(table.rows).map((row) =>
      Array.from(row.cells).map((cell) => this.cleanText(cell.textContent ?? '')),
    );

    if (rows.length === 0) return '';

    const [head, ...body] = rows;
    return [
      `| ${head.join(' | ')} |`,
      `| ${head.map(() => '---').join(' | ')} |`,
      ...body.map((row) => `| ${row.join(' | ')} |`),
    ].join('\n');
  }

  private cleanText(value: string) {
    return value.replace(/\s+/g, ' ').trim();
  }

  private normalizeMarkdown(value: string) {
    return value
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .concat('\n');
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
