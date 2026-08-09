export const themingTranslations = {
  'theming.page.description':
    'Sanring UI 如何處理顏色、字型與間距，以及如何為你的品牌進行客製化覆寫。',
  'theming.tokens.title': '設計 Token',
  'theming.tokens.body':
    'Sanring UI 透過 CSS 自訂屬性（--sanring-*）暴露內部設計值，元件直接引用這些變數。執行 sanring init 會自動產生 src/sanring-theme.css 並寫入完整預設值，你只需 @import 進全域樣式；之後在 :root 覆寫任一變數，所有元件同步更新。',
  'theming.tailwind.title': 'Tailwind v4 整合',
  'theming.tailwind.body':
    'Tailwind v4 從 CSS 中的 @theme 區塊讀取 token 值。使用 @theme inline 可讓 var() 參考在執行期保持活躍，亮暗主題切換無需重新 build。',
  'theming.tailwind.note':
    'inline 關鍵字是關鍵差異——缺少它，Tailwind 會在 build 時一次性解析變數值，亮暗切換就會失效。@source 路徑應同時包含 package source 與 CLI 複製出的本機 component path。',
  'theming.brand.title': '自訂品牌',
  'theming.brand.body':
    '在 :root 中覆寫任何 --sanring-* token，元件立即反映新值，不需更改任何設定檔。',
  'theming.playground.title': '主題產生器',
  'theming.playground.body':
    '用常見介面狀態即時預覽 token 組合，調好後複製 CSS 覆寫到你的全域樣式。',
  'theming.playground.radius': '圓角',
  'theming.playground.copy': '複製 CSS',
  'theming.playground.previewTitle': '介面預覽',
  'theming.playground.previewDescription':
    '同一組 token 會同步影響 surface、文字、邊框與互動狀態。',
  'theming.playground.cardTitle': '工作區設定',
  'theming.playground.cardBody':
    '確認主要操作、次要按鈕、輔助文字與程式碼區塊在目前主題下仍然清楚可讀。',
  'theming.playground.formNote': '輸入框、進度列與狀態提示會沿用同一組語意 token。',
  'theming.darkMode.title': '暗色 / 亮色模式',
  'theming.darkMode.body':
    "預設為暗色——基礎 :root 區塊定義所有暗色值。亮色模式是 :root[data-theme='light'] 上的淺層覆寫，只需在 <html> 上設定屬性即可切換。",
  'theming.darkMode.note':
    '這與 shadcn/ui 不同——shadcn 在 <body> 加上 .dark class。屬性方式讓你可以將亮暗主題限定在任意子樹，而不只是整份文件。',
  'theming.presets.title': '具名主題預設',
  'theming.presets.body':
    '執行 sanring init 時加上 --theme，就能從一組具名預設出發，不用逐一手動改 token。預設值會接在基礎 token 後面，只需覆寫有變動的部分，其餘沿用預設值。',
  'theming.presets.note':
    '預設只是一個起點，不是綁定——產生出來的檔案就是專案裡一份普通的 CSS 檔，之後仍然可以手動繼續調整。',
} as const;
