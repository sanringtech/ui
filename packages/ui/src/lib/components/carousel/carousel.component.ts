import { Component, computed, input, InputSignal, signal, OnDestroy } from '@angular/core';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { cn } from '../../utils';
import { CarouselOrientation } from './carousel.type';

// 兩個子元件（content 的負向 margin、item 的正向 padding）必須用同一組間距，
// 否則第一張/最後一張幻燈片會沒對齊邊緣。集中定義避免兩邊各寫一份、日後改一邊忘了改另一邊。
//
// vertical 額外加了 h-full：block 元素的寬度預設會撐滿父層，但高度不會，
// flex container 在主軸（這裡是垂直）沒有明確高度時，子項目的 basis-full 依 CSS
// 規範會退化成 auto（依內容撐開），導致每張幻燈片高度不一致、Embla 量到錯的尺寸。
export const CAROUSEL_ITEM_SPACING_CLASS: Record<
  CarouselOrientation,
  { item: string; content: string }
> = {
  horizontal: { item: 'pl-4', content: '-ml-4' },
  vertical: { item: 'pt-4', content: '-mt-4 flex-col h-full' },
};

@Component({
  selector: 'sanring-carousel',
  standalone: true,
  host: {
    role: 'region',
    '[attr.aria-roledescription]': '"carousel"',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'carouselClass()',
    // 將方向寫入 DOM 屬性，方便未來針對直向/橫向做 CSS 調整
    '[attr.data-orientation]': 'orientation()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <!-- 為了讓旁邊的上一張/下一張按鈕可以絕對定位 (absolute)，這裡設為 relative -->
    <div class="relative">
      <ng-content></ng-content>
    </div>
  `,
})
export class CarouselComponent implements OnDestroy {
  readonly orientation = input<CarouselOrientation>('horizontal');
  // 明確標註型別，避免 tsc 在產生 .d.ts 時因為 EmblaOptionsType 內部引用到
  // embla-carousel 子路徑型別而報 "type cannot be named" 錯誤。
  readonly opts: InputSignal<EmblaOptionsType> = input<EmblaOptionsType>({});
  readonly ariaLabel = input<string | undefined>();
  readonly class = input<string | undefined>();

  protected readonly carouselClass = computed(() => cn('relative block w-full', this.class()));

  private emblaApi?: EmblaCarouselType;
  readonly canScrollPrev = signal(false);
  readonly canScrollNext = signal(false);

  setApi(api: EmblaCarouselType) {
    this.emblaApi = api;
    this.syncState();

    // 監聽 Embla 的滑動事件，每次滑動完就更新按鈕的可用狀態
    this.emblaApi.on('select', () => this.syncState());
    this.emblaApi.on('reInit', () => this.syncState());
  }

  // 左右鍵（垂直方向則是上下鍵）導覽；鍵盤事件從 prev/next 按鈕或幻燈片本身冒泡上來
  protected onKeydown(event: KeyboardEvent) {
    const prevKey = this.orientation() === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = this.orientation() === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

    if (event.key === prevKey) {
      event.preventDefault();
      this.scrollPrev();
    } else if (event.key === nextKey) {
      event.preventDefault();
      this.scrollNext();
    }
  }

  private syncState() {
    if (!this.emblaApi) return;
    this.canScrollPrev.set(this.emblaApi.canScrollPrev());
    this.canScrollNext.set(this.emblaApi.canScrollNext());
  }

  scrollPrev() {
    this.emblaApi?.scrollPrev();
  }

  scrollNext() {
    this.emblaApi?.scrollNext();
  }

  ngOnDestroy() {
    this.emblaApi?.destroy();
  }
}
