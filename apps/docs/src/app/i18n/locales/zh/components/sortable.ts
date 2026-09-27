export const sortableTranslations = {
  'sortable.description':
    '單一列表重排 primitive。指標拖曳走 Angular CDK，鍵盤方向鍵移動目前焦點項目。卡片與其他內容透過 item directive 組合。',
  'sortable.demo.handle': '拖曳手柄',
  'sortable.demo.horizontal': '水平',
  'sortable.demo.alpha': '收件摘要',
  'sortable.demo.alphaDescription': '每天早上彙整未讀討論串。',
  'sortable.demo.beta': '發布檢查清單',
  'sortable.demo.betaDescription': '發布前必須通過審核與煙霧測試。',
  'sortable.demo.gamma': '週報',
  'sortable.demo.gammaDescription': '每週五送出精簡狀態說明。',
  'sortable.demo.reorder': '調整順序',
  'sortable.installation.description':
    '用 CLI 加入這個元件，再匯入 list、item，以及可選的 handle directive。',
  'sortable.usage.description':
    '把同一個陣列綁到 data 與 @for。在 sorted 時換成新陣列，讓 Angular 對齊新順序。',
  'sortable.composition.description':
    '列表負責順序。Item 可以是任何 host 元素。可選 handle 會把指標拖曳限制在該控制項上。',
  'sortable.api.description': '單一 sortable 列表的 Inputs、Outputs 與 directives。',
  'sortable.api.class.description': '與 list host 合併的額外 class。',
  'sortable.api.data.description':
    '必填陣列，會就地重排。每次移動後 sorted 會送出淺拷貝。',
  'sortable.api.orientation.description':
    '版面與指標拖曳的鎖定軸。vertical 用方向鍵上/下；horizontal 用左/右。',
  'sortable.api.disabled.description': '停用整份列表的指標與鍵盤重排。',
  'sortable.api.sorted.description': '成功重排後送出新陣列。',
  'sortable.api.itemDisabled.description': '停用單一項目，不鎖定整份列表。',
  'sortable.api.handle.description':
    '可選拖曳手柄。有 handle 時，指標拖曳從手柄開始，而不是整個 item。',
  'sortable.accessibility.description':
    '列表使用 role=list，項目使用 role=listitem。停用的項目會離開 Tab 順序。內容是密集卡片時，建議用有名稱的 handle 按鈕。',
  'sortable.keyboard.description': '先聚焦一個項目，再用方向鍵移動。Tab 會依序走過列表。',
  'sortable.keyboard.arrowsVertical': '在垂直列表中，把焦點項目往上或往下移。',
  'sortable.keyboard.arrowsHorizontal': '在水平列表中，把焦點項目往左或往右移。',
  'sortable.keyboard.tabShiftTab': '依文件順序在 sortable 項目之間移動焦點。',
  'sortable.stateModel.description':
    'data 是順序來源。重排會改這個陣列，並用拷貝觸發 sorted。list 或 item 的 disabled 只阻止移動，不會清空 data。',
} as const;
