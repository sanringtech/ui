export const alertTranslations = {
  'alert.description': '用於重要狀態、警告與引導內容的持續性 inline 訊息，會佔據實際版面空間。',
  'alert.demo.banner': '全域狀態橫幅',
  'alert.demo.destructive': '危險操作警告',
  'alert.demo.empty': '空狀態引導',
  'alert.examples.description': 'Alert 適合呈現不該自動消失、需要持續被看見的狀態資訊。',
  'alert.examples.basic.description': 'Alert 會保留版面空間，並組合圖示、標題與描述文字。',
  'alert.usage.description': '匯入 Alert primitives，並搭配原生文字與圖示組合。',
  'alert.installation.description':
    '用 CLI 加入這個元件，再匯入 AlertComponent、AlertTitleDirective 與 AlertDescriptionDirective。',
  'alert.composition.description':
    'Alert 是靜態排版 primitive，適合狀態驅動訊息；短暫事件通知應交給 Toast。',
  'alert.api.description': 'sanring-alert component 支援的 Inputs。',
  'alert.api.class.description': '與基礎提示樣式合併的額外 class。',
  'alert.api.variant.description': '控制視覺語氣，目前支援 default 與 destructive。',
  'alert.accessibility.description': "宿主具有 role='alert'，隱含 aria-live='assertive'。元素插入 DOM 時，螢幕閱讀器會立即播報內容。對於非緊急訊息，可改用 role='status'（aria-live='polite'）。",
  'alert.keyboard.description': '除非內部有互動子元素（例如關閉按鈕），否則不可聚焦。',
  'alert.stateModel.description': '無狀態——使用 @if 插入或移除 <sanring-alert> 以觸發或清除 live region 播報。內容由 ng-content 驅動。',
} as const;
