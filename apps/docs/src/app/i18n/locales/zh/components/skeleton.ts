export const skeletonTranslations = {
  'skeleton.description': '用於內容載入或準備期間的佔位 primitive。',
  'skeleton.demo.avatar': '頭像',
  'skeleton.demo.card': '卡片',
  'skeleton.demo.text': '文字',
  'skeleton.demo.form': '表單',
  'skeleton.demo.table': '表格',
  'skeleton.examples.description': '常見的骨架屏版型，適合頭像、卡片、文字、表單與表格。',
  'skeleton.examples.basic.description': '使用骨架屏在最終內容完成前保留版面空間。',
  'skeleton.usage.description': '匯入 SkeletonDirective，並將 sanringSkeleton 套用到任意元素。',
  'skeleton.installation.description':
    '將 directive 套用在 div、span 或語意元素上，並透過 class 提供寬度、高度與圓角。',
  'skeleton.composition.description': '組合多個 skeleton block，讓載入狀態貼近實際內容結構。',
  'skeleton.api.description': 'sanringSkeleton directive 支援的 Inputs。',
  'skeleton.api.class.description': '與基礎骨架屏樣式合併的額外 class。',
  'skeleton.accessibility.description':
    "骨架元素不具語意，對螢幕閱讀器不可見。在載入容器上加 aria-busy='true' 與 aria-live='polite'，讓螢幕閱讀器在真實內容準備好後播報。",
  'skeleton.keyboard.description': '不可聚焦，沒有鍵盤互動。',
  'skeleton.stateModel.description':
    '無狀態的視覺佔位元件。使用 @if(!loaded) 渲染，並在資料到達後切換為真實內容。沒有內部載入或進度狀態。',
} as const;
