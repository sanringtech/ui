export const hoverCardTranslations = {
  'hoverCard.description': '由 hover 或鍵盤 focus 開啟的浮動預覽面板，適合使用者摘要與輕量上下文。',
  'hoverCard.examples.basic.description':
    '將 trigger 與 content 包在一起；卡片會在 hover 或 focus 後開啟，並依設定延遲關閉。',
  'hoverCard.usage.description':
    '匯入 hover-card primitives，並將 sanringHoverCardTrigger 套用到要作為浮動面板定位錨點的元素。',
  'hoverCard.installation.description':
    '用 CLI 加入這個元件，再匯入 SANRING_HOVER_CARD_IMPORTS 取得 root、trigger 與 content primitives。',
  'hoverCard.composition.description':
    'Hover Card 將延遲控制器、trigger anchor 與浮動 content panel 拆開。',
  'hoverCard.demo.trigger': '@sanring/ui',
  'hoverCard.demo.description':
    '為 dashboard、表單、overlay 與密集資料介面打造的 Angular primitives。',
  'hoverCard.demo.side': '方向',
  'hoverCard.demo.sideDescription': '面板靠近 viewport 邊緣時會自動重新定位。',
  'hoverCard.demo.delay': '延遲',
  'hoverCard.demo.fastOpen': '快速開啟',
  'hoverCard.demo.delayDescription':
    '密集 app UI 可使用較短 openDelay，並保留較寬容的 closeDelay 讓游標移動更順。',
  'hoverCard.api.description': 'hover-card root 與 content primitives 支援的 inputs。',
  'hoverCard.api.openDelay.description': 'hover 或 focus 後，開啟前等待的毫秒數。',
  'hoverCard.api.closeDelay.description': '游標或 focus 離開後，關閉前等待的毫秒數。',
  'hoverCard.api.side.description':
    '浮動面板偏好的顯示方向；CDK overlay 可能為了保持可見而翻轉位置。',
  'hoverCard.api.sideOffset.description': 'trigger 與浮動面板之間的距離，單位為 px。',
  'hoverCard.api.class.description': '合併到浮動 content panel 的額外 class。',
  'hoverCard.accessibility.description':
    'Trigger 保留原生 focus 行為，面板可由鍵盤 focus 開啟並用 Escape 關閉。Hover Card 適合補充資訊，不應承載必須點擊才能完成的主要操作。',
  'hoverCard.keyboard.description': 'Hover Card 會由 pointer hover 與 trigger 的鍵盤 focus 開啟。',
  'hoverCard.keyboard.focus': '聚焦 trigger，並在 openDelay 後開啟浮動面板。',
  'hoverCard.keyboard.blur': '焦點離開後，在 closeDelay 後關閉面板。',
  'hoverCard.keyboard.escape': '焦點位於 trigger 或 content 內時關閉面板。',
  'hoverCard.stateModel.description':
    '開關狀態由 root 內部管理，並受 openDelay、closeDelay、hover、focus 與 Escape 影響。不是 ControlValueAccessor。',
} as const;
