export const treeTranslations = {
  'tree.description': '可組合的 tree primitives，適合檔案總管、巢狀導覽與階層資料。',
  'tree.examples.basic.description':
    '組合 tree、node、trigger 與 group primitives 來建立可展開的階層結構。',
  'tree.demo.navigation': '巢狀導覽',
  'tree.examples.navigation.description':
    '把 tree primitives 用在側邊導覽，讓群組展開狀態與目前頁面選取狀態都由外部 signal 控制。',
  'tree.usage.description': '匯入 tree primitives，並用 signals 控制展開與選取狀態。',
  'tree.installation.description':
    '用 CLI 加入這個元件，再將 tree primitives 匯入負責渲染階層資料的 standalone component。',
  'tree.composition.description':
    'Tree 將 root 狀態容器、node 語意、可展開 group 與 trigger 互動拆開。',
  'tree.api.description': 'tree primitives 支援的 inputs、models 與 directives。',
  'tree.api.expandedValue.description': '由 tree root 控制的已展開節點值。',
  'tree.api.selectedValue.description': '由 tree root 控制的目前選取節點值。',
  'tree.api.value.description': 'tree node 的唯一值。',
  'tree.api.exportAs.description':
    '把節點實體匯出成 template 變數——直接讀 `isExpanded()`/`isSelected()`，不用在元件 class 裡自己比對 value 字串。',
  'tree.api.trigger.description': '套用在互動元素上的 directive，用來切換節點 group。',
  'tree.api.class.description': '合併到對應 tree primitive 的額外 class。',

} as const;
