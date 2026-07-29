export const introTranslations = {
  'intro.page.description':
    'Angular 元件 primitives、文件與 registry 工作流，提供可組合且能被產品團隊掌握的建構模組。',
  'intro.whatIs.title': 'Sanring UI 是什麼？',
  'intro.whatIs.body':
    'Sanring UI 是 source-first 的 Angular 元件系統。你可以用文件檢查行為與 API，接著透過 CLI 把需要的元件複製進自己的專案——不用裝套件，也不用依賴版本號。',
  'intro.coverage.title': '目前覆蓋範圍',
  'intro.coverage.components.title': '已文件化元件',
  'intro.coverage.components.description':
    '文件站已涵蓋基礎控制、表單、overlay、導覽、回饋訊息、日期選取與資料呈現 primitives。',
  'intro.coverage.groups.title': '主要分類',
  'intro.coverage.groups.description':
    '目前聚焦在 controls、overlays、data display，以及 layout/navigation。',
  'intro.coverage.next.title': '待補文件缺口',
  'intro.coverage.next.description':
    'Context Menu 已具備 package source，並在 roadmap 追蹤為下一個要補齊的 docs gap。',
  'intro.requirements.title': '需求',
  'intro.installation.title': '安裝',
  'intro.installation.body':
    'Sanring UI 不是一個 npm 套件，沒有「npm install」這回事。元件原始碼會透過 CLI 直接複製進你的專案，一開始就是你自己的程式碼：',
  'intro.installation.tailwind':
    '接著匯入產生的 theme 檔，並讓 Tailwind 掃描你本地的元件原始碼。在你的 CSS 入口檔加入以下設定：',
  'intro.firstComponent.title': '加入第一個元件',
  'intro.firstComponent.body':
    '建議先從 Button 開始：它沒有額外 peer dependencies，而且能立刻看到樣式是否生效。加入後，將 ButtonDirective 放進實際使用處的 standalone imports 陣列。',

} as const;
