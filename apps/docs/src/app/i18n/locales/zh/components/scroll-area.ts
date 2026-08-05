export const scrollAreaTranslations = {
  'scrollArea.description': '用於固定高度內容、清單與動態 feed 的可滾動區域 primitive。',
  'scrollArea.demo.basic': '固定內容',
  'scrollArea.demo.direction': '方向',
  'scrollArea.demo.infinite': '無限滾動',
  'scrollArea.demo.hideScrollbar': '隱藏滾動軸',
  'scrollArea.demo.customScrollbar': '自訂滾動軸顏色',
  'scrollArea.demo.item': '活動',
  'scrollArea.demo.itemDescription': '保持在滾動容器內的精簡 feed 列，外層頁面不會跟著位移。',
  'scrollArea.demo.loaded': '已載入',
  'scrollArea.examples.description': 'Scroll Area 適合讓密集內容在自己的區域內滾動。',
  'scrollArea.examples.basic.description':
    '將 sanringScrollArea 套用到固定高度容器，即可取得 overflow 行為與 CDK scroll tracking。',
  'scrollArea.usage.description':
    '匯入 ScrollAreaComponent 處理方向；需要 scroll 事件時再搭配 directives。',
  'scrollArea.installation.description':
    '在滾動容器上使用 sanringScrollArea；需要到底載入更多內容時，再加入 sanringInfiniteScroll。',
  'scrollArea.api.description':
    'sanringScrollArea 與 sanringInfiniteScroll 支援的 Inputs 與 Outputs。',
  'scrollArea.api.class.description': '與基礎滾動區域版面合併的額外 class。',
  'scrollArea.api.orientation.description': '控制 sanring-scroll-area 允許的滾動方向。',
  'scrollArea.api.loadMore.description': '滾動區域到達底部門檻後觸發。',
  'scrollArea.api.hideScrollbar.description': '為 true 時隱藏滾動軸，但保留滾動功能。',
  'scrollArea.api.scrollbarThumb.description': '控制滾動軸拇指顏色的 CSS 自訂屬性。',
  'scrollArea.api.scrollbarTrack.description': '控制滾動軸軌道背景的 CSS 自訂屬性。',
  'scrollArea.accessibility.description':
    '保留內容本身的語意。固定高度區域若包含大量內容，建議依情境加上 aria-label、aria-labelledby 或可見標題。',
  'scrollArea.stateModel.description':
    '不保存捲動位置。sanringInfiniteScroll 只在到達門檻時 emit loadMore；載入狀態、分頁游標與資料集合由宿主元件管理。',
} as const;
