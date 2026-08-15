# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P29 — Docs visual refresh 三階段整理 / 翻新 / 收斂

目標是把 docs 站從目前偏保守、偏死板的技術文件介面,推進成更現代、精緻、可掃描的產品文件體驗。前置提交已先整理 `apps/docs` 的 visual system、docs semantic tokens、shell/page surfaces 與部分頁面樣式。**Phase 1(整理基線)已收斂完成**:open decisions 全部拍板、token 命名清乾淨、頁面矩陣盤點完畢,細節見 `DEVLOG.md`。接下來進入 Phase 2 大幅視覺翻新。

### Phase 2 — 視覺翻新

- [ ] 重新設計 home page 首屏與主要內容節奏:保留 Sanring 的工程感,但提高視覺層次、品牌記憶點與第一眼完成度。~~`.home-particles` 動畫背景~~、~~H1 字級偏離 type scale~~ 兩個稽核發現的具體缺口已修掉(見 `DEVLOG.md`);首屏是否要用 `app-docs-page-header`(規範刻意把 Display 56px 保留給 home H1、跟 DocsPageHeaderComponent 的 Page title 36px 分開),以及整體節奏/品牌記憶點的完整重新設計,還沒動
- [ ] 翻新 long-form docs pages:introduction、CLI、registry、MCP、theming、roadmap、changelog 使用一致的 page header、section rhythm、callout/list/card 語言。結構面已對齊(page matrix audit 確認),數值規範(字級/間距對照 Type Scale/Spacing 表格)已全面稽核並修完 4 處真的偏離,見 `DEVLOG.md`;**還沒做的**是超出「符合規範」以外、真正讓這些頁面更精緻好掃描的視覺提升,這塊需要實際肉眼比對,不是靠讀 code 能完成
- [ ] 翻新 component docs:component page header、examples、installation、API table、recent changes 的視覺層次與掃描效率。結構面與數值規範都已稽核過(見 `DEVLOG.md`,含全站共用的 `docs-page-header`/`component-page-recent-changes` 修正);跟上一項一樣,視覺提升本身需要肉眼驗證才能動
- [ ] `component-page-recent-changes.component.ts` 面板 padding(`p-6`/`p-4`)待決:它用 `--sanring-radius-lg`(Radius 表定義給 major/hero panel 用),照這個推論該套 Hero panel padding(28-36px 桌機/20px 手機),但規範文字又明講這區塊是「supporting surface, not the main page ending」「Keep compact rows」,傾向該更收斂,兩個訊號互相矛盾,沒有站得住腳的單一結論,不要自己選一邊套上去(H2 字級那個已經修好,見 `DEVLOG.md`,不是同一種情況——那個有足夠證據可以判斷)
- [ ] `roadmap-page.component.ts` 5 處章節說明段落用 `text-sm`(14px, Small 角色),其他 long-form 頁同角色內容一律用 `text-base`(16px, Body)——14px 本身合法,但這是「這裡的內容算 Small 還是 Body」的角色歸屬判斷,不是數字亂填,需要決定要不要統一

### Phase 3 — 重構與驗證收斂

- [ ] 將已證明穩定的重複 layout 抽成 docs-only Angular component,避免頁面模板持續複製長串 class
- [ ] 補 docs visual QA checklist:桌面 `1440px` / `1180px` / `1024px`,手機 `390px` / `360px`,light/dark theme,長 code line,中英文文案長度
- [ ] 建置 Playwright/e2e 基礎設施:查證後確認 repo 內目前完全沒有 playwright config 或既有 e2e 目錄,不是「加測試案例」而已,要先建 test runner + config,再補 screenshot/最小 smoke coverage,至少覆蓋 home、component page、long-form docs page、mobile shell 與 theme toggle
- [ ] 跑 build/lint/test 後再拆分 commit:整理基線、視覺翻新、重構驗證分開提交,避免之後 review 時混在一起
- [ ] 將完成項目的查證、決策與驗證結果移到 `DEVLOG.md`,並同步必要的方向性摘要到 `ROADMAP.md`

---

## P27 — CLI command UX / robustness 補強

針對 `packages/cli/src/commands/*` 逐一掃描後列出的待補項目。現況不是缺少核心 command，而是部分 command 的責任邊界、失敗狀態與 CI/agent 可讀性還可以再收斂。

### 整體流程

- [ ] 重新定義 CLI 對外主流程並同步 help/README/docs：`init`/`add` 是安裝流程，`info`/`list`/`search` 是探索流程，`diff`/`migrate`/`update`/`doctor` 是維護流程，`build` 是 registry 發布流程，`mcp` 是 agent 入口；npm README 只展示主流程，完整 flags 移到 docs
- [ ] 補 `--json` 給 CI/agent 常用 command：至少 `doctor`、`diff`、`build --dry-run/--check`、`list --outdated`，避免只能解析人類可讀輸出
- [ ] 把 registry 完整性檢查抽成共用工具：schema、componentDeps/sharedDeps dangling reference、registry file 是否存在/可 fetch、peer dependency version 是否可解析，供 `doctor`、`build`、CI 與 MCP 重用
- [ ] 將 `fetchRegistry`/`fetchFile` 底層錯誤改成 throw typed error，由 command 層決定怎麼印訊息與 exit；目前 `registry.ts` 內部 `die()` 直接 `process.exit(1)`，對測試與 MCP server reuse 都不理想

### 各 command 弱點

- [ ] `init`：重跑時目前只提示 `sanring.config.json already exists`，但仍會直接覆寫 config；補明確確認或 `--force` 語意，並確保 theme/dependency 失敗時不留下半初始化狀態
- [ ] `init`：base dependency install 失敗只 warning，後續仍顯示 Done；調整 summary，把「已寫檔但依賴未安裝」列成 warning 並給可複製的修復命令
- [ ] `add`：`--diff` 與 `diff` 的比較邏輯重疊，且目前逐檔 await fetch；抽成共用 diff engine，讓 `add --diff`、`diff`、`update` 使用一致分類與 bounded concurrency
- [ ] `add`：`--dry-run` 主要看 registry metadata，沒有驗證 registry file 真的可 fetch；補 `--check` 或 dry-run fetch validation，避免實際安裝時才發現缺檔
- [ ] `add`：peer dependency install 失敗後檔案已寫入且 config 仍可能更新；補 transaction-like summary，或把「source files written / peer deps failed」狀態明確記錄並引導 `doctor`
- [ ] `remove`：刪 component 目錄時會整個 `rm -r`，若使用者在該 component 目錄加入自有檔案也會被刪；改成只刪 registry-tracked files，或在刪除前列出 extra files 並要求確認
- [ ] `remove`：目前只 prune `installedHashes`，沒有同步移除 `installedVersions`；補清理邏輯，尤其要涵蓋 `alias:component` key
- [ ] `remove`：補 `--dry-run`，先列出會刪的 component files、會保留的 shared files、被 dependents 擋下的項目
- [ ] `diff`：指定未知 component 時只印錯誤但最後可能 success exit；改成 unknown target 一律 exit 1，`--exit-code` 只控制「有差異」的 exit behavior
- [ ] `diff`：補 summary-only / json mode，避免大型 component diff 在 CI 或 agent output 裡過度冗長
- [ ] `update`：指定未知或未安裝 component 時目前偏向 skip，需統一 exit code 規則；未知 target 應失敗，未安裝 target 可提示 `sanring add`
- [ ] `update`：和 `diff` 共用 target/job 建立邏輯，避免 theme/shared/component file 集合規則日後分歧
- [ ] `doctor`：補 registry integrity checks、peer dependency missing/outdated checks、`defaultRegistry` 是否存在於 `registries`、legacy `installedVersions` key 是否需要 migration
- [ ] `doctor`：補 `--fix` 或至少 `--json`；`--fix` 可先只處理安全項目，例如 backfill missing hashes、清理不存在檔案的 hash、migrate installedVersions key
- [ ] `build`：補 `--check`，只掃描/驗證/檢查 peer deps/檢查輸出一致性，不寫檔，給 CI 使用
- [ ] `build`：目前輸出 shared description 為空且不支援 groups metadata；評估加入可選 manifest，讓第三方 registry 能補 description、groups、since、migrations 等人工 metadata
- [ ] `build`：確認 nested files / 同名 basename 是否會碰撞；目前輸出路徑用 `basename(file)`，若 component 內有子目錄或同名檔案會有風險
- [ ] `info`：component 模式未支援 `alias:component` 語法，與 `add` 的 multi-registry 使用方式不一致；補 parse 或明確禁止並提示 `--registry`
- [ ] `info`：`getCliVersion` 與 MCP 內部重複實作，改用 `utils.getCliVersion()`
- [ ] `list`：`--registry` help 寫 `custom registry URL`，但實作可接 local path；統一為 `custom registry (URL or local path)`
- [ ] `list --installed`：目前靠 component 目錄掃描，不看 `installedVersions` alias key；評估是否以 config 為主、目錄為輔，讓 multi-registry 狀態更準
- [ ] `search`：目前只有 substring ranking；元件變多後補 fuzzy/token ranking、category/tag filter 與 `--json`
- [ ] `migrate`：目前用 `installedVersions` key 直接查 registry component name，`alias:component` 會被當成不存在；先 parse alias key，再對 bare component name 查 registry
- [ ] `migrate`：`noData` result 型別目前未實際產生；補 legacy/no baseline 情境或移除 dead branch
- [ ] `mcp`：registry cache 沒有 refresh/invalidate；長時間 agent session 可能看不到 registry 更新，補 refresh tool 或 TTL
- [ ] `mcp`：目前 agent 只能 list/search/info/plan/add，缺 `diff`、`doctor`、`migrate`/`update` 的安全入口；補 read-only 檢查工具，再評估是否開放更新工具

---

## P28 — P14 CVA 重構未套用到 `packages/ui`

- [ ] `packages/ui` 的 9 個表單元件（`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`）補做 P14 第二批重構：改成 `extends SanringCvaBase`，跟 `registry/` 對齊，徹底消除架構分岔

**現況**：P14 第二批重構（`a9cb0fd`）只實際套用在 `registry/shared/cva-base.ts` + `registry/components/*`，`packages/ui` 的對應 9 個元件從未跟進，兩邊架構自此分岔——`packages/ui` 還是舊的手刻 `XxxFieldControlAdapter`。**根因（驗證缺口）已解決**：新增 `packages/cli/scripts/check-registry-parity.mjs`（已掛進 `.github/workflows/registry-sync-check.yml`），靜態比對 `packages/ui` 與 `registry/` 每個同名元件檔案的 `input()`/`output()`/`model()` 宣告 + a11y 相關 attribute binding 表達式（`aria-*`/`role`/`disabled`/`tabindex`/`id`）。跑起來後除了 `/audit-component` 已經抓到的 `switch`/`checkbox`/`radio-group` 三筆,又額外挖出四筆獨立的 registry-only regression 並修正：`button`（本次 session 自己 cherry-pick 時漏同步 `role="button"` 修復，外加 `rounded-lg`/硬編碼 destructive 色碼兩個更早的 design token 漂移）、`context-menu-sub-trigger`（漏 `aria-disabled`）、`resizable-handle` + `resizable-group`（整組 `aria-valuenow`/`min`/`max` keyboard-splitter 支援完全沒同步過去）。目前這個腳本是純靜態 regex 比對,不是真的執行 registry 程式碼(嘗試讓 `packages/ui` 的 TestBed 直接 import registry 元件失敗了——Angular 的 build 工具鏈假設單一 project rootDir,跨 project import 會讓 `extends SanringCvaBase` 的型別解析失敗,細節見下方腳本檔頭註解)。剩餘工作(改用 `SanringCvaBase`)是解決架構分岔本身,優先度較低,兩邊行為已經有腳本守著。

---

## P11 — 品質關卡類(優先度較低,長期補強)

- [ ] Docs 站補 light/dark theme accessibility smoke test,至少覆蓋 component 頁面的標題、說明文字、tabs、installation/code block、copy buttons 與 focus ring,確認文字對比、可讀性與鍵盤操作都通過
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

---

## P19 — Blocks:可直接安裝的頁面級組合模板

- [ ] 設計 `blocks/` registry 類別,讓 `sanring add block/dashboard-shell` 可以一次安裝完整頁面片段(login page、settings page、data table page、dashboard layout 等)

**現況**:目前 registry 只有 `components/` 和 `shared/`,沒有 blocks 概念。使用者必須自己把元件組裝成頁面。

**影響**:這是目前與 shadcn 最大的採用體驗差距。開發者的採用決策通常不是「這個 Button 好不好」,而是「我能不能 30 分鐘內搭出一個看起來像樣的登入頁」。Blocks 直接回答這個問題。shadcn blocks 是近兩年對採用率貢獻最大的功能之一。

**實作方向**:

- `registry/blocks/` 目錄,每個 block 是一個 Angular component(可含多個 child component)
- `registry.json` 加入 `blocks` 陣列(類似 `components`),每筆有 `name`、`description`、`componentDeps`、`files`
- CLI 的 `add` 指令識別 `block/` prefix,路由到 blocks registry
- 初始 blocks 建議:`auth/login`、`auth/register`、`layout/dashboard-shell`、`layout/settings-page`

**成本**:高。單個 block 的設計/實作本身不難,但要做出夠多、夠有代表性的 blocks 讓功能有意義,需要持續投入。建議先做 2–3 個 blocks 驗證 CLI 流程,再逐步擴充。

---

## P25 — Registry 生態系擴展（對標 shadcn registry）

目標是把目前「單人自用的 `sanring build`」升級成開放的第三方 registry 生態系，讓任何團隊或套件作者都能發布、搜尋、安裝彼此的元件。

**子項目（依實作順序）**：

- [ ] **Registry Directory**：Docs 站新增第三方 registry 目錄頁，列出社群維護的 registry（類似 shadcn 的 Registry Directory）；初期可由人工審核提交
- [ ] **GitHub Registries**：CLI 支援直接以 `github:<owner>/<repo>` 格式作為 registry source，省去 host 步驟（背後解析為 `https://raw.githubusercontent.com/<owner>/<repo>/main/registry.json`）
- [ ] **Namespaces**：解決多 registry 同名元件衝突，定義 namespace 規則（目前 alias 機制已部分解決，需形式化）
- [ ] **Authentication**：CLI 支援 private registry 的 Bearer token 認證（`sanring.config.json` 加入 `auth` 欄位），讓企業內網或 private GitHub repo 可用
- [ ] **Dynamic Search API**：registry 可選擇暴露搜尋 endpoint（而非只靠靜態 JSON 全量掃描），`sanring search` 優先呼叫 endpoint
- [ ] **API Reference 頁面**：補 `registry.json` 完整 schema 文件（目前 docs registry 頁只有範例，缺欄位定義、型別、必要/選用標記）
- [ ] **Docs 多頁拆分**：registry 頁面從目前的單頁拆成多頁（Introduction、Getting Started、GitHub Registries、Authentication、API Reference 等）

**現況**：目前 registry 頁只有一頁，涵蓋基本的 `sanring build` 工作流程與 `registries` config 設定。CLI 的 multi-registry 支援（alias:name 語法）已完成，但生態系的其餘部分（directory、GitHub source、auth）尚未實作。

**影響**：shadcn 的 registry 生態是目前採用率的核心驅動之一——開發者能找到、安裝、分享社群元件，讓整個 UI library 不只靠官方維護。Angular 生態目前沒有等價物，這是 Sanring 差異化的機會。

**成本**：高。各子項目可獨立交付，建議從 GitHub Registries（低實作成本、高使用者價值）和 API Reference 開始，再推進 Directory 和 Auth。

---

## P22 — Docs component 頁面加入 StackBlitz 快捷連結

- [ ] 每個 component 頁面的 code previewer 旁加一個「Open in StackBlitz」按鈕,讓使用者不用本地安裝就能試用

**現況**:Docs 的 code previewer 是靜態展示,使用者若想動手試要先本地建好 Angular 專案並跑完 `sanring init` + `sanring add`。

**差異**:這裡的目標是「一鍵開啟含有該元件的最小 Angular 專案」,而非在 docs 頁面內嵌入可編輯 editor(已確認 shadcn 自己的 docs 也不這樣做,兩邊打平)。StackBlitz 支援從 URL params 或 POST 預填專案內容,可以把 component 程式碼預先注入。

**成本**:中。StackBlitz SDK 有 `sdk.openProject()` API,需要為每個元件準備一份最小化的 Angular 專案 template + 注入對應的元件程式碼。可以先做成通用 template,再逐元件補範例程式碼。
