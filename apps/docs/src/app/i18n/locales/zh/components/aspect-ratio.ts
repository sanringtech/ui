export const aspectRatioTranslations = {
  'aspectRatio.description': '用於固定媒體、嵌入內容與預覽框比例的版面 directive。',
  'aspectRatio.examples.basic.description':
    '把 sanringAspectRatio 套用到任意容器，並傳入想要的 CSS aspect-ratio 值。',
  'aspectRatio.usage.description':
    '匯入 AspectRatioDirective，然後將 sanringAspectRatio 套用到要承載比例框的元素。',
  'aspectRatio.installation.description':
    '用 CLI 加入這個元件，再到渲染媒體框的 standalone component 中匯入 AspectRatioDirective。',
  'aspectRatio.demo.media': '媒體框',
  'aspectRatio.demo.square': '正方形縮圖',
  'aspectRatio.demo.card': '卡片媒體',
  'aspectRatio.demo.cardTitle': '穩定的媒體框',
  'aspectRatio.demo.cardBody': '媒體載入時，下方內容仍保持位置穩定。',
  'aspectRatio.api.description': 'sanringAspectRatio directive 支援的 Inputs。',
  'aspectRatio.api.ratio.description':
    '套用到宿主元素的寬高比。可使用 16 / 9 這類 CSS ratio 字串，或 1.777 這類數字。',
  'aspectRatio.api.class.description': '額外合併到基礎 relative w-full 容器樣式上的 class。',
  'aspectRatio.accessibility.description':
    '不加入額外 ARIA，保留內容本身的語意。圖片、iframe 或影片仍需依內容提供 alt、title 或 caption。',
  'aspectRatio.stateModel.description':
    '無內部狀態。sanringAspectRatio 只把比例樣式套用到宿主元素，不保存載入、選取或互動狀態。',
} as const;
