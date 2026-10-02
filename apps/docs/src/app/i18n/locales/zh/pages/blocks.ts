export const blocksTranslations = {
  'blocks.page.description':
    '可一次安裝的頁面級模板。一條指令會把 block 本身與它組合用到的元件一起複製進專案。',
  'blocks.overview.title': '概覽',
  'blocks.overview.body':
    'Blocks 由既有 Sanring 元件組裝而成，不是 UI 套件的一部分——CLI 會把原始碼複製進你的 app，方便直接改。需要明確指定時用 block/ 前綴；名稱不跟元件衝突時也可以直接寫名字。',
  'blocks.catalog.title': '所有 Blocks',
  'blocks.section.scenario': '使用情境',
  'blocks.section.composition': '構成',
  'blocks.section.compositionHint': '會隨 block 透過 componentDeps 一併安裝。點名稱可進該元件頁看 API。',
  'blocks.section.peers': 'Peer dependencies',
  'blocks.section.components': '元件',
  'blocks.section.installation': '安裝',
  'blocks.section.usage': '使用方式',
  'blocks.section.preview': '預覽',
  'blocks.section.notes': '備註',

  'blocks.dashboard.title': 'Dashboard shell',
  'blocks.dashboard.body':
    '持久的 app chrome：側欄、麵包屑、使用者選單。頁面內容用 ng-content 投影進去。',
  'blocks.dashboard.scenario':
    '適合已登入後的標準 app 外框：左側導覽、上方麵包屑、帳號選單；頁面本體放在 router outlet / ng-content。',
  'blocks.dashboard.composition':
    '用 sidebar 做導覽、breadcrumb 顯示位置、avatar + dropdown-menu 做使用者選單，badge 可選顯示導覽計數。',

  'blocks.login.title': '登入頁',
  'blocks.login.body': '含 email、密碼、記住我與錯誤提示的登入卡片。',
  'blocks.login.scenario':
    '適合進入 app shell 之前的獨立登入頁。把 `(submitted)` 接到 auth API，失敗時傳入 `error`。',
  'blocks.login.composition':
    '以 card 包表單：field + input + label 當控制項，checkbox 記住我，alert 顯示錯誤，link / divider 放次要操作，button 送出。',

  'blocks.table.title': '資料表頁',
  'blocks.table.body':
    '含搜尋、狀態篩選、列選取、新增抽屜、loading skeleton 與 toast 的資料表頁。',
  'blocks.table.scenario':
    '適合 CRUD 列表起手：可篩選列、勾選、用 sheet 新增，mutation 後用 toast 回饋。',
  'blocks.table.composition':
    'table + pagination 做表格；input / select / field 做篩選；checkbox 列選取；dropdown-menu 列操作；sheet 新增／編輯；skeleton 載入；badge 狀態；toast 回饋；button 主操作。',

  'blocks.org.title': '組織圖',
  'blocks.org.body':
    '經典組織圖：支援雙主管、虛線匯報、平移縮放，並以目錄樹提供鍵盤選取。',
  'blocks.org.scenario':
    '需要 2D 匯報圖時用（不是單純 ARIA tree）。傳入 people 與 solid／dotted links；畫布與目錄樹的選取會同步。',
  'blocks.org.composition':
    '卡片用 avatar、badge；工具列 button 與 skeleton 處理 chrome／載入。tree 在側邊提供鍵盤導覽。排版由 peer elkjs 在 Web Worker 計算。',
  'blocks.org.notes':
    'elkjs 為 EPL-2.0（worker chunk 約 336 KB transfer）。若 Angular 警告 CommonJS，在 build options 加上 `allowedCommonJsDependencies: ["elkjs"]`。',
} as const;
