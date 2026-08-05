export const commandTranslations = {
  'command.description':
    '可搜尋的指令清單，用於快速導覽與操作，可選搭配 ⌘K / Ctrl K 快捷鍵的 dialog 包裝。',
  'command.examples.basic.description':
    '組合 input、list、group 與 item。輸入文字會依項目可見文字內容進行篩選。',
  'command.usage.description': '匯入 command primitives，監聽 valueChange 回應選取事件。',
  'command.installation.description':
    '用 CLI 加入這個元件，再將 command primitives 匯入負責渲染清單的 standalone component。',
  'command.composition.description':
    'Command 將搜尋輸入框、可捲動清單、群組、項目與選用的 dialog 包裝分開，方便各自獨立使用。',
  'command.demo.dialog': 'Command dialog',
  'command.demo.shortcuts': '快捷鍵與停用項目',
  'command.demo.placeholder': '搜尋指令...',
  'command.demo.empty': '找不到符合的結果。',
  'command.demo.suggestions': '建議',
  'command.demo.settingsGroup': '設定',
  'command.demo.openDialog': '搜尋...',
  'command.demo.disabledItem': '封存',
  'command.api.description': 'command primitives 支援的 Inputs 與 Outputs。',
  'command.api.value.description': '識別 `sanring-command-item` 的唯一值，選取時會一併送出。',
  'command.api.disabled.description': '將該項目排除在篩選、鍵盤導覽與選取之外。',
  'command.api.heading.description': '顯示在 `sanring-command-group` 上方的選用標題。',
  'command.api.placeholder.description': '搜尋輸入框的 placeholder 文字。',
  'command.api.class.description': '合併到對應 primitive 的額外 class。',
  'command.api.selected.description':
    '`sanring-command-item` 被點擊或用 Enter 啟用時，送出該項目的 value。',
  'command.api.valueChange.description': '任何項目被選取時，從根元件 `sanring-command` 送出。',
  'command.api.shortcutHint.description':
    '`sanring-command-dialog` 上的唯讀 signal，依平台顯示對應的快捷鍵文字（Mac 上是 ⌘K，其他平台是 Ctrl K）。',
  'command.accessibility.description':
    "清單容器有 role='listbox'，每個可見選項有 role='option'。被篩選掉的項目會從 DOM 移除，並從鍵盤導覽中排除。請為搜尋 input 提供可及性標籤（aria-label 或連結的 <label> 元素）。",
  'command.keyboard.description': '輸入文字以篩選，用方向鍵導覽，Enter 執行。',
  'command.keyboard.type': '依輸入字串篩選命令清單。',
  'command.keyboard.navigateList': '在可見項目間移動焦點。',
  'command.keyboard.enter': '執行聚焦的命令項目。',
  'command.stateModel.description':
    "無狀態。每個 <sanring-command-item> 被啟動時送出 (commandSelected)。元件本身沒有內部選取狀態，如需追蹤請在外部管理。搜尋 input 驅動 DOM 內篩選，不符合的項目從可見清單和鍵盤導覽中移除。",
} as const;
