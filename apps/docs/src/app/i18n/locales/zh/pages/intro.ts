export const introTranslations = {
  'intro.page.description':
    'Source-first Angular UI primitives。先在文件確認行為與 API，再把需要的元件複製進自己的專案。',
  'intro.actions.start': '開始使用 CLI',
  'intro.actions.example': '查看 Button 範例',
  'intro.whatIs.title': 'Sanring UI 是什麼？',
  'intro.whatIs.body':
    'Sanring UI 是一套面向 Angular app 的 source-first 元件系統。它提供可組合的 primitives、清楚的互動文件與 registry 工作流，讓團隊能用自己的程式碼維護 UI，而不是把關鍵介面綁死在黑箱套件版本上。',
  'intro.whatIs.noteTitle': '不是傳統 npm UI 套件。',
  'intro.whatIs.noteBody':
    '元件會被 CLI 複製到你的 repository，之後可依產品需求調整、審查與版本控制。',
  'intro.sourceFirst.title': '為什麼 source-first？',
  'intro.sourceFirst.own.title': 'Own the code',
  'intro.sourceFirst.own.description':
    '安裝後元件就是專案原始碼的一部分。團隊可以用自己的 review、測試與 release 流程管理它。',
  'intro.sourceFirst.compose.title': 'Composable primitives',
  'intro.sourceFirst.compose.description':
    '元件偏向小而可組合的 building blocks，適合表單、overlay、導覽與資料密集介面。',
  'intro.sourceFirst.inspect.title': 'Docs before install',
  'intro.sourceFirst.inspect.description':
    '每個元件頁都先交代 usage、API、鍵盤操作、無障礙與狀態模型，再決定是否加入專案。',
  'intro.quickStart.title': 'Quick Start',
  'intro.quickStart.body':
    '先初始化 registry 設定，再加入第一個元件。Button 是最適合確認樣式與 CLI 流程的起點。',
  'intro.quickStart.tailwind':
    '接著匯入產生的 theme 檔，並讓 Tailwind 掃描本地元件原始碼。在 CSS 入口檔加入：',
  'intro.quickStart.import':
    '最後把元件放進真實介面。第一個範例應該讓你立刻確認按鈕樣式、hover/focus 狀態與 Angular standalone import 都正常：',
  'intro.quickStart.expectedTitle': '預期結果：',
  'intro.quickStart.expectedBody':
    '頁面上會出現一顆套用 Sanring 樣式的 Button；如果 hover、focus 與間距都正常，代表 theme 與元件 source 已接上。',
  'intro.requirements.title': '需求',
  'intro.next.title': '下一步',
  'intro.next.components.title': '瀏覽元件',
  'intro.next.components.description':
    '從 Button、Field、Dialog、Select 等頁面查看實際範例、API 與狀態模型。',
  'intro.next.cli.title': '了解 CLI 工作流',
  'intro.next.cli.description':
    '查看 init、add、diff、update 等命令，以及如何在 CI 或 agent 工作流中檢查 registry 差異。',
  'intro.next.theming.title': '設定主題',
  'intro.next.theming.description':
    '了解 sanring-theme.css、CSS variables 與 Tailwind v4 source 掃描如何一起工作。',
} as const;
