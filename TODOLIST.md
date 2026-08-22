# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P11 — 品質關卡類(優先度較低,長期補強)

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
- Block 分兩類,架構不同:**shell**(包住整個 app 的持久性 chrome,例如 `layout/dashboard-shell`,包一個 `<ng-content>`/router-outlet,不是「一頁內容」)與 **page**(一頁完整內容組合,裝進某個 route)

**頁面類型與元件組合**(2026-08-22 盤點,已對照現有 52 個 component 逐一核對,全部可用現有元件組成,沒有缺元件擋路,不必先補元件才能動工):

- `layout/dashboard-shell`(shell):`sidebar` + `dropdown-menu`(user menu)+ `avatar` + `breadcrumb` + `badge`
- `auth/login`(page):`card` + `field` + `input` + `label` + `button` + `checkbox`(remember me)+ `link`(forgot password)+ `divider`(or)+ `alert`(錯誤訊息)
- `auth/register`(page):同 login + `select`(可選:角色/國家)
- `auth/forgot-password`(page):`card` + `field` + `input` + `button` + `alert`
- `layout/settings-page`(page):`tabs`(分區)+ `field` + `input` + `avatar`(頭像上傳)+ `switch` + `select` + `divider` + `button` + `alert-dialog`(刪除確認)
- `data/table-page`(page):`table` + `pagination` + `input`(搜尋)+ `select`(篩選)+ `dropdown-menu`(列操作)+ `checkbox`(批次選取)+ `badge`(狀態)+ `sheet`(新增/編輯抽屜)+ `skeleton` + `toast`
- `content/detail-page`(page):`card` + `avatar` + `badge` + `tabs` + `breadcrumb` + `timeline` + `tag`
- `form/wizard`(page):`stepper` + `field` + `input` + `select` + `date-picker` + `radio` + `file-upload` + `button` + `progress`
- `billing/pricing-page`(page):`card` + `badge` + `table` + `toggle`(月/年切換)+ `button` + `tag`

**起手三個**(驗證 CLI 機制,而非追求覆蓋率):`layout/dashboard-shell`(驗證 shell 型 block 的安裝機制跟一般 component block 不同)、`auth/login`(元件最單純,驗證 `blocks/` 目錄結構/`registry.json` blocks schema/CLI routing 三件事都跑得通)、`data/table-page`(驗證單一 block 內多個子元件互相協作的複雜組合)。其餘六個(`register`、`forgot-password`、`settings-page`、`detail-page`、`wizard`、`pricing-page`)待前三個跑通機制後再逐步擴充。

**成本**:高。單個 block 的設計/實作本身不難,但要做出夠多、夠有代表性的 blocks 讓功能有意義,需要持續投入。先做上述 3 個驗證 CLI 流程,再逐步擴充其餘 6 個。

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
