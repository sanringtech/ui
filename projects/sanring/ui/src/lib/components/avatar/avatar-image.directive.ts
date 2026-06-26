import { Directive, ElementRef, OnDestroy, computed, inject, input, signal } from '@angular/core';
import { cn } from '../../utils';
import { AvatarComponent } from './avatar.component';
import { AvatarStatus } from './avatar.types';

@Directive({
  selector: 'img[sanringAvatarImage]',
  standalone: true,
  host: {
    '(load)': 'onLoad()',
    '(error)': 'onError()',
    '[style.display]': 'displayStyle()',
    '[attr.aria-hidden]': 'ariaHidden()',
    '[class]': 'imageClass()',
  },
})
export class AvatarImageDirective implements OnDestroy {
  readonly class = input<string | undefined>();

  readonly imageState = signal<AvatarStatus>('idle');

  private readonly avatar = inject(AvatarComponent, { optional: true });
  private readonly elementRef = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private readonly srcObserver = new MutationObserver(() => this.syncImageStateFromSrc());

  protected readonly displayStyle = computed(() =>
    this.imageState() === 'loaded' ? 'block' : 'none',
  );

  protected readonly ariaHidden = computed(() => (this.imageState() !== 'loaded' ? 'true' : null));
  protected readonly imageClass = computed(() =>
    cn('aspect-square size-full rounded-full object-cover', this.class()),
  );

  constructor() {
    this.syncImageStateFromSrc();
    this.srcObserver.observe(this.elementRef.nativeElement, {
      attributeFilter: ['src'],
      attributes: true,
    });
  }

  protected onLoad() {
    this.imageState.set('loaded');
    this.avatar?.status.set('loaded');
  }

  protected onError() {
    this.imageState.set('error');
    this.avatar?.status.set('error');
  }

  ngOnDestroy() {
    this.srcObserver.disconnect();
  }

  private syncImageStateFromSrc() {
    const src = this.elementRef.nativeElement.getAttribute('src');
    const nextState: AvatarStatus = src ? 'loading' : 'error';
    this.imageState.set(nextState);
    this.avatar?.status.set(nextState);
  }
}
