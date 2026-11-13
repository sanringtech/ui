export const imageCropperTranslations = {
  'imageCropper.description':
    '用可拖曳、可縮放的框裁切圖片，或固定裁切框、拖動與縮放後面的圖片。旁邊可以放即時預覽，以及 PNG、JPEG、WebP 的輸出格式選擇器，export() 會回傳 File。',
  'imageCropper.examples.basic.description':
    '裁切器顯示圖片與裁切框。預覽與格式選擇器用 [for] 指向它，再呼叫 export() 取得裁切後的 File。',
  'imageCropper.usage.description':
    '匯入 SANRING_IMAGE_CROPPER_IMPORTS。預覽與格式選擇器放在裁切器裡面時會自動找到它；放在其他位置時，用 [for] 傳入 template reference。',
  'imageCropper.installation.description':
    '安裝 image-cropper。沒有第三方依賴：裁切用 canvas，格式支援度在瀏覽器裡偵測。',
  'imageCropper.demo.aspect': '長寬比',
  'imageCropper.demo.avatar': '圓形頭像',
  'imageCropper.demo.upload': '搭配檔案上傳',
  'imageCropper.demo.free': '自由',
  'imageCropper.demo.cropArea': '裁切區域',
  'imageCropper.demo.instructions':
    '用方向鍵移動裁切區域。按住 Alt（Option）加方向鍵調整大小。按住 Shift 一次移動較多。',
  'imageCropper.demo.preview': '裁切預覽',
  'imageCropper.demo.format': '輸出格式',
  'imageCropper.demo.quality': '品質',
  'imageCropper.demo.background': '背景色',
  'imageCropper.demo.unsupported': '此瀏覽器不支援',
  'imageCropper.demo.download': '下載',
  'imageCropper.demo.choose': '選擇圖片',
  'imageCropper.demo.empty': '選一張圖片開始',
  'imageCropper.examples.aspect.description':
    '設定 aspectRatio 鎖定比例。改變比例時，會以目前裁切框的中心重新調整；null 或 "free" 解除鎖定。',
  'imageCropper.examples.avatar.description':
    'shape="circle" 讓裁切框與預覽變圓。設定 outputWidth 後匯出會縮放到該寬度。PNG 與 WebP 的四角保持透明；JPEG 用 background 填色。',
  'imageCropper.examples.upload.description':
    '把 sanring-file-upload 的 File 直接傳給 src。匯出時保留原檔名，副檔名會換成對應的格式。',
  'imageCropper.api.description': 'sanring-image-cropper 的 Inputs、Models 與方法，以及預覽與格式選擇器。',
  'imageCropper.api.class.description': '與 host 合併的額外 class。',
  'imageCropper.api.src.description':
    '要裁切的圖片：File 或 Blob（會自動建立並釋放 object URL）、網址，或 data URL。',
  'imageCropper.api.crop.description':
    '雙向綁定的裁切範圍 { x, y, width, height }，單位是原圖像素。圖片載入時設定，src 改變時重設。',
  'imageCropper.api.aspectRatio.description': '鎖定的寬 ÷ 高。null 或 "free" 不限比例。',
  'imageCropper.api.minSize.description': '裁切框最小寬高，單位是原圖像素。',
  'imageCropper.api.shape.description': "'circle' 讓裁切框與預覽變圓，匯出時裁成橢圓。",
  'imageCropper.api.format.description':
    '雙向綁定的輸出格式。null 時沿用原圖格式（若在可選清單內），否則用第一個可用格式。',
  'imageCropper.api.formats.description': '格式選擇器提供的格式。瀏覽器無法輸出的格式會停用。',
  'imageCropper.api.quality.description': '雙向綁定的壓縮品質，0 到 1，只用於 JPEG 與 WebP。',
  'imageCropper.api.background.description': '雙向綁定，匯出 JPEG 時透明像素的填色。',
  'imageCropper.api.outputWidth.description':
    '把匯出縮放到這個寬度，高度依裁切比例計算。預設以原圖解析度匯出。',
  'imageCropper.api.fileName.description':
    'export() 的檔名。預設用來源 File 的名稱，否則是 "cropped"。副檔名一律依實際輸出格式。',
  'imageCropper.api.crossOrigin.description':
    '遠端網址的 CORS 模式。伺服器必須允許，否則 canvas 受汙染，export() 會失敗。',
  'imageCropper.api.disabled.description': '隱藏把手，忽略指標與鍵盤操作。',
  'imageCropper.api.guides.description': '在裁切框內顯示三分線。',
  'imageCropper.api.loaded.description': '圖片載入後送出原始尺寸。',
  'imageCropper.api.loadError.description': '圖片載入失敗時送出。',
  'imageCropper.api.export.description':
    '把裁切範圍畫到 canvas，回傳 File。若瀏覽器改用其他格式輸出，File 的 type 與副檔名會跟著實際結果。',
  'imageCropper.api.reset.description': '恢復預設的置中裁切框。',
  'imageCropper.api.labels.description': '裁切框的可存取名稱、鍵盤說明與空狀態文字，可覆寫以翻譯。',
  'imageCropper.api.preview.description':
    'sanring-image-cropper-preview：要同步的裁切器，以及它佔用的正方形邊長（px）。裁切結果在框內依比例置中，拖曳時版面不會跳動。',
  'imageCropper.api.formatPicker.description':
    'sanring-image-cropper-format：要控制的裁切器。另有 formatGroupLabel、qualityLabel、backgroundLabel、unsupportedLabel。',
  'imageCropper.accessibility.description':
    "裁切框是可聚焦的 role='group'，名稱來自 cropAreaLabel，aria-describedby 指向鍵盤說明。每次用鍵盤移動或拖曳結束後，polite live region 會念出尺寸與位置。預覽是 role='img'，有自己的名稱。格式按鈕使用 aria-pressed；不支援的格式會停用並附 title。",
  'imageCropper.keyboard.description': '聚焦裁切框後，可用鍵盤移動或調整大小。',
  'imageCropper.keyboard.arrows': '裁切框移動一個螢幕像素。',
  'imageCropper.keyboard.shift': '裁切框移動十個螢幕像素。',
  'imageCropper.keyboard.alt': '調整裁切框大小。左右改寬度，上下改高度；鎖定的長寬比會維持。',
  'imageCropper.stateModel.description':
    '不是表單控制項。crop、format、quality、background 都是雙向 model，原圖不會被修改。只有 export() 會實際編碼，請在使用者確認時呼叫。',
  'imageCropper.demo.panZoom': '拖動與縮放',
  'imageCropper.demo.panZoomInstructions':
    '拖曳圖片移動位置，滾輪或雙指捏合縮放。方向鍵移動圖片，加號、減號縮放，按住 Shift 一次移動較多。',
  'imageCropper.demo.zoom': '縮放',
  'imageCropper.demo.zoomIn': '放大',
  'imageCropper.demo.zoomOut': '縮小',
  'imageCropper.examples.panZoom.description':
    'mode="pan-zoom" 讓裁切框固定、改成移動圖片：滑鼠或單指拖曳移動，滾輪、觸控板或雙指捏合縮放，也可以用縮放滑桿。圖片永遠蓋滿裁切框，匯出不會有空白邊。這是常見的大頭照流程，電腦和手機操作一致。',
  'imageCropper.api.mode.description':
    "'box'：圖片固定，移動、縮放裁切框。'pan-zoom'：裁切框固定，拖動、縮放圖片；需要固定比例，aspectRatio 沒設時用 1。",
  'imageCropper.api.maxZoom.description': '只用於 pan-zoom：最大縮放倍數。1 是剛好容納整張圖的裁切範圍。',
  'imageCropper.api.zoom.description':
    '目前的縮放倍數（1 = 整張圖剛好放進框裡）與設定縮放的方法，可指定以原圖像素為單位的錨點。範圍限制在 1 到 maxZoom。',
  'imageCropper.api.zoomControl.description':
    'sanring-image-cropper-zoom：pan-zoom 模式用的縮小按鈕、縮放滑桿與放大按鈕。滑桿以 aria-valuetext 報讀百分比。',
  'imageCropper.keyboard.panArrows': 'pan-zoom 模式下移動圖片 8 個螢幕像素（按住 Shift 為 40）。',
  'imageCropper.keyboard.panZoom': 'pan-zoom 模式下放大或縮小 10%（按住 Shift 為 50%）。',
} as const;
