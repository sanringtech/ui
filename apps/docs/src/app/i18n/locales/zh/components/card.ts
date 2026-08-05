export const cardTranslations = {
  'card.description': '可組合的內容容器 primitive，適用於表單、數據、媒體、列表與結構化內容。',
  'card.demo.form': '基礎表單卡片',
  'card.demo.metric': '儀表板數據卡片',
  'card.demo.image': '帶有首圖的圖文卡片',
  'card.demo.list': '複雜列表與狀態組合',
  'card.examples.description': 'Card 是彈性的內容水桶，會依照裡面的業務內容長成不同樣貌。',
  'card.examples.basic.description':
    'Card 由 root、header、title、description、content 與 footer 等小型 primitives 組成。',
  'card.usage.description': '匯入需要的 Card primitives，並搭配原生 HTML 與 utility classes 組合。',
  'card.installation.description':
    '用 CLI 加入這個元件，再匯入 CardComponent、CardHeaderComponent、CardContentComponent、CardFooterComponent、CardTitleDirective 與 CardDescriptionDirective。',
  'card.composition.description':
    'Card 不綁定業務結構；你可以覆蓋 class、放入任何媒體或表單控制項，並與其他 primitives 組合。',
  'card.api.description': 'Card 家族 primitives 支援的 Inputs。',
  'card.api.class.description': '與各 Card primitive 基礎樣式合併的額外 class。',
  'card.accessibility.description': 'Card 是版面容器，沒有內建 ARIA 角色。請在內部使用語意化 HTML——標題（透過 sanringCardTitle 的 h2–h4）、段落、清單。若要讓卡片成為獨立的內容地標，請手動在根元素加上 role="article"。',
  'card.keyboard.description': '除非內部有互動子元素（按鈕、連結），否則不可聚焦。',
  'card.stateModel.description': '無狀態的版面容器。本身沒有值、選取或事件狀態。',
} as const;
