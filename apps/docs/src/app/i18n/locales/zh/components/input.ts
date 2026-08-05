export const inputTranslations = {
  'input.description': '用於原生 input 與 file 欄位的表單控制項樣式 directive。',
  'input.demo.floating': '浮動標籤',
  'input.demo.disabled': '停用',
  'input.demo.file': '檔案上傳',
  'input.demo.validation': '驗證狀態',
  'input.examples.description': '常見輸入模式，適合文字欄位、停用狀態與檔案上傳。',
  'input.examples.basic.description':
    '將 sanringInput 套用到原生 input，保留瀏覽器行為並取得系統樣式。',
  'input.usage.description': '匯入 InputDirective，並將 sanringInput 套用到 input。',
  'input.installation.description':
    '在原生 input 上使用 sanringInput，並保留 type、value、disabled 與表單綁定。',
  'input.composition.description':
    'Input 可搭配 Label 建立可存取表單，也能與 Card、Alert 組成更完整的工作流程。',
  'input.api.description': 'sanringInput directive 支援的 Inputs。',
  'input.api.class.description': '與基礎輸入框樣式合併的額外 class。',
  'input.accessibility.description': '透明的樣式 directive，完整保留原生 <input> 的語意。直接在 input 上使用標準 HTML 屬性 aria-label、aria-labelledby、aria-describedby。搭配 sanring-field 可自動完成 for/id 標籤關聯。',
  'input.keyboard.description': '焦點與所有互動皆遵循瀏覽器原生行為。',
  'input.keyboard.tab': '聚焦至輸入框。',
  'input.keyboard.type': '輸入或編輯文字。',
  'input.stateModel.description': '非 ControlValueAccessor。直接在原生 <input> 元素上使用 [(ngModel)] 或 [formControl] 綁定值。此 directive 僅套用視覺樣式，不持有內部值狀態。',
} as const;
