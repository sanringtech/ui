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
  'theming.darkMode.title': '暗色 / 亮色模式',
  'theming.darkMode.body':
    "預設為暗色——基礎 :root 區塊定義所有暗色值。亮色模式是 :root[data-theme='light'] 上的淺層覆寫，只需在 <html> 上設定屬性即可切換。",
  'theming.darkMode.note':
    '這與 shadcn/ui 不同——shadcn 在 <body> 加上 .dark class。屬性方式讓你可以將亮暗主題限定在任意子樹，而不只是整份文件。',

} as const;
