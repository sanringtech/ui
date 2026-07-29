export const fieldTranslations = {
  'field.description':
    '表單組合 primitive——sanring-field 把 label、control、description、error message 包在一起，統一處理排版、ARIA 綁定，以及 Angular Forms 的驗證狀態。',
  'field.demo.floating': 'Floating label',
  'field.demo.validation': '驗證狀態',
  'field.demo.disabled': '禁用狀態',
  'field.examples.description': 'Field 常見用法：floating label、驗證狀態、禁用控制項。',
  'field.examples.basic.description':
    '把 label、control、description 包進 sanring-field——label 的 for 屬性、control 的 aria-describedby 都會自動接好。',
  'field.usage.description':
    '匯入 SanringFieldComponent 以及你需要的部件，組合進 <sanring-field> 裡即可。',
  'field.installation.description':
    '執行 sanring add field，或是安裝任何依賴它的控制項（例如 Input）時會自動一併裝好。',
  'field.composition.description':
    'Field 只負責排版跟接線，本身不會渲染任何控制項。投影一個 label、一個實作 SanringFieldControl 的控制項（目前是 InputDirective）、可選的 description，跟可選的 error message。',
  'field.api.description': 'sanring-field 以及它搭配的指令所支援的輸入項。',
  'field.api.floating.description': '讓 label 浮到控制項上方，而不是疊在上面。',
  'field.api.labelClass.description': '會跟 label 的基礎樣式合併的額外 class。',
  'field.api.descriptionClass.description': '會跟 description 的基礎樣式合併的額外 class。',
  'field.api.errorMessageClass.description': '會跟 error message 的基礎樣式合併的額外 class。',
} as const;
