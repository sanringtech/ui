import { Component, EventEmitter, input, Output } from '@angular/core';
import {
  ComponentPageCodeBlock,
  ComponentPageCodeCopyEvent,
  ComponentPageCodeLanguage,
} from './component-page-code-block.component';

@Component({
  selector: 'app-component-page-code-previewer',
  imports: [ComponentPageCodeBlock],
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <div class="mt-9 grid gap-4">
      <div
        class="grid place-items-center overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_92%,transparent)] shadow-[var(--docs-shadow-strong)] [background:linear-gradient(180deg,color-mix(in_srgb,var(--docs-elevated)_62%,transparent),color-mix(in_srgb,var(--docs-panel)_76%,transparent)),linear-gradient(var(--docs-bg-grid)_1px,transparent_1px),linear-gradient(90deg,var(--docs-bg-grid)_1px,transparent_1px)] [background-size:auto,30px_30px,30px_30px] max-[720px]:min-h-80"
        [class]="wide() ? 'min-h-[390px] p-4 max-[720px]:p-3' : 'min-h-[390px] p-11 max-[720px]:p-6'"
      >
        <ng-content select="[previewer]" />
      </div>

      <app-component-page-code-block
        [code]="code()"
        [language]="language()"
        (codeCopy)="codeCopy.emit($event)"
      />
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');
  readonly wide = input(false);

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();
}
