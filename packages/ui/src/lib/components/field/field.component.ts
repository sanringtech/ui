import {
  Component,
  computed,
  contentChild,
  effect,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '../../utils';
import { SANRING_FIELD_CONTROL } from './field.type';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'fieldClass()',
  },
  template: `
    <!-- 這裡使用最單純的投影，保留最大的排版彈性 -->
    <ng-content></ng-content>
  `,
})
export class SanringFieldComponent {
  // 產生這組 Field 專屬的 ID 前綴
  readonly id = `sanring-field-${nextUniqueId++}`;

  // 抓取投影進來的 Input / Select / Switch
  readonly control = contentChild(SANRING_FIELD_CONTROL);

  // 用 Signal 來管理內部的狀態
  readonly hasError = signal(false);

  // 根據錯誤狀態動態調整外層 class（可依需求擴充）
  protected readonly fieldClass = computed(() =>
    cn(
      'group relative flex flex-col gap-2',
      this.hasError() && 'is-error', // 加上 is-error 標記，方便子元件寫 CSS
    ),
  );

  constructor() {
    // 隨 control() 變動重新綁定：投影的 control 換掉時，訂閱也會跟著換掉
    effect((onCleanup) => {
      const ctrl = this.control();
      if (!ctrl) return;

      this.updateErrorState();

      const subscription = ctrl.stateChanges.subscribe(() => this.updateErrorState());
      onCleanup(() => subscription.unsubscribe());
    });
  }

  private updateErrorState() {
    const ctrl = this.control();
    if (ctrl) {
      this.hasError.set(ctrl.errorState);
    }
  }

  // 提供給內部 Label 取得對應的 Input ID
  get inputId(): string {
    return this.control()?.id || `${this.id}-input`;
  }
}
