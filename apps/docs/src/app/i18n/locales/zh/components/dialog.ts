export const dialogTranslations = {
  'dialog.description':
    '建立在 Angular CDK Dialog 上的 overlay primitive，適合 modal 任務與聚焦決策。',
  'dialog.demo.open': '開啟對話框',
  'dialog.demo.customClose': '自訂關閉按鈕',
  'dialog.demo.media': '包含媒體',
  'dialog.demo.configResult': '設定與結果',
  'dialog.demo.noClose': '沒有關閉按鈕',
  'dialog.demo.stickyFooter': '固定頁尾',
  'dialog.demo.scrollable': '可捲動內容',
  'dialog.examples.description':
    '常見 Dialog 模式，包含自訂操作、隱藏關閉控制、固定操作區與大量可捲動內容。',
  'dialog.examples.basic.description':
    '使用 trigger 綁定 ng-template，並用 content、header、title、description、footer primitives 組合內容。',
  'dialog.usage.description':
    '匯入 Dialog primitives，並將 sanringDialogTrigger 綁定到 ng-template。',
  'dialog.installation.description':
    'Dialog 基於 Angular CDK Dialog。用 CLI 加入這個元件，再組合對應 primitives。',
  'dialog.composition.description':
    '使用 DialogContent 建立 panel，DialogHeader/DialogFooter 管理版面，選用 DialogMedia 強化重點，並透過 sanringDialogTrigger/sanringDialogClose 處理設定與關閉結果。',
  'dialog.api.description': 'Dialog primitives 支援的 Inputs。',
  'dialog.api.class.description': '與 DialogContent 版面樣式合併的額外 class。',
  'dialog.api.showClose.description': '控制是否渲染內建關閉按鈕。',
  'dialog.api.triggerConfig.description':
    'sanringDialogTrigger 開啟 template 時傳入的 CDK DialogConfig。',
  'dialog.api.closeResult.description': 'sanringDialogClose 關閉 dialog 時送出的選填結果值。',
  'dialog.api.mediaClass.description': '與 dialog media 容器合併的額外 class。',
} as const;
