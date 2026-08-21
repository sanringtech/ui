export const contextMenuTranslations = {
  'contextMenu.description': '在目標區域按右鍵觸發、於游標位置展開的選單。',
  'contextMenu.examples.basic.description': '包含快捷鍵、separator 與危險操作項目的基礎操作選單。',
  'contextMenu.usage.description':
    '先匯入 context menu primitives，在觸發區域加上 sanringContextMenuTrigger，再把 sanring-context-menu-content 放在同層 —— 按右鍵時會直接在游標位置展開。SANRING_CONTEXT_MENU_IMPORTS 是便利整包匯入；若只需要部分 primitive，也可以個別匯入以讓依賴更明確。',
  'contextMenu.installation.description':
    '用 CLI 加入這個元件，再匯入 SANRING_CONTEXT_MENU_IMPORTS 取得完整 primitive set；需要更細的 imports 控制時，也可改用個別 primitive。',
  'contextMenu.composition.description':
    'sanring-context-menu-content 會在游標位置展開；用 sanring-context-menu-sub 搭配自己的 sub-trigger/sub-content 建立子選單，並用 label、separator、checkbox item、radio group/item 組出選單內容。',
  'contextMenu.examples.description':
    '常見 context menu 模式，包含可勾選選項、radio 樣式選擇與巢狀子選單。',
  'contextMenu.demo.checkbox': 'Checkbox',
  'contextMenu.demo.radio': 'Radio',
  'contextMenu.demo.submenu': 'Submenu',
  'contextMenu.api.description': 'Context menu primitives 支援的 Inputs、Outputs 與 class。',
  'contextMenu.api.itemSelected.description':
    '被啟用的 item（點擊、按 Enter 或 Space）觸發時送出對應的 value，緊接著整個選單（含任何展開中的子選單）就會關閉。宣告在 sanring-context-menu（root）上，不論選中的 item 巢狀多深都會回報到這裡。',
  'contextMenu.api.value.description': 'item 被啟用時透過 itemSelected 送出的值。必填。',
  'contextMenu.api.disabled.description': '停用 menu item，並移除鍵盤與點擊啟用行為。',
  'contextMenu.api.variant.description': '控制 item 語氣；移除資料或高風險操作可使用 destructive。',
  'contextMenu.api.checked.description': 'checkbox item 的勾選狀態，支援 [(checked)] 雙向綁定。',
  'contextMenu.api.radioValue.description': 'radio group 目前選中的值，支援 [(value)] 雙向綁定。',
  'contextMenu.api.class.description': '與對應 context menu primitive 樣式合併的額外 class。',
  'contextMenu.accessibility.description':
    "面板有 role='menu'，item 依情況有 role='menuitem'、role='menuitemcheckbox' 或 role='menuitemradio'。trigger 區域（[sanringContextMenuTrigger]）不提供 ARIA 狀態，建議搭配可見的操作提示或鍵盤快捷鍵說明以提升可及性。",
  'contextMenu.keyboard.description': '右鍵選單也可以透過鍵盤 trigger 開啟。',
  'contextMenu.keyboard.navigateItems': '在選單項目間移動焦點，跳過停用項目（循環）。',
  'contextMenu.keyboard.enter': '啟動聚焦的選單項目。',
  'contextMenu.keyboard.tab': '關閉選單，並移至 trigger 前後相鄰的控制項。',
  'contextMenu.keyboard.escape': '關閉右鍵選單。',
  'contextMenu.stateModel.description':
    '無狀態。item 啟動時送出事件。trigger 上下文由 [sanringContextMenuTrigger] 指令設定，可套用在任何 host 元素上。開啟/關閉由右鍵點擊事件驅動，或透過 ContextMenuComponent 的 open(x, y) 方法程式化觸發。',
} as const;
