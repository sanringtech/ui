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

} as const;
