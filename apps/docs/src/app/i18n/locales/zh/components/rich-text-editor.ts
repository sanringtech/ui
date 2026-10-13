export const richTextEditorTranslations = {
  'richTextEditor.description': '以 Tiptap 為基礎的富文本編輯器，可直接接上 Angular 表單與 sanring-field。',
  'richTextEditor.examples.basic.description':
    '綁定 FormControl<string>，以 HTML 讀寫內容。空白文件會回傳空字串，因此 Validators.required 能正常運作。',
  'richTextEditor.usage.description':
    '匯入 RichTextEditorComponent，用 formControl 或 ngModel 綁定。請用 ariaLabel 或 ariaLabelledBy 提供無障礙名稱。',
  'richTextEditor.installation.description':
    'sanring add 會以 peer dependency 安裝 @tiptap/core、@tiptap/pm、@tiptap/starter-kit 與 @tiptap/extensions。Tiptap 在瀏覽器中以動態 import() 載入，不會進入初始 bundle（有用到編輯器的頁面約增加 106 kB gzip）。值是原始 HTML，儲存或渲染前請在伺服器端 sanitize。',
  'richTextEditor.composition.description':
    '根元件持有 Tiptap editor，其他部件都透過 context 讀取，所以只放需要的部件即可。工具列項目可以包在 sanring-tooltip 裡，或用 sanring-divider 分隔。放在工具列以外的部件（例如字數統計）會顯示在編輯區下方。',
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
    '可編輯區帶有 role="textbox" 與 aria-multiline="true"。aria-invalid、aria-required、aria-disabled 與 aria-describedby 會跟隨綁定的表單控制項與 sanring-field。Tiptap 載入期間，元件會設定 aria-busy="true" 並顯示骨架。placeholder 同時設為 aria-placeholder。唯讀時設定 aria-readonly="true"，且仍在 Tab 順序中，方便選取與複製文字。字數統計透過 aria-live="polite" 宣告。',
  'richTextEditor.keyboard.description': '標準文字編輯按鍵，以及 Tiptap StarterKit 快捷鍵。',
  'richTextEditor.keyboard.tab': '將焦點移入或移出編輯器。',
  'richTextEditor.keyboard.marks': '切換選取範圍的粗體、斜體或底線。',
  'richTextEditor.keyboard.history': '復原或重做上一個變更。',
  'richTextEditor.stateModel.description':
    'ControlValueAccessor。值為 HTML 字串，空白文件為 ""。由表單寫入的值不會再回傳。沒有 [(value)] model，請使用 formControl 或 ngModel。',
  'richTextEditor.api.toggle.description':
    '把按鈕變成標記或區塊的切換鈕，帶有按下狀態。沿用 sanringToggle 樣式，可照常傳 size 與 variant。',
  'richTextEditor.api.action.description':
    '把按鈕變成單次執行的指令。沿用 sanringBtn 樣式，工具列建議用 variant="ghost" size="icon"。',
  'richTextEditor.api.levels.description':
    'sanring-rich-text-editor-heading-menu 在「段落」之後提供的標題層級。',
  'richTextEditor.api.orientation.description':
    'sanring-rich-text-editor-toolbar 的排列方向，以及方向鍵移動的軸向。',
  'richTextEditor.keyboard.arrows':
    '在工具列中於可用按鈕間移動，會跳過 disabled 的按鈕。',
  'richTextEditor.keyboard.homeEnd':
    '在工具列中跳到第一個或最後一個可用按鈕。',
  'richTextEditor.api.readonly.description': '內容可選取、複製，但不能修改。工具列按鈕仍會顯示，但全部 disabled。',
  'richTextEditor.api.placeholder.description': '文件為空時顯示的提示文字，同時設為 aria-placeholder。',
  'richTextEditor.api.maxCharacters.description':
    '字元上限。輸入到上限即停止，貼上的文字會截到剛好符合上限。表單寫入的值超過上限時會完整顯示，不會截斷。',
  'richTextEditor.api.characterCount.description':
    '顯示字元數；有設定 maxCharacters 時顯示「字數/上限」。內容超過上限時改用錯誤色。',
  'richTextEditor.demo.characterCount': 'Placeholder 與字數統計',
  'richTextEditor.demo.characterCount.description':
    '設定 placeholder 與 maxCharacters，並把 sanring-rich-text-editor-character-count 放進編輯器裡。表單寫入的值若已超過上限會原樣保留，字數改為紅色，只能刪減。',
  'richTextEditor.demo.readonly': '唯讀',
  'richTextEditor.demo.readonly.description': 'readonly 時內容仍可選取與複製，工具列保留在原位，按鈕全部 disabled。',
} as const;
