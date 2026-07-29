export const alertDialogTranslations = {
  'alertDialog.description':
    '用於破壞性或重要操作的強制確認對話框。與 Dialog 不同，無法透過點擊背景或按 Escape 關閉。',
  'alertDialog.demo.open': '刪除帳號',
  'alertDialog.demo.cancel': '取消',
  'alertDialog.demo.action': '刪除',
  'alertDialog.demo.customResultTitle': '移除項目',
  'alertDialog.demo.customResult': '自訂結果值',
  'alertDialog.demo.mediaTitle': '分享專案',
  'alertDialog.demo.mediaDescription': '擁有連結的任何人都能檢視並編輯此專案。',
  'alertDialog.demo.share': '分享',
  'alertDialog.examples.description': '需要使用者做出明確選擇才會關閉的確認流程。',
  'alertDialog.examples.basic.description':
    '用 `sanringAlertDialogTrigger` 綁定，並用 `AlertDialogContent`、`DialogHeader`/`DialogFooter`、title、description 與 action/cancel directive 組合對話框內容。',
  'alertDialog.usage.description':
    '匯入 alert dialog primitives，將 `sanringAlertDialogTrigger` 綁到 `ng-template`，裡面搭配 `sanringAlertDialogCancel` 與 `sanringAlertDialogAction`。',
  'alertDialog.installation.description':
    'Alert Dialog 建立在 Dialog 之上——安裝時也會一併安裝它依賴的 Dialog primitives。',
  'alertDialog.composition.description':
    '`AlertDialogContent` 繼承自 `DialogContent`，預設隱藏關閉按鈕。搭配 `DialogHeader`、選用的 `DialogMedia` 圖示、`sanringDialogTitle`、`sanringDialogDescription`、`DialogFooter`、`sanringAlertDialogCancel` 與 `sanringAlertDialogAction` 使用。',
  'alertDialog.api.description': 'Alert Dialog primitives 支援的 Inputs。',
  'alertDialog.api.trigger.description': '觸發時要在 alert dialog 內算繪的 template。',
  'alertDialog.api.triggerConfig.description':
    '選用、會合併進開啟設定的 CDK `DialogConfig`。不論這裡傳什麼，`role` 與 `disableClose` 一律鎖定不會被覆寫。',
  'alertDialog.api.class.description': '與 `AlertDialogContent` 版面樣式合併的額外 class。',
  'alertDialog.api.showClose.description':
    '控制是否顯示內建關閉按鈕。預設為 `false`，與 Dialog 不同。',
  'alertDialog.api.action.description':
    '點擊時傳給 `DialogRef.close()` 的選用結果值，預設為 `true`。',
  'alertDialog.api.cancel.description':
    '點擊時傳給 `DialogRef.close()` 的選用結果值，預設為 `false`。',
} as const;
