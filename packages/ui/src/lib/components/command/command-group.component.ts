import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-command-group',
  standalone: true,
  template: `
    <!-- 標題區塊 -->
    @if (heading()) {
      <div class="px-2 py-1.5 text-xs font-medium text-[var(--sanring-muted)]">
        {{ heading() }}
      </div>
    }

    <!-- 內容區塊 (放 Item 的地方) -->
    <div role="group">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'groupClass()',
  },
})
export class CommandGroupComponent {
  // 接收外部傳入的群組標題 (例如 "設定"、"推薦")
  readonly heading = input<string>();
  readonly class = input<string | undefined>();

  protected readonly groupClass = computed(() =>
    cn('block overflow-hidden p-1 text-[var(--sanring-foreground)]', this.class()),
  );
}
