export const progressTranslations = {
  'progress.description':
    '帶有 WAI-ARIA progressbar 語意的水平進度條，支援閃爍衝刺效果、形狀與顏色客製化。',
  'progress.examples.basic.description': '預設圓角樣式下，進度為 60% 的進度條。',
  'progress.usage.description':
    '匯入 ProgressComponent 並綁定數字 value，Directive 自動處理所有 ARIA 屬性。',
  'progress.installation.description':
    '用 CLI 加入這個元件，再匯入 ProgressComponent 或 ProgressDirective。',
  'progress.examples.description': '以三個實例回答三個問題：閃爍效果、形狀變體、顏色客製化。',
  'progress.demo.shimmer': '閃爍衝刺效果',
  'progress.demo.shimmerDescription':
    '如同 skeleton 的 pulse，shimmer 在進度條填滿過程中由左向右掃過，讓使用者感知進度正在衝刺。',
  'progress.demo.shape': '形狀',
  'progress.demo.shapeDescription':
    '透過 shape 在圓角（pill）、方形（flat）、梯形（angled）之間切換，全部走 cn() 合併，可再疊加 class 覆蓋。',
  'progress.demo.rounded': '圓角',
  'progress.demo.square': '方形',
  'progress.demo.trapezoid': '梯形',
  'progress.demo.color': '顏色',
  'progress.demo.colorDescription':
    '三層顏色控制：預設 CSS 變數、單實例 CSS 變數覆蓋、barClass Tailwind class 覆蓋。',
  'progress.demo.defaultColor': '預設（CSS 變數）',
  'progress.demo.cssVarOverride': 'CSS 變數覆蓋',
  'progress.demo.classOverride': 'barClass 覆蓋',
  'progress.api.description': 'sanring-progress 支援的 inputs。',
  'progress.api.class.description': '套用到 track 容器的額外 class。',
  'progress.api.barClass.description': '套用到填充 bar 的額外 class，適合單次顏色覆蓋。',
  'progress.api.value.description': '當前進度值。',
  'progress.api.max.description': '最大值，預設 100。',
  'progress.api.shape.description':
    "進度條形狀：'rounded'（圓角，預設）、'square'（方形）、'trapezoid'（梯形）。",
  'progress.api.shimmer.description': '在填充 bar 上啟用掃光閃爍動畫，標示進度正在進行。',
  'progress.api.ariaLabel.description': '進度條的無障礙標籤，建議在沒有可見標籤時提供。',
  'progress.api.ariaValueText.description':
    '取代原始百分比朗讀的可讀文字，例如「已完成 5 步驟中的 3 步」。',
  'progress.accessibility.description':
    "具有 role='progressbar'、aria-valuenow、aria-valuemin（0）、aria-valuemax（max input，預設 100）。提供 ariaLabel 或指向可見標籤的 aria-labelledby，以說明正在測量的內容。使用 ariaValueText 提供人類可讀的格式，例如「已完成 3 / 5 步驟」。",
  'progress.keyboard.description': '不可聚焦，沒有鍵盤互動。',
  'progress.stateModel.description':
    '透過 value input 控制（0 至 max）。省略 value 或傳入 null 可切換為不確定狀態（啟用 shimmer 時顯示掃光動畫）。',
} as const;
