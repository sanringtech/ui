import { Component, input } from '@angular/core';
import { ComponentPageCodeBlock, ComponentPageCodeLanguage } from '../../layouts/component-page';

@Component({
  selector: 'app-theming-code-panel',
  standalone: true,
  imports: [ComponentPageCodeBlock],
  template: `
    <div
      class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
    >
      <div
        class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5"
      >
        <span class="text-xs font-medium text-[var(--docs-muted)]">{{ label() }}</span>
      </div>
      <app-component-page-code-block [code]="code()" [language]="language()" />
    </div>
  `,
})
export class ThemingCodePanelComponent {
  readonly label = input.required<string>();
  readonly code = input.required<string>();
  readonly language = input<ComponentPageCodeLanguage>('css');
}
