export const comboboxTranslations = {
  'combobox.description': '具備建議清單的自動完成輸入元件。',
  'combobox.examples.basic.description':
    '組合 input、content、list、empty 與 item primitives 來建立可搜尋的選取器。',
  'combobox.usage.description': '匯入 combobox primitives，並透過 root model input 綁定 value。',
  'combobox.installation.description':
    '用 CLI 加入這個元件，再將 combobox primitives 匯入負責渲染建議清單的 standalone component。',
  'combobox.composition.description':
    'Combobox 將輸入框、浮層內容、列表項目、群組與多選 chips 拆成獨立 primitives。',
  'combobox.demo.framework': '框架',
  'combobox.demo.frameworks': '框架',
  'combobox.demo.placeholder': '選擇框架',
  'combobox.demo.empty': '找不到框架。',
  'combobox.demo.selected': '已選取：',
  'combobox.demo.groups': '群組',
  'combobox.demo.searchLibraries': '搜尋函式庫',
  'combobox.demo.noLibraries': '找不到函式庫。',
  'combobox.demo.frontend': '前端',
  'combobox.demo.meta': 'Meta frameworks',
  'combobox.demo.disabled': '停用的 Combobox',
  'combobox.demo.popup': 'Popup',
  'combobox.demo.popupDescription':
    '用按鈕觸發 combobox，而不是一直顯示輸入框——搭配 sanringComboboxTrigger 與 #combo="sanringCombobox"，展開後把按鈕換成 input。',
  'combobox.demo.selectCountry': 'Select country',
  'combobox.demo.search': 'Search',
  'combobox.demo.clearButtonTitle': 'Clear Button',
  'combobox.demo.clearButtonDescription':
    '傳入 showClear 會渲染一個能重設 value 與搜尋文字的按鈕。',
  'combobox.demo.field': '搭配 Field',
  'combobox.demo.fieldError': '請選擇一個框架。',
  'combobox.examples.field.description':
    '把 sanring-combobox 包在 sanring-field 裡並綁定 reactive form control——控制項變成 invalid 且 touched 之後，錯誤訊息會自動顯示。',
  'combobox.api.description': 'combobox primitives 支援的 inputs 與 models。',
  'combobox.api.value.description':
    '由 root 控制的選取值。單選使用 string，多選使用 string array。',
  'combobox.api.multiple.description': '允許選取多個項目，並可搭配 chips 呈現。',
  'combobox.api.disabled.description': '停用 combobox input，並阻止選取狀態變更。',
  'combobox.api.placeholder.description':
    'combobox input 的 placeholder 文字，正式應用中建議由 i18n 傳入。',
  'combobox.api.showClear.description':
    '有值或搜尋文字時顯示清除按鈕。若 input 被包在 chip-input 裡（多選模式）則不會顯示，因為多選已經有各自 chip 的移除按鈕。',
  'combobox.api.itemValue.description': 'combobox item 的唯一值。',
  'combobox.api.itemLabel.description': '當畫面內容與搜尋文字不同時，用於篩選的選用文字。',
  'combobox.api.heading.description': '顯示在 combobox group 上方的選用標題。',
  'combobox.api.trigger.description':
    '從自訂觸發元素（例如樣式像 Select 的按鈕）開啟 combobox 的指令。',
  'combobox.api.class.description': '合併到對應 combobox primitive 的額外 class。',

} as const;
