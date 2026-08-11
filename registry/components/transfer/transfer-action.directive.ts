import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: '[sanringTransferAction]',
  standalone: true,
  host: {
    '[class]': 'actionClass()',
  },
})
export class TransferActionDirective {
  readonly class = input<string | undefined>();

  // items-center 而非 items-stretch：按鈕可能是純 icon（固定正方形）也可能是文字+icon
  // （依內容撐開寬度），用 stretch 會把純 icon 按鈕硬拉成跟文字按鈕一樣寬。
  protected readonly actionClass = computed(() =>
    cn('flex flex-col items-center justify-center gap-2 px-2', this.class()),
  );
}
