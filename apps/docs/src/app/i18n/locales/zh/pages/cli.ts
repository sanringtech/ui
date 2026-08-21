export const cliTranslations = {
  'cli.page.description':
    '一個命令列工具，能直接把 Sanring UI 元件的原始碼複製進你的專案——順便處理依賴安裝，程式碼完全歸你掌控。',
  'cli.overview.title': '概覽',
  'cli.overview.body':
    '@sanring/cli 套件讀取跟這個文件站相同的元件 registry，指令依照工作流程的階段分組：init 與 add 負責安裝元件；info、list、search 幫你探索有哪些可用元件；diff、migrate、update、doctor 負責維護已安裝的元件。build（發布 registry）與 mcp（AI agent 入口）各自有獨立頁面——見側邊欄的 Registry 與 MCP。建議每個指令都用 npx 執行，隨時拿到最新版本。',
  'cli.init.title': 'init',
  'cli.init.body':
    '每個專案只需執行一次。會確認目前是否在 Angular 專案中，寫入 sanring.config.json 記錄你選擇的元件路徑，產生 src/sanring-theme.css（所有元件都會讀取的 --sanring-* 設計 token，已存在則預設跳過以保護你的客製化），並安裝基礎的 peer dependencies（clsx、tailwind-merge）。',
  'cli.add.title': 'add',
  'cli.add.body':
    '把一個或多個元件的原始碼複製進你的專案，並安裝缺少的 peer dependencies。想做最小的第一次安裝時，建議先從 button 開始；若元件需要額外套件，CLI 會自動一併安裝。加上 --dry-run 可以在不動任何檔案的情況下預覽哪些檔案會被新增或覆寫，或用 --check 驗證這次安裝需要的每個 registry 檔案都真的抓得到，同樣不寫入任何檔案。用 --diff 可以在安裝前看到逐行差異，或用 --view 直接印出 registry 的原始內容，都不會寫入任何檔案。',
  'cli.remove.title': 'remove',
  'cli.remove.body':
    '移除一個或多個已安裝的元件。如果還有其他已安裝的元件依賴它（例如 tag 還裝著就移除 badge），預設會拒絕移除，除非加上 --force。共用檔案（例如 utils.ts）不會被自動刪除——如果剩下的元件都不再需要某個共用檔案，指令只會列出來提醒你，要刪要留由你自己決定。加上 --dry-run 可以預覽會刪除哪些追蹤中的檔案、會保留哪些檔案、哪些元件被依賴關係擋下，同樣不會實際刪除任何東西。指令別名為 rm。',
  'cli.info.title': 'info',
  'cli.info.body':
    '不帶元件名稱時，無需網路即可顯示專案資訊：CLI 版本、Angular 偵測、設定檔路徑、theme 狀態與已安裝元件清單。帶入元件名稱則顯示該元件的說明、完整會安裝的檔案清單（含自動帶入的相依元件）與 peer dependencies，但不會實際寫入任何檔案。兩種模式都支援 --json，方便 CI 或 coding agent 使用。',
  'cli.diff.title': 'diff',
  'cli.diff.body':
    'Sanring UI 沒有版本概念——元件是複製原始碼，不是 npm 套件——所以沒有自動方式知道本地檔案跟 registry 是否有落差。diff 會把你已安裝的元件與 sanring-theme.css 拿去跟目前的 registry 逐行比對，列出哪些檔案被你客製化過、哪些 registry 端有更新。不帶元件名稱會檢查目前已安裝的全部項目。加上 --exit-code 在有任何檔案落差時以 exit 1 結束，可用來在 CI 中偵測元件版本飄移。用 --summary 只印出統計數字、省略逐行差異，或用 --json 取得機器可讀的摘要。',
  'cli.update.title': 'update',
  'cli.update.body':
    '把 registry 的更新逐一套用到已安裝的檔案。安裝後從未動過的檔案會靜默自動更新；你有客製化的檔案則顯示差異並詢問是否套用。不帶元件名稱會檢查目前已安裝的全部項目。對於 v0.9.0 之前安裝、沒有雜湊基準紀錄的專案，可加上 --trust 讓所有無基準的檔案都視為未曾修改，一次補齊更新。',
  'cli.list.title': 'list',
  'cli.list.body':
    '列出 registry 裡所有可用的元件與其 peer dependencies。加上 -i / --installed 可以只顯示目前專案已安裝的元件，或用 --outdated 逐一比對已安裝元件與目前 registry，顯示 up-to-date / outdated / has-conflicts 狀態。兩種模式都支援 --json。指令別名為 ls。',
  'cli.search.title': 'search',
  'cli.search.body':
    '用名稱或說明搜尋 registry 中的元件。名稱符合的結果排在說明符合的前面。在 Angular 專案下執行時，已安裝的元件會顯示 ✔ 標記。可用 --group <id> 或 --tag <tag> 過濾結果，或加上 --json 取得機器可讀輸出。',
  'cli.doctor.title': 'doctor',
  'cli.doctor.body':
    '檢查你的環境與專案設定是否有常見問題：Node.js 版本、Angular 專案偵測、sanring.config.json 是否存在、theme 檔案是否存在、每個檔案的雜湊完整性（未修改 / 已客製化 / 孤立雜湊）、registry 連線能力，以及 registry.json 本身是否有 componentDeps/sharedDeps 的懸空引用。加上 --offline 可跳過網路檢查，--json 取得機器可讀輸出，或 --fix 套用安全的自動修復（補齊缺少的雜湊、清掉孤立雜湊、遷移舊版 installedVersions key）。有嚴重錯誤時以 exit 1 結束，可作為 CI 就緒檢查閘門。',
  'cli.migrate.title': 'migrate',
  'cli.migrate.body':
    '比對每個已安裝元件記錄的版本與目前 registry 的遷移紀錄，印出需要手動處理的破壞性變更步驟。不帶元件名稱會檢查目前已安裝的全部項目。加上 --check 在有任何元件需要遷移時以 exit 1 結束、不印出詳細步驟，適合在合併 registry/CLI 升版前當作 CI 閘門。',
  'cli.requirements.title': '需求',
  'cli.requirements.body':
    'CLI 需要在 Angular 專案根目錄執行。使用前請確認專案已符合以下版本與樣式設定。',

} as const;
