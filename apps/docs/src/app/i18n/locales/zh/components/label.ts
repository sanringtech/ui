export const labelTranslations = {
  'label.description': '用於原生 label 的樣式 directive，適合可存取表單標籤與欄位說明。',
  'label.demo.withInput': '搭配輸入框',
  'label.demo.disabled': '停用狀態',
  'label.examples.description': '常見 label 模式，適合獨立標籤與表單控制項。',
  'label.examples.basic.description':
    '將 sanringLabel 套用到原生 label，保留 for/id 的可存取關聯。',
  'label.usage.description': '匯入 LabelDirective，並將 sanringLabel 套用到 label。',
  'label.installation.description':
    '在原生 label 元素上使用 sanringLabel，並透過 for 與 id 連接控制項。',
  'label.composition.description':
    '將 Label 放在 Input 附近的 grid 或 field wrapper 中；peer-disabled 樣式會回應停用控制項。',
  'label.api.description': 'sanringLabel directive 支援的 Inputs。',
  'label.api.class.description': '與基礎標籤文字樣式合併的額外 class。',
  'label.accessibility.description':
    '保留原生 label 語意。請使用 for/id 連接控制項，或把控制項放在 label 內，讓點擊與輔助科技名稱都能正確運作。',
  'label.stateModel.description':
    '無內部狀態。sanringLabel 只提供樣式；disabled 與 validation 狀態由關聯控制項或外層 Field 管理。',
} as const;
