export const carouselTranslations = {
  'carousel.description': '基於 Embla 的可組合輪播元件，支援水平與垂直方向的 slide 導覽。',
  'carousel.examples.basic.description':
    '組合 root、content、item 與導覽按鈕 directive 來建立輪播。',
  'carousel.usage.description': '匯入 carousel primitives，並透過 opts input 傳入 Embla 設定。',
  'carousel.installation.description':
    '用 CLI 加入這個元件，再將 carousel primitives 匯入負責渲染 slides 的 standalone component。',
  'carousel.composition.description':
    'Carousel 將 Embla viewport、slide item 與導覽控制分開，方便各自調整樣式。',
  'carousel.demo.featured': '精選專案',
  'carousel.demo.teamHighlights': '團隊亮點',
  'carousel.demo.releaseNotes': '版本紀錄',
  'carousel.demo.previous': '上一張',
  'carousel.demo.next': '下一張',
  'carousel.demo.multiple': '多張可見',
  'carousel.demo.vertical': '垂直輪播',
  'carousel.demo.sizes': '尺寸',
  'carousel.demo.sizesLabel': '尺寸範例',
  'carousel.examples.sizes.description':
    '在 sanring-carousel-item 上使用 basis utility class，控制同時可見的幻燈片數量。',
  'carousel.api.description': 'carousel primitives 支援的 inputs 與 directives。',
  'carousel.api.orientation.description':
    '設定輪播軸向。horizontal 對應 Embla x 軸，vertical 對應 y 軸。',
  'carousel.api.opts.description': '傳給底層 Embla 實例的設定，例如 loop 或 align。',
  'carousel.api.ariaLabel.description': '套用在 carousel region 上的無障礙標籤。',
  'carousel.api.class.description': '合併到 carousel root 的額外 class。',
  'carousel.api.previous.description':
    '套用在按鈕上的 directive，用來滑到上一張，位於開頭時會自動 disabled。',
  'carousel.api.next.description':
    '套用在按鈕上的 directive，用來滑到下一張，位於結尾時會自動 disabled。',

} as const;
