export const blocksTranslations = {
  'blocks.page.description':
    '可一次安裝的頁面級模板。一條指令會把 block 本身與它組合用到的元件一起複製進專案。',
  'blocks.overview.title': '概覽',
  'blocks.overview.body':
    'Blocks 由既有 Sanring 元件組裝而成，不是 UI 套件的一部分——CLI 會把原始碼複製進你的 app，方便直接改。需要明確指定時用 block/ 前綴；名稱不跟元件衝突時也可以直接寫名字。',
  'blocks.install.title': '安裝',
  'blocks.dashboard.title': 'Dashboard shell',
  'blocks.dashboard.body':
    '持久的 app chrome：側欄、麵包屑、使用者選單。頁面內容用 ng-content 投影進去。',
  'blocks.login.title': '登入頁',
  'blocks.login.body': '含 email、密碼、記住我與錯誤提示的登入卡片。',
  'blocks.table.title': '資料表頁',
  'blocks.table.body':
    '含搜尋、狀態篩選、列選取、新增抽屜、loading skeleton 與 toast 的資料表頁。',
} as const;
