export const richTextEditorTranslations = {
  'richTextEditor.description': '以 Tiptap 為基礎的富文本編輯器，可直接接上 Angular 表單與 sanring-field。',
  'richTextEditor.examples.basic.description':
    '綁定 FormControl<string>，以 HTML 讀寫內容。空白文件會回傳空字串，因此 Validators.required 能正常運作。',
  'richTextEditor.usage.description':
    '匯入 RichTextEditorComponent，用 formControl 或 ngModel 綁定。請用 ariaLabel 或 ariaLabelledBy 提供無障礙名稱。',
  'richTextEditor.installation.description':
    'sanring add 會以 peer dependency 安裝 @tiptap/core、@tiptap/pm 與 @tiptap/starter-kit。Tiptap 在瀏覽器中以動態 import() 載入，不會進入初始 bundle（有用到編輯器的頁面約增加 106 kB gzip）。值是原始 HTML，儲存或渲染前請在伺服器端 sanitize。',
  'richTextEditor.api.description': 'sanring-rich-text-editor 的 Inputs 與 Outputs。',
  'richTextEditor.api.id.description': '可編輯區的 id，未提供時自動產生。',
  'richTextEditor.api.class.description': '與編輯器外框樣式合併的額外 class。',
  'richTextEditor.api.contentClass.description': '套用在可編輯內容區的額外 class。',
  'richTextEditor.api.disabled.description': '讓編輯器不可編輯並降低透明度，會與綁定表單控制項的 disabled 狀態合併。',
  'richTextEditor.api.required.description': '設定 aria-required。綁定的控制項有 Validators.required 時效果相同。',
  'richTextEditor.api.ariaLabel.description': '可編輯區的無障礙名稱。',
  'richTextEditor.api.ariaLabelledBy.description':
    '用來命名可編輯區的可見 label id。請搭配 <label sanringLabel id="…">，因為 <label for> 無法標記 contenteditable 元素。',
  'richTextEditor.api.ariaDescribedBy.description': '額外的描述 id，會與 sanring-field 註冊的 id 合併。',
  'richTextEditor.api.extensions.description': '額外的開源 Tiptap 擴充，只在建立編輯器時讀取一次。',
  'richTextEditor.api.editorReady.description': 'Tiptap Editor 在瀏覽器載入完成後送出該實例。',
  'richTextEditor.accessibility.description':
    '可編輯區帶有 role="textbox" 與 aria-multiline="true"。aria-invalid、aria-required、aria-disabled 與 aria-describedby 會跟隨綁定的表單控制項與 sanring-field。Tiptap 載入期間，元件會設定 aria-busy="true" 並顯示骨架。',
  'richTextEditor.keyboard.description': '標準文字編輯按鍵，以及 Tiptap StarterKit 快捷鍵。',
  'richTextEditor.keyboard.tab': '將焦點移入或移出編輯器。',
  'richTextEditor.keyboard.marks': '切換選取範圍的粗體、斜體或底線。',
  'richTextEditor.keyboard.history': '復原或重做上一個變更。',
  'richTextEditor.stateModel.description':
    'ControlValueAccessor。值為 HTML 字串，空白文件為 ""。由表單寫入的值不會再回傳。沒有 [(value)] model，請使用 formControl 或 ngModel。',
} as const;
