export const checkboxTranslations = {
  'checkbox.description':
    '用於切換布林或半選狀態的控制項，透過 ControlValueAccessor 相容 Angular 表單。',
  'checkbox.demo.indeterminate': '半選狀態',
  'checkbox.demo.disabled': '停用',
  'checkbox.demo.stateSurface': '狀態背景',
  'checkbox.demo.unchecked': '未勾選',
  'checkbox.demo.checked': '已勾選',
  'checkbox.demo.disabledUnchecked': '停用未勾選',
  'checkbox.demo.disabledChecked': '停用已勾選',
  'checkbox.demo.disabledIndeterminate': '停用半選',
  'checkbox.demo.withLabel': '搭配標籤',
  'checkbox.demo.acceptTerms': '接受條款與條件',
  'checkbox.examples.description': '常見的 Checkbox 模式，包含半選、搭配 label 與停用狀態。',
  'checkbox.examples.basic.description':
    'Checkbox 實作 ControlValueAccessor，使用 ngModel 或 reactive form 綁定選取狀態。',
  'checkbox.usage.description':
    '匯入 CheckboxComponent，並透過 ngModel 或 reactive form control 綁定狀態。',
  'checkbox.api.description': 'sanring-checkbox component 支援的 Inputs。',
  'checkbox.api.class.description': '與 checkbox button 樣式合併的額外 class。',
  'checkbox.api.id.description': '套用到 checkbox button 的原生 id，可用於 label 關聯。',
  'checkbox.api.name.description': '轉發到 button 的原生 name 屬性，供表單提交使用。',
  'checkbox.api.value.description': '轉發到 button 的原生 value 屬性，供表單提交使用。',
  'checkbox.api.disabled.description': '停用互動並降低視覺強度。',
  'checkbox.api.required.description': '在 button 上設定 aria-required，標示必填欄位。',
  'checkbox.api.checked.description':
    '受控的勾選狀態，支援 true、false 或 "indeterminate"。可使用 [(checked)] 進行雙向綁定，無需 Angular 表單。',
  'checkbox.api.checkedChange.description': '每次切換時發出新的 CheckedState。',
  'checkbox.api.tabIndex.description': 'Tab 鍵順序索引，停用時自動設為 -1。',
  'checkbox.api.ariaLabel.description': '獨立使用（無可見 label 元素關聯）時的無障礙標籤。',
  'checkbox.api.ariaLabelledBy.description': '標示此 checkbox 的外部元素 ID。',
  'checkbox.api.ariaDescribedBy.description': '提供此 checkbox 延伸說明的元素 ID。',
  'checkbox.api.size.description': "Checkbox 的視覺尺寸，接受 'sm'、'md'（預設）、'lg'。",
  'checkbox.demo.size': '尺寸變體',
  'checkbox.demo.size.sm': '小',
  'checkbox.demo.size.md': '中',
  'checkbox.demo.size.lg': '大',
  'checkbox.demo.eventBinding': '事件綁定',
  'checkbox.demo.field': '搭配 Field',
  'checkbox.demo.fieldError': '必須接受條款才能繼續。',
  'checkbox.examples.field.description':
    '把 sanring-checkbox 包在 sanring-field 裡並綁定 reactive form control——控制項變成 invalid 且 touched 之後，錯誤訊息會自動顯示。',

} as const;
