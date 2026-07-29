export const sliderTranslations = {
  'slider.description': '用於選取數值範圍的控制項，支援 pointer、touch、鍵盤與 Angular 表單。',
  'slider.examples.basic.description':
    '當使用者需要直接調整有上下限的數值時，可以使用 sanring-slider。',
  'slider.usage.description':
    '匯入 SliderComponent，並透過 valueChange 或 Angular 表單接收數值更新。',
  'slider.installation.description':
    '安裝 Slider component，並使用 ariaLabel 或 ariaLabelledBy 提供可存取名稱。',
  'slider.demo.step': '步進',
  'slider.demo.form': '表單欄位',
  'slider.demo.disabled': '停用',
  'slider.demo.volume': '音量',
  'slider.demo.rating': '評分',
  'slider.demo.brightness': '亮度',
  'slider.demo.locked': '鎖定值',
  'slider.demo.field': '搭配 Field',
  'slider.demo.minVolume': '最小音量',
  'slider.demo.fieldError': '音量至少要 80。',
  'slider.examples.field.description':
    '把 sanring-slider 包在 sanring-field 裡並綁定 reactive form control——控制項變成 invalid 且 touched 之後，錯誤訊息會自動顯示。',
  'slider.api.description': 'sanring-slider 支援的 Inputs 與 Outputs。',
  'slider.api.class.description': '與 slider 根元素樣式合併的額外 class。',
  'slider.api.id.description': 'Slider id，預設會自動產生。',
  'slider.api.min.description': '允許的最小值。',
  'slider.api.max.description': '允許的最大值。',
  'slider.api.step.description': '拖曳取整與鍵盤調整時使用的遞增量。',
  'slider.api.value.description': '目前數值。會限制在 min/max 之間，並依 step 對齊。',
  'slider.api.disabled.description': '停用 pointer 與鍵盤互動。',
  'slider.api.valueChange.description': '使用者互動後送出下一個數值。',
  'slider.api.ariaLabel.description': '沒有可見標籤時使用的可存取名稱。',
  'slider.api.ariaLabelledBy.description': '用來命名 slider 的可見 label 元素 id。',
  'slider.api.ariaDescribedBy.description': '描述 slider 的輔助文字元素 id。',
  'slider.api.ariaValueText.description': '當數字本身不夠清楚時使用的人類可讀數值文字。',
} as const;
