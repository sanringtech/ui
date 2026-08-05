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
  'tree.accessibility.description':
    "宿主具有 role='tree'，每個 sanring-tree-node 具有 role='treeitem'。aria-selected 反映選取狀態。aria-expanded 只設定在有子節點的分支節點上——葉節點正確地省略此屬性。Roving tabindex：任何時間只有目前有焦點的節點在 Tab 序列中。",
  'tree.keyboard.description': '透過 CDK TreeKeyManager 提供完整鍵盤導覽。',
  'tree.keyboard.arrowDown': '將焦點移至下一個可見節點。',
  'tree.keyboard.arrowUp': '將焦點移至上一個可見節點。',
  'tree.keyboard.arrowRight': '展開已收合的分支；若已展開，則將焦點移至其第一個子節點。',
  'tree.keyboard.arrowLeft': '收合已展開的分支；若已收合，則將焦點移至父節點。',
  'tree.keyboard.enter': '選取目前有焦點的節點。',
  'tree.keyboard.tab':
    '進入樹狀結構（第一次 Tab）或回到頁面（第二次 Tab）。樹狀結構使用 roving tabindex。',
  'tree.stateModel.description':
    'expandedValue 與 selectedValue 為支援雙向綁定的 model() signal。在宿主元件中使用 [(expandedValue)] 與 [(selectedValue)] 管理響應式狀態。非 CVA。',
} as const;
