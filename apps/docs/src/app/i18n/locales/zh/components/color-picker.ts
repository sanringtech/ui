export const colorPickerTranslations = {
  'colorPicker.description':
    '用來選 hex 顏色的表單控制項。Trigger 顯示目前色塊；popover 裡有原生顏色輸入、hex 欄位，以及可選的預設色。',
  'colorPicker.examples.basic.description':
    '表單需要 hex 顏色、又不想自幹選擇器時，使用 sanring-color-picker。',
  'colorPicker.usage.description':
    '匯入 ColorPickerComponent，並用 valueChange 或 Angular 表單綁值。值一律是小寫 #rrggbb。',
  'colorPicker.installation.description':
    '安裝 color-picker，會一併帶入 popover、input 與 field。用 ariaLabel 或 ariaLabelledBy 幫 trigger 命名。',
  'colorPicker.demo.swatches': '預設色',
  'colorPicker.demo.disabled': '停用',
  'colorPicker.demo.field': '搭配 Field',
  'colorPicker.demo.brand': '品牌色',
  'colorPicker.demo.locked': '鎖定顏色',
  'colorPicker.examples.swatches.description': '傳入 swatches 顯示預設色塊。3 碼 hex 會展開成 #rrggbb。',
  'colorPicker.examples.field.description':
    '把 sanring-color-picker 包在 sanring-field 裡，並綁定 reactive form control。',
  'colorPicker.api.description': 'sanring-color-picker 支援的 Inputs 與 Outputs。',
  'colorPicker.api.class.description': '與 host 合併的額外 class。',
  'colorPicker.api.id.description': 'Trigger 的 id，預設會自動產生。',
  'colorPicker.api.value.description': '目前顏色，接受 #rgb 或 #rrggbb，儲存與送出皆為小寫 #rrggbb。',
  'colorPicker.api.disabled.description': '停用 trigger 與 popover 內的控制項。',
  'colorPicker.api.invalid.description': '不依賴 Angular 表單，直接把 trigger 標成無效。',
  'colorPicker.api.required.description': '標成必填，供 sanring-field 使用。',
  'colorPicker.api.swatches.description': '可選的預設 hex 顏色，會以色塊顯示在 popover 裡。',
  'colorPicker.api.valueChange.description': '使用者互動後送出下一個 #rrggbb。',
  'colorPicker.api.ariaLabel.description': '沒有可見標籤時，trigger 使用的可存取名稱。',
  'colorPicker.api.ariaLabelledBy.description': '用來命名 trigger 的可見 label 元素 id。',
  'colorPicker.api.ariaDescribedBy.description': '描述這個控制項的輔助文字元素 id。',
  'colorPicker.api.colorInputLabel.description': 'popover 裡原生顏色輸入的可存取名稱。',
  'colorPicker.api.hexInputLabel.description': 'popover 裡 hex 文字欄的可存取名稱。',
  'colorPicker.accessibility.description':
    "Trigger 是帶 aria-haspopup='dialog' 的按鈕。面板是 role='dialog'。原生顏色與 hex 欄位各自有名稱。預設色塊使用 aria-pressed。搭配 sanring-field 可自動完成 aria-describedby 的串接。",
  'colorPicker.keyboard.description':
    '從 trigger 打開 popover，再用 Tab 走過原生顏色輸入、hex 欄位與預設色。',
  'colorPicker.keyboard.enterSpace': '在 trigger 上打開或關閉 popover。',
  'colorPicker.keyboard.escape': '關閉 popover。',
  'colorPicker.keyboard.tab': '焦點依序走過 trigger，再走進 popover 控制項。',
  'colorPicker.stateModel.description':
    '實作 ControlValueAccessor。使用 [(ngModel)] 或 formControl。值型別：string。無效 hex 會留在草稿，失焦時還原；3 碼 hex 會展開成 #rrggbb。',
} as const;
