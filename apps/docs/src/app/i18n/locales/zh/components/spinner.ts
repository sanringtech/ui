export const spinnerTranslations = {
  'spinner.description':
    '輕量動態載入指示器，提供三種圖示變體、四種尺寸，並透過 Tailwind text 工具全面控制顏色。',
  'spinner.examples.basic.description': '預設 loader 圖示、中尺寸的 spinner。',
  'spinner.usage.description':
    '匯入 SpinnerComponent 並直接放置 sanring-spinner，透過 Tailwind 文字色彩與尺寸工具調整外觀。',
  'spinner.installation.description': '用 CLI 加入這個元件，再匯入 SpinnerComponent。',
  'spinner.examples.description':
    '涵蓋變體、尺寸、顏色、行內標籤與按鈕載入狀態的常見 spinner 模式。',
  'spinner.demo.variant': '變體',
  'spinner.demo.size': '尺寸',
  'spinner.demo.color': '顏色',
  'spinner.demo.withLabel': '含標籤',
  'spinner.demo.inButton': '按鈕中',
  'spinner.demo.loading': '載入中…',
  'spinner.demo.saving': '儲存中…',
  'spinner.demo.speed': '旋轉速度',
  'spinner.api.description': 'sanring-spinner 支援的 inputs。',
  'spinner.api.speed.description':
    "旋轉速度：'slow'（2 秒）、'normal'（1 秒，預設）或 'fast'（0.5 秒）。直接組合完整 animation 值，無 cascade 順序問題。",
  'spinner.api.variant.description':
    "圖示樣式：'loader'（虛線圓，預設）、'loader-circle'（缺口圓弧）或 'pinwheel'（風車）。",
  'spinner.api.size.description':
    "圖示大小：'sm'（16px）、'md'（20px，預設）、'lg'（24px）或 'xl'（32px）。",
  'spinner.api.class.description':
    '合併到 host 元素的額外 class，使用 Tailwind text-* 工具改變顏色。',
  'spinner.api.ariaLabel.description': "螢幕閱讀器播報的無障礙標籤，預設 'Loading'。",

} as const;
