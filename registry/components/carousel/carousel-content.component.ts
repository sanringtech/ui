import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
  computed,
  effect,
  input,
} from '@angular/core';
// 💡 引入 Embla 核心引擎
import EmblaCarousel from 'embla-carousel';
import { cn } from '../shared/utils';
import { CAROUSEL_ITEM_SPACING_CLASS, CarouselComponent } from './carousel.component';

@Component({
  selector: 'sanring-carousel-content',
  standalone: true,
  host: {
    // 1. 這裡就是 Viewport！必須隱藏溢出的內容
    '[class]': 'hostClass()',
  },
  template: `
    <!-- 2. 這裡就是 Container！負責把子項目排成一列 -->
    <div [class]="containerClass()">
      <ng-content></ng-content>
    </div>
  `,
})
export class CarouselContentComponent implements AfterViewInit, OnDestroy {
  readonly class = input<string | undefined>();

  // 🪄 牽起與總指揮的連結，我們需要它的設定，也要把引擎交給它
  protected carousel = inject(CarouselComponent);

  // 🪄 抓取自己的 DOM 節點，這將作為 Embla 的 Viewport
  private el = inject(ElementRef<HTMLElement>);

  // 保存引擎實體以便清理
  private emblaApi?: ReturnType<typeof EmblaCarousel>;

  // 🌟 Viewport 樣式：自訂元素預設是 inline，沒有明確 block 會整個縮成內容大小，
  // 導致 overflow-hidden 裁切錯位、旁邊 absolute 定位的按鈕跟著跑位
  protected readonly hostClass = computed(() => cn('block w-full overflow-hidden', this.class()));

  // 🌟 Container 樣式 (這段是 shadcn 最精彩的設計之一)
  protected readonly containerClass = computed(() =>
    cn(
      'flex',
      // 魔法抵銷：因為剛剛的 CarouselItem 都有加對應的內邊距，
      // 為了讓第一張幻燈片能完美貼齊邊緣，容器必須往反方向拉回相同的距離！
      CAROUSEL_ITEM_SPACING_CLASS[this.carousel.orientation()].content,
    ),
  );

  constructor() {
    // opts/orientation 在初次掛載後仍可能被外部動態改變；用 reInit 同步給既有的 Embla 實例，
    // 而不是要求使用者重新掛載整個 carousel 才能套用新設定。
    effect(() => {
      const opts = this.carousel.opts();
      const orientation = this.carousel.orientation();
      if (!this.emblaApi) return;

      this.emblaApi.reInit({ ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' });
    });
  }

  ngAfterViewInit() {
    // 組合外部傳入的選項，並且強制覆寫滑動軸向 (x 軸或 y 軸)
    const options = {
      ...this.carousel.opts(),
      axis: this.carousel.orientation() === 'horizontal' ? 'x' : 'y',
    } as const;
    this.emblaApi = EmblaCarousel(this.el.nativeElement, options);
    this.carousel.setApi(this.emblaApi);
  }

  ngOnDestroy() {
    this.emblaApi?.destroy();
  }
}
