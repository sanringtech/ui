export const toggleTranslations = {
  'toggle.description': '可切換開關狀態的雙態按鈕，支援 WAI-ARIA aria-pressed 屬性。',
  'toggle.examples.basic.description': '預設狀態下的 toggle 按鈕。',
  'toggle.usage.description': '匯入 ToggleDirective，並將 sanringToggle 套用到 <button> 元素。',
  'toggle.installation.description': '用 CLI 加入這個元件，再匯入 ToggleDirective。',
  'toggle.examples.description': '適用於工具列、篩選器與設定的常見 toggle 模式。',
  'toggle.demo.outline': 'Outline',
  'toggle.demo.withText': '含文字',
  'toggle.demo.size': '尺寸',
  'toggle.demo.disabled': '停用',
  'toggle.demo.bold': '粗體',
  'toggle.demo.italic': '斜體',
  'toggle.demo.underline': '底線',
  'toggle.api.description': 'sanringToggle 指令支援的 input 與 model。',
  'toggle.api.class.description': '與基本 toggle 樣式合併的額外 class。',
  'toggle.api.variant.description': "視覺樣式：'default'（ghost）或 'outline'（有邊框）。",
  'toggle.api.size.description': "按鈕尺寸：'sm'、'md'（預設）或 'lg'。",
  'toggle.api.pressed.description': '是否處於啟用狀態，支援 [(pressed)] 雙向綁定。',
  'toggle.api.disabled.description': '停用 toggle，阻止任何互動。',
  'toggle.accessibility.description':
    '使用原生 button 並同步 aria-pressed。純圖示 toggle 需要 aria-label，讓輔助科技能辨識切換的是哪個設定。',
  'toggle.keyboard.description':
    'Toggle 保留原生 button 的焦點與啟用語意，同時更新 aria-pressed。',
  'toggle.keyboard.enterSpace': '啟用按鈕，並切換 pressed 狀態。',
  'toggle.keyboard.tabShiftTab': '依文件順序移入或移出 toggle 焦點。',
  'toggle.stateModel.description':
    'pressed 是 directive 的 model 狀態，支援 [(pressed)]。disabled 阻止狀態切換；variant、size 與 class 僅控制樣式。',
} as const;
