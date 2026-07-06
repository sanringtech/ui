import { Component, computed, contentChild, effect, signal } from '@angular/core';
import { cn, uniqueId } from '../../utils';
import { SANRING_FIELD_CONTROL } from './field.type';

@Component({
  selector: 'sanring-field',
  standalone: true,
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
  readonly id = uniqueId('sanring-field');

  // 抓取投影進來的 Input / Select / Switch
  readonly control = contentChild(SANRING_FIELD_CONTROL);

  // Description / ErrorMessage 會透過 registerDescribedBy 把自己的 id 掛進來
  private readonly describedByIds = signal<readonly string[]>([]);

  // control 上的 disabled/required/focused/empty/errorState 都是 plain getter，不是 signal，
  // 靠這個計數器把 stateChanges (Observable) 橋接進 signal graph，下面的 computed 才會正確重算
  private readonly stateVersion = signal(0);

  readonly hasError = computed(() => {
    this.stateVersion();
    return this.control()?.errorState ?? false;
  });

  readonly isDisabled = computed(() => {
    this.stateVersion();
    return this.control()?.disabled ?? false;
  });

  readonly isRequired = computed(() => {
    this.stateVersion();
    return this.control()?.required ?? false;
  });

  readonly isFocused = computed(() => {
    this.stateVersion();
    return this.control()?.focused ?? false;
  });

  readonly isEmpty = computed(() => {
    this.stateVersion();
    return this.control()?.empty ?? false;
  });

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

      this.stateVersion.update((v) => v + 1);

      const subscription = ctrl.stateChanges.subscribe(() => this.stateVersion.update((v) => v + 1));
      onCleanup(() => subscription.unsubscribe());
    });

    // 把收集到的 describedByIds 同步給 control，讓 input 產生正確的 aria-describedby
    effect(() => {
      this.control()?.setDescribedByIds?.([...this.describedByIds()]);
    });
  }

  // 提供給 Description / ErrorMessage 註冊/取消自己的 id
  registerDescribedBy(id: string) {
    this.describedByIds.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  unregisterDescribedBy(id: string) {
    this.describedByIds.update((ids) => ids.filter((existing) => existing !== id));
  }

  // 提供給內部 Label 取得對應的 Input ID
  get inputId(): string {
    return this.control()?.id || `${this.id}-input`;
  }
}
