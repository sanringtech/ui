export const selectTranslations = {
  'select.description': '可組合的選取 primitive，用於從浮動 listbox 中選擇單一值。',
  'select.examples.basic.description':
    '透過 trigger 開啟定位選單，並在 trigger 中顯示已選項目的標籤。',
  'select.usage.description':
    '匯入 select primitives，並組合 root、trigger、value、content 與 item。',
  'select.installation.description':
    '用 CLI 加入這個元件，再使用 SANRING_SELECT_IMPORTS 一次匯入完整 select primitives。',
  'select.examples.description': '常見 select 模式，包含群組選項、分隔線與停用項目。',
  'select.demo.groups': '群組',
  'select.demo.itemAligned': '項目對齊 Trigger',
  'select.demo.disabledItem': '停用項目',
  'select.demo.customIcon': '自訂 CircleCheck 圖示',
  'select.demo.field': '搭配 Field',
  'select.demo.chooseWorkspace': '選擇一個工作區',
  'select.demo.fieldError': '請選擇一個工作區。',
  'select.examples.field.description':
    '把 sanring-select 包在 sanring-field 裡並綁定 reactive form control——控制項變成 invalid 且 touched 之後，錯誤訊息會自動顯示。',
  'select.api.description': 'select primitives 支援的 inputs、models 與 class。',
  'select.api.value.description': '目前選取的值，透過 ControlValueAccessor 支援 Angular 表單。',
  'select.api.isOpen.description': '控制浮動 listbox 是否開啟。',
  'select.api.contentPosition.description':
    "控制 content 定位模式：'popper' 對齊 trigger 邊緣，'item-aligned' 讓已選項目貼齊 trigger。",
  'select.api.matchTriggerWidth.description':
    '讓浮動 content 寬度與 trigger 實際寬度一致，避免因選項文字長度改變。',
  'select.api.itemValue.description': '此 option 被選取時回傳的值。',
  'select.api.itemDisabled.description': '停用單一 option。',
  'select.api.indicatorPosition.description': '設定選取圖示顯示在文字前方或後方。',
  'select.api.showIndicator.description': '控制是否渲染選取圖示。',
  'select.api.customIndicator.description': '投影自訂選取圖案，以取代預設 check icon。',
  'select.api.class.description': '合併到對應 select primitive 的額外 class。',

} as const;
