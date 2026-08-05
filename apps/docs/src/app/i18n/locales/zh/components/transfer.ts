export const transferTranslations = {
  'transfer.description': '在兩個面板間移動項目的雙欄選擇控制項，支援逐項勾選與停用。',
  'transfer.examples.basic.description':
    '基本的雙面板穿梭：在任一側勾選項目後，用中間的箭頭按鈕把它們移到對側。',
  'transfer.usage.description':
    '匯入 SANRING_TRANSFER_IMPORTS，將 items 綁定完整資料集，並綁定 selectedKeys 來追蹤目前在右側（target）面板的項目。在 transfer 標籤內組合來源面板、動作區與目標面板——sanring-transfer-list 會依所在的面板自動渲染對應的項目。',
  'transfer.installation.description':
    '透過 CLI 安裝元件，再匯入 SANRING_TRANSFER_IMPORTS 取得完整的 primitive 組合。',
  'transfer.composition.description':
    'sanring-transfer 持有共用的 items 與 selectedKeys 狀態；每個 sanring-transfer-panel 會依 direction（source 或 target）讀取對應的項目切片，sanring-transfer-list 再為每一筆資料渲染一個 sanring-transfer-item。把標記 [sanringTransferAction] 的按鈕放在兩個面板中間，用來移動已勾選的項目。',
  'transfer.examples.description':
    '常見的穿梭框模式：停用項目、標題列即時筆數、自訂操作按鈕、單向穿梭、面板搜尋，以及分頁。',
  'transfer.demo.available': '可選項目',
  'transfer.demo.selected': '已選項目',
  'transfer.demo.moveToTarget': '移到已選項目',
  'transfer.demo.moveToSource': '移到可選項目',
  'transfer.demo.disabled': '停用項目',
  'transfer.demo.headerCount': '標題列即時筆數',
  'transfer.demo.customActions': '自訂操作按鈕',
  'transfer.demo.oneWay': '單向穿梭',
  'transfer.demo.search': '帶搜尋框',
  'transfer.demo.pagination': '分頁',
  'transfer.demo.add': '加入',
  'transfer.demo.remove': '移除',
  'transfer.demo.searchPlaceholder': '搜尋...',
  'transfer.demo.clearSearch': '清除搜尋',
  'transfer.demo.previousPage': '上一頁',
  'transfer.demo.nextPage': '下一頁',
  'transfer.demo.selectAll': '標題列全選',
  'transfer.api.description': 'Transfer primitives 支援的 Inputs，以及 transfer item 的資料結構。',
  'transfer.api.items.description':
    '兩個面板共用的完整資料集。key 出現在 selectedKeys 裡的項目會顯示在目標面板，其餘顯示在來源面板。',
  'transfer.api.selectedKeys.description':
    '目前在目標面板中的 key 清單，支援 [(selectedKeys)] 雙向綁定，讓父層可以讀取或預先帶入結果。',
  'transfer.api.direction.description':
    "此面板要渲染哪一側的項目：'source' 為尚未被選取的項目，'target' 為已經被移過去的項目。必填。",
  'transfer.api.panelClass.description': '與面板容器合併的額外 class。',
  'transfer.api.headerClass.description': '與面板標題列合併的額外 class。',
  'transfer.api.isShow.description':
    '為 true 時，在 header 尾端自動渲染「已勾選數/總數」計數標籤。',
  'transfer.api.actionClass.description':
    '與 [sanringTransferAction] 容器合併的額外 class，通常放在兩個面板中間。',
  'transfer.api.itemKey.description': '項目的唯一識別碼，用來追蹤勾選狀態與所在面板。',
  'transfer.api.itemLabel.description': '項目顯示的文字內容。',
  'transfer.api.itemDisabled.description': '停用後項目無法被勾選或移動。',
  'transfer.api.mode.description':
    "設為 'one-way' 會讓 target 面板變成唯讀：裡面的項目無法再被勾選，也無法搬回 source 面板。",
  'transfer.api.pageSize.description': '每頁顯示的項目數量。不設定則不分頁，一次顯示全部項目。',
  'transfer.api.setQuery.description':
    '依 label 過濾這個面板的項目（不分大小寫的子字串比對），並把頁碼重設回第一頁。',
  'transfer.api.pageState.description':
    '面板目前的頁碼（從 0 開始）與依 pageSize、目前篩選條件算出的總頁數。',
  'transfer.api.pageNav.description': '切換到下一頁／上一頁，超出範圍時不會有作用。',
  'transfer.api.interactive.description':
    'one-way 模式下的 target 面板會是 false，內部用來停用它的 checkbox。',
  'transfer.api.selectableItems.description':
    '過濾後的完整清單中所有非 disabled 的項目（不受分頁限制）。適合在標題列顯示可選數量。',
  'transfer.api.selectAllChecked.description':
    "全選 checkbox 的狀態：全部勾選時為 true、部分勾選時為 'indeterminate'、無勾選時為 false。",
  'transfer.api.selectAllMethods.description':
    '勾選 / 取消勾選 / 切換面板內所有非 disabled 項目。interactive() 為 false 時 selectAll / deselectAll 為 no-op。',
  'transfer.keyboard.description':
    'Transfer 由 checkbox、操作按鈕、搜尋輸入與選用 pagination 控制組成。',
  'transfer.keyboard.tabShiftTab': '在面板項目、操作按鈕、搜尋欄與分頁控制間移動焦點。',
  'transfer.keyboard.space': '切換目前聚焦的項目或全選 checkbox。',
  'transfer.keyboard.enterSpace': '啟用目前聚焦的移動操作或分頁控制。',
  'transfer.keyboard.type': '焦點在搜尋輸入中時，過濾目前面板項目。',
} as const;
