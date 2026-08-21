import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-hover-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: { style: 'display: contents' },
})
export class HoverCardComponent implements OnDestroy {
  readonly contentId = inject(_IdGenerator).getId('sanring-hover-card-', true);
  readonly openDelay = input(700, { transform: numberAttribute });
  readonly closeDelay = input(300, { transform: numberAttribute });

  // 唯一真相來源：控制卡片是否顯示
  readonly isOpen = signal(false);

  // 由 HoverCardTriggerDirective 註冊，供 CDK ConnectedOverlay 定位
  readonly triggerOrigin = signal<CdkOverlayOrigin | null>(null);

  private timeoutId?: ReturnType<typeof setTimeout>;

  open() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.isOpen.set(true), this.openDelay());
  }

  close() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.isOpen.set(false), this.closeDelay());
  }

  // 立即關閉，跳過 closeDelay：Escape、trigger 銷毀等場景不該還要等使用者設定的延遲
  closeImmediately() {
    clearTimeout(this.timeoutId);
    this.isOpen.set(false);
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
