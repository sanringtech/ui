import { DialogRef } from '@angular/cdk/dialog';
import { Platform } from '@angular/cdk/platform';
import {
  Component,
  DestroyRef,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../shared/utils';
import { OVERLAY_SURFACE_CLASS } from '../shared/component-styles';
import { DialogService } from '../dialog/dialog.service';

// navigator.userAgentData 是較新的 Client Hints API，Chromium 系有支援但 Safari/Firefox 沒有；
// navigator.platform 雖然標為 deprecated，但目前仍是唯一能在 Safari 上正確判斷 Mac 的方式，
// 所以兩個都試，缺一個就退到下一個。
function detectIsMac(platform: Platform): boolean {
  if (!platform.isBrowser) return false;
  const uaDataPlatform = (navigator as { userAgentData?: { platform?: string } }).userAgentData
    ?.platform;
  const platformString = uaDataPlatform ?? navigator.platform ?? navigator.userAgent;
  return /Mac/i.test(platformString);
}

@Component({
  selector: 'sanring-command-dialog',
  standalone: true,
  host: {
    '(document:keydown)': 'onGlobalKeydown($event)',
  },
  template: `
    <ng-template #dialogTemplate>
      <div [class]="panelClass()">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class CommandDialogComponent {
  readonly class = input<string | undefined>();
  // 面板通常沒有可見標題（就一個搜尋框），交給 CDK dialog container 的 aria-label
  // 給螢幕閱讀器使用者一個可辨識的名稱，而不是只靠 input 的 placeholder。
  readonly ariaLabel = input<string | undefined>();

  @ViewChild('dialogTemplate') private readonly templateRef!: TemplateRef<unknown>;

  private readonly dialogService = inject(DialogService);
  private readonly platform = inject(Platform);
  private readonly destroyRef = inject(DestroyRef);

  private readonly isMac = detectIsMac(this.platform);
  private dialogRef: DialogRef<void, unknown> | null = null;

  readonly isOpen = signal(false);

  /** 給 trigger 按鈕顯示用的快捷鍵提示，例如「搜尋... ⌘K」 */
  readonly shortcutHint = computed(() => (this.isMac ? '⌘K' : 'Ctrl K'));

  protected readonly panelClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'w-full max-w-2xl overflow-hidden rounded-[var(--sanring-radius-lg)] shadow-2xl',
      this.class(),
    ),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.dialogRef?.close());
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    const modifierPressed = this.isMac ? event.metaKey : event.ctrlKey;
    if (!modifierPressed || event.key.toLowerCase() !== 'k') return;

    event.preventDefault();
    this.toggle();
  }

  open(): void {
    if (this.dialogRef) return;

    this.isOpen.set(true);
    this.dialogRef = this.dialogService.open(this.templateRef, {
      ariaLabel: this.ariaLabel(),
      panelClass: ['fixed', 'inset-0', 'z-[51]', 'flex', 'items-start', 'justify-center', 'p-4', 'pt-[12vh]'],
    });
    this.dialogRef.closed.subscribe(() => {
      this.dialogRef = null;
      this.isOpen.set(false);
    });
  }

  close(): void {
    this.dialogRef?.close();
  }

  toggle(): void {
    if (this.dialogRef) this.close();
    else this.open();
  }
}
