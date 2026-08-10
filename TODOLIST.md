# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P9 — `sanring build`(讓第三方產出相容 registry.json)

- [ ] `sanring build [--source ./components] [--out ./dist-registry]` 指令:掃描第三方自己的 Angular component 目錄,自動推斷 `files`/`componentDeps`/`peerDependencies`,輸出標準 `Registry` schema

**現況**:`registries` alias → URL 設定與 `sanring add alias:componentName` 語法已完成(見 [DEVLOG.md](DEVLOG.md) 的 P9 段落),使用者現在可以手動維護自己的 `registry.json` 並透過 alias 安裝。缺的是「自動產生 registry.json」這一步——第三方目前得照 `Registry` schema 手寫,容易漏 `componentDeps`/`peerDependencies`。

**待做前提**:[ADR-0001](.claude/adrs/0001-multi-registry-support.md) 已把這個指令標為批次 D、預設暫停,先決條件是花 1 天做 TypeScript AST 解析(`ts-morph`/compiler API/babel)可行性 spike,確認能否從 barrel export 可靠推斷 component 間依賴,再另立 `.claude/charters/p9-sanring-build.md`。

---

## P11 — 品質關卡類(優先度較低,長期補強)

- [ ] Docs 站補 light/dark theme accessibility smoke test,至少覆蓋 component 頁面的標題、說明文字、tabs、installation/code block、copy buttons 與 focus ring,確認文字對比、可讀性與鍵盤操作都通過
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

---

## P14 — CVA adapter 重複邏輯尚未收斂

- [ ] 9 個表單元件(`checkbox`/`switch`/`radio-group`/`slider`/`otp-input`/`date-picker`/`calendar`/`file-upload`/`combobox`)各自重複一份幾乎逐字相同的 `XxxFieldControlAdapter` + CVA state-bridge 邏輯(約 500–600 行複製貼上),`shared/` 目錄目前沒有對應抽象

**現況**:OnPush 清理、CDK Overlay 生命週期共用、`resizable` 型別斷言三項已修完(見 [DEVLOG.md](DEVLOG.md) 的 P14 段落),僅剩這項。範圍最大,建議等有新表單元件加入或有明確 bug/效能動機時再做,不建議純粹為了 DRY 就大動表單核心邏輯。

**成本**:高。牽涉 9 個檔案的表單核心邏輯,改完要重新驗證每個元件的 Angular Forms 整合沒有壞掉。

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

## P22 — Docs component 頁面加入 StackBlitz 快捷連結

- [ ] 每個 component 頁面的 code previewer 旁加一個「Open in StackBlitz」按鈕,讓使用者不用本地安裝就能試用

**現況**:Docs 的 code previewer 是靜態展示,使用者若想動手試要先本地建好 Angular 專案並跑完 `sanring init` + `sanring add`。

**差異**:這裡的目標是「一鍵開啟含有該元件的最小 Angular 專案」,而非在 docs 頁面內嵌入可編輯 editor(已確認 shadcn 自己的 docs 也不這樣做,兩邊打平)。StackBlitz 支援從 URL params 或 POST 預填專案內容,可以把 component 程式碼預先注入。

**成本**:中。StackBlitz SDK 有 `sdk.openProject()` API,需要為每個元件準備一份最小化的 Angular 專案 template + 注入對應的元件程式碼。可以先做成通用 template,再逐元件補範例程式碼。
