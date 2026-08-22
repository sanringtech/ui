# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P29 — Docs visual refresh 三階段整理 / 翻新 / 收斂

目標是把 docs 站從目前偏保守、偏死板的技術文件介面,推進成更現代、精緻、可掃描的產品文件體驗。前置提交已先整理 `apps/docs` 的 visual system、docs semantic tokens、shell/page surfaces 與部分頁面樣式。**Phase 1(整理基線)、Phase 2(視覺翻新裡所有能用規則/數字/codebase 先例客觀驗證的部分)、Phase 3(重構與驗證收斂)都已收斂完成**,細節見 `DEVLOG.md`。

### Phase 4 — 視覺精修與 Sanring 風格差異化

Phase 4 已解封:Playwright 截圖 + `Read` 工具可以實際檢視 home(light/dark/mobile)、component page、long-form pages 的畫面。前一輪基準快照沒有抓到明顯 bug,所以 Phase 4 不是修壞掉的畫面,而是進入「有方向的重新設計」:讓 Sanring 跟原生 shadcn 的極簡灰階文件感拉開差距,建立更高辨識度的工程產品語言。

**設計判斷**:這裡跟原本 Phase 2 不重複。Phase 2 已處理「符合規範」與可客觀驗證的部分;Phase 4 處理的是超出規範以外的品牌辨識度、視覺記憶點與掃描體驗。原本列在 Phase 4 的三個大項保留為 epic,下面新增具體可執行拆解。

#### Direction — 視覺定位

- [x] 定義 Sanring docs 的視覺 thesis:`compact engineering control surface for installing, inspecting, and composing Angular UI primitives`
- [x] 避免走 shadcn clone 路線:不以大留白、黑白灰、單純 code preview card 作為主要記憶點
- [x] 建立 Sanring 專屬視覺語彙:CLI command center、registry nodes、component dependency graph、token mapping、install result timeline、agent-readable status
- [x] 保持專業工具感:radius 維持俐落(`6px`/`8px`/少量 `12px`),避免過度柔和、大圓角、大陰影、行銷式漸層

#### Home — 首屏與首頁節奏

- [x] 重新設計 home page 首屏與主要內容節奏:保留 Sanring 的工程感,但提高視覺層次、品牌記憶點與第一眼完成度。首屏是否要用 `app-docs-page-header` 不是卡點:規範刻意把 Display `56px` 保留給 home H1,跟 DocsPageHeaderComponent 的 Page title `36px` 分開
- [x] 首版方向已撤回:registry / CLI command center 曾完成驗證,但不符合使用者對首頁整體的期待,保留於 `DEVLOG.md` 作為歷史紀錄
- [x] 第二版方向已撤回:移除 command center 後改成產品入口 / 系統導覽 / 元件索引 / 文件探索的首頁方案,仍被使用者判定視覺方向很差,不得作為後續依據
- [x] 重新盤點首頁資訊架構:首屏聚焦 source-first 主張與 source composition 證據,中段呈現三個工程原則,再進入 Components 探索與文件 CTA,避免 Components / Registry / CLI 資訊重複或互相搶層級
- [x] 重新提出至少一版更大幅度的首頁視覺方向:採開放式 editorial hero + 完整 source composition panel,不沿用產品入口 / 系統導覽配置,也沒有把 `Curated component entry points` 的語彙擴張成整頁
- [x] 保留並重新安置使用者目前唯一認可的 `Curated component entry points` 區塊:作為首頁主要探索區,位於工程證據之後、收束 CTA 之前
- [x] 驗證重做後的首頁在 light/dark/mobile 狀態下沒有導覽、排版或主題切換回歸

#### Long-form Docs — 內容頁視覺提升

- [x] 翻新 long-form docs pages(introduction、CLI、registry、MCP、theming、roadmap、changelog):超出「符合規範」以外、真正讓頁面更精緻好掃描的視覺提升
- [x] CLI page 使用 command groups、流程線、exit state、dry-run/result summary,讓頁面像可操作的 CLI 參考面板
- [x] Registry page 使用 registry schema、source graph、component/shared/block 分區,強化 Sanring registry-first 的產品差異
- [x] MCP page 使用 agent tool map、read/write boundary、safe operation flow,呈現 agent-ready 的工作方式
- [x] Theming page 使用 token cascade、light/dark comparison、semantic token map,把主題系統做成可理解的視覺模型
- [x] Changelog page 往 release console / timeline 方向調整,比普通 news feed 更像工程釋出紀錄

#### Component Docs — 掃描效率與工程證據

- [x] 翻新 component docs:component page header、examples、installation、API table、recent changes 超出「符合規範」以外的視覺層次與掃描效率提升
- [x] Component header 補強工程 metadata 呈現:registry name、install command、package path、stability/status、updated/recent changes affordance
- [x] Example previewer 強化 Preview / Code / Install / API 的切換與視覺階層,讓使用者更快定位可複製資訊
- [x] API table 朝 dense reference surface 調整:提高欄位掃描效率,但保留 mobile card layout 的可讀性
- [x] Recent changes 改成 compact release strip,避免像頁尾附錄
- [x] 補一致的 evidence chips:a11y、keyboard support、controlled/uncontrolled、SSR/browser-only、registry deps 等,把 Sanring 的工程品質變成可見資產

#### Verification — 視覺驗證

- [x] 每次 Phase 4 改動後用 Playwright 重拍 home light/dark/mobile、代表性 long-form page、代表性 component page
- [x] 檢查 `360px` / `390px` 無水平 overflow,長 command/code line 不撐破版面,中英文文案長度不互相遮擋
- [x] 完成後將具體設計決策、截圖觀察與驗證結果同步到 `DEVLOG.md`

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
