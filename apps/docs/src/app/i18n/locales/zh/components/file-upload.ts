export const fileUploadTranslations = {
  'fileUpload.description':
    '支援拖放、驗證、並相容 ControlValueAccessor 的 headless 檔案選取控制項。',
  'fileUpload.examples.basic.description':
    '在 sanring-file-upload 裡組合 dropzone 與 trigger 按鈕——用 ngModel 或 reactive form control 綁定選取的檔案。',
  'fileUpload.usage.description':
    '匯入 FileUploadComponent、FileDropzoneComponent、FileTriggerDirective，並在同一個 sanring-file-upload 容器內組合使用。',
  'fileUpload.api.description': 'sanring-file-upload 元件支援的 inputs 與 models。',
  'fileUpload.api.accept.description':
    '允許的檔案類型或副檔名，逗號分隔（例如 "image/*,.pdf"）。預設接受任何檔案。',
  'fileUpload.api.multiple.description': '允許一次選取或拖放多個檔案。',
  'fileUpload.api.disabled.description':
    '停用 dropzone 與 trigger，並反映 reactive forms 呼叫的 setDisabledState()。',
  'fileUpload.api.required.description': '標記為必填，用於 aria-required 與 Field 的錯誤狀態。',
  'fileUpload.api.maxSize.description':
    '單一檔案的最大位元組數。超過此大小的檔案會被拒絕，並透過 rejectedFiles 回報。',
  'fileUpload.api.maxFiles.description': '啟用 multiple 時允許的最大檔案數，超出的檔案會被拒絕。',
  'fileUpload.api.files.description':
    '已選取的檔案。可用 [(files)] 雙向綁定，或透過 ngModel/formControl 綁定。',
  'fileUpload.api.progress.description':
    'sanring-file-item 有一個獨立的 [progress] input（0-100）。FileUploadComponent 本身不處理實際上傳，所以這個值永遠來自你自己的上傳邏輯——傳 null 就會退回顯示檔案大小。',
  'fileUpload.demo.dropzone': 'Dropzone',
  'fileUpload.demo.trigger': '只有 Trigger',
  'fileUpload.demo.progress': '上傳進度',
  'fileUpload.demo.multiple': '多檔案',
  'fileUpload.demo.validation': '驗證',
  'fileUpload.demo.disabled': '停用',
  'fileUpload.demo.field': '搭配 Field',
  'fileUpload.demo.browse': '瀏覽檔案',
  'fileUpload.demo.dropHint': '或拖放到這裡',
  'fileUpload.demo.chooseFile': '選擇檔案',
  'fileUpload.demo.startUpload': '模擬上傳',
  'fileUpload.demo.fieldLabel': '履歷',
  'fileUpload.demo.fieldHint': '僅限 PDF，最大 2MB。',
  'fileUpload.demo.fieldError': '此欄位為必填。',
  'fileUpload.examples.progress.description':
    'sanring-file-item 有個可選的 [progress] input——從你自己的上傳邏輯傳一個 0-100 的數字進去，就會用進度條取代檔案大小顯示；上傳完成後把它設回 null 即可。',
  'fileUpload.accessibility.description': 'aria-invalid、aria-required 與 aria-describedby 會串接到外層的 sanring-field。dropzone 內的原生 <input type="file"> 透過可見的按鈕文字或關聯的 <label> 處理自身的可存取標籤。',
  'fileUpload.keyboard.description': '焦點與觸發皆遵循原生檔案輸入行為。',
  'fileUpload.keyboard.tab': '聚焦至上傳觸發按鈕或拖放區。',
  'fileUpload.keyboard.enterOrSpace': '開啟作業系統的檔案選擇器。',
  'fileUpload.stateModel.description': '實作 ControlValueAccessor。使用 [(ngModel)] 或 formControl，或直接使用可雙向綁定的 [(files)] model input。值型別：File[] | null。檔案驗證（大小、數量、類型）在客戶端執行；被拒絕的檔案透過 rejectedFiles 事件輸出。',
} as const;
