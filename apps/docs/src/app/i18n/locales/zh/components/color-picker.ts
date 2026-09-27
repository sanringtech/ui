export const colorPickerTranslations = {
  'colorPicker.description':
    '用來選顏色的表單控制項。Trigger 顯示目前色塊；popover 裡有原生顏色輸入、格式切換、色值欄位、透明度，以及可選的預設色。',
  'colorPicker.examples.basic.description':
    '表單需要顏色、又不想自幹選擇器時，使用 sanring-color-picker。',
  'colorPicker.usage.description':
    '匯入 ColorPickerComponent，並用 valueChange 或 Angular 表單綁值。進來的 hex、rgb、hsl 都會被解析；送出的字串依 format。',
  'colorPicker.installation.description':
    '安裝 color-picker，會一併帶入 popover、input 與 field。用 ariaLabel 或 ariaLabelledBy 幫 trigger 命名。',
  'colorPicker.demo.swatches': '預設色',
  'colorPicker.demo.formats': '格式',
  'colorPicker.demo.disabled': '停用',
  'colorPicker.demo.field': '搭配 Field',
  'colorPicker.demo.brand': '品牌色',
  'colorPicker.demo.locked': '鎖定顏色',
  'colorPicker.examples.swatches.description':
    'swatches 可以是 hex、rgb 或 hsl。選取比的是顏色，不是字串寫法。',
  'colorPicker.examples.formats.description':
    '設 format 可改送 rgb() 或 hsl()。popover 裡也能切格式；有透明度時會變成 8 碼 hex、rgba()，或帶斜線透明度的 hsl()。',
  'colorPicker.examples.field.description':
    '把 sanring-color-picker 包在 sanring-field 裡，並綁定 reactive form control。',
  'colorPicker.api.description': 'sanring-color-picker 支援的 Inputs 與 Outputs。',
  'colorPicker.api.class.description': '與 host 合併的額外 class。',
  'colorPicker.api.id.description': 'Trigger 的 id，預設會自動產生。',
  'colorPicker.api.value.description':
    '目前顏色。接受 #rgb、#rrggbb、#rrggbbaa、rgb()/rgba()、hsl()/hsla()，並依 format 送出。',
  'colorPicker.api.format.description':
    "輸出語法：'hex'、'rgb' 或 'hsl'，預設 hex。切格式會把同一個顏色用新語法再送一次。",
  'colorPicker.api.disabled.description': '停用 trigger 與 popover 內的控制項。',
  'colorPicker.api.invalid.description': '不依賴 Angular 表單，直接把 trigger 標成無效。',
  'colorPicker.api.required.description': '標成必填，供 sanring-field 使用。',
  'colorPicker.api.swatches.description': '可選的預設顏色，會以色塊顯示在 popover 裡。',
  'colorPicker.api.valueChange.description': '使用者互動後送出下一個格式化色值。',
  'colorPicker.api.ariaLabel.description': '沒有可見標籤時，trigger 使用的可存取名稱。',
  'colorPicker.api.ariaLabelledBy.description': '用來命名 trigger 的可見 label 元素 id。',
  'colorPicker.api.ariaDescribedBy.description': '描述這個控制項的輔助文字元素 id。',
  'colorPicker.api.colorInputLabel.description': 'popover 裡原生顏色輸入的可存取名稱。',
  'colorPicker.api.valueInputLabel.description': 'popover 裡色值欄位的可存取名稱。',
  'colorPicker.api.hexInputLabel.description': '可選，覆寫色值欄位的可存取名稱。',
  'colorPicker.api.alphaInputLabel.description': '透明度滑桿的可見與可存取名稱。',
  'colorPicker.api.formatGroupLabel.description': 'hex / rgb / hsl 切換的可存取名稱。',
  'colorPicker.accessibility.description':
    "Trigger 是帶 aria-haspopup='dialog' 的按鈕。面板是 role='dialog'。格式按鈕使用 aria-pressed。原生顏色、色值與透明度各自有名稱。預設色塊使用 aria-pressed。搭配 sanring-field 可自動完成 aria-describedby 的串接。",
  'colorPicker.keyboard.description':
    '從 trigger 打開 popover，再用 Tab 走過格式、原生顏色、透明度、色值與預設色。',
  'colorPicker.keyboard.enterSpace': '在 trigger 上打開或關閉 popover。',
  'colorPicker.keyboard.escape': '關閉 popover。',
  'colorPicker.keyboard.tab': '焦點依序走過 trigger，再走進 popover 控制項。',
  'colorPicker.stateModel.description':
    '實作 ControlValueAccessor。使用 [(ngModel)] 或 formControl。值型別：string。內部模型是 RGBA；format 決定送 hex、rgb() 或 hsl()。透明度小於 1 時送 8 碼 hex、rgba()，或帶斜線透明度的 hsl()。具名色、oklch 與 color-mix() 不會被接受。',
} as const;
