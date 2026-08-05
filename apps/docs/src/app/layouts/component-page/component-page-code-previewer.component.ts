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
  template: `
    <div
      class="mt-9 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-2xl"
    >
      <div
        class="grid place-items-center max-[720px]:min-h-80"
        [class]="wide() ? 'min-h-[390px] p-4 max-[720px]:p-3' : 'min-h-[390px] p-11 max-[720px]:p-6'"
      >
        <ng-content select="[previewer]" />
      </div>

      <div class="border-t border-[var(--docs-border)]">
        <app-component-page-code-block
          [code]="code()"
          [language]="language()"
          (codeCopy)="codeCopy.emit($event)"
        />
      </div>
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');
  readonly wide = input(false);

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();
}
