# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

---

## P0 — PR 沒有測試/型別檢查關卡

- [x] 新增 PR 觸發的 CI workflow,跑 `pnpm test`、`tsc --noEmit`、`pnpm lint`

**現況**:`.github/workflows/` 目前只有 4 個 workflow——`registry-sync-check`(檢查 docs 導覽跟 `registry.json` 對不對得上)、`require-changeset`(檢查有沒有補 changeset)、`release`、`deploy-docs`(只在 push 到 `main` 時觸發)。**沒有任何一個 PR 觸發的 workflow 會跑 `ng test`、`tsc --noEmit`、或 `eslint`。**

**風險**:PR 只要沒漏測 changeset、沒改到 docs-navigation 對不上 registry,測試是紅的、型別是錯的照樣能顯示綠勾勾、直接合併進 `main`。`deploy-docs.yml` 雖然會跑 `ng build docs`(能抓到型別錯誤),但那是**合併之後**才跑,已經太晚。

**成本**:低,一個新 workflow 檔案,約半小時工。

---

## P1 — docs 站沒有搜尋功能

- [ ] 幫 docs 站加上搜尋(至少支援元件名稱/描述搜尋,理想上做成 Cmd+K 面板)

**現況**:`apps/docs/src/app` 底下找不到任何搜尋元件,使用者要找元件只能靠側邊導覽樹狀點選。CLI 本身其實已經有 `sanring search` 指令(依名稱/描述搜尋元件),但這個能力沒有對應到 docs 網站上。

**對比**:shadcn 文件站有很顯眼的 Cmd+K 搜尋。

---

## P2 — 沒有 MCP server 整合

- [ ] 評估幫 `@sanring/cli` 加上 MCP server 支援,讓 Claude Code / Cursor 等 AI agent 能直接查詢、安裝元件

**現況**:`packages/cli/src` 裡沒有任何 MCP 相關程式碼。

**對比**:shadcn 這一兩年加了 MCP 整合,AI coding agent 可以透過 MCP protocol 直接跟 registry 互動,不用手動下 shell 指令。跟目前透過 Claude Code 使用這個專案的情境直接相關。

---

## P3 — 沒有自訂/第三方 registry 支援

- [ ] 評估支援 `@namespace/component` 語法 + `sanring build` 指令,讓團隊可以架自己的私有 registry

**現況**:`registry.ts` 沒有 namespace 概念,`packages/cli/src/commands/` 沒有 `build` 指令。目前 CLI 只認一個寫死的 registry 來源。

**對比**:shadcn 支援混用官方 registry + 團隊自己的私有 registry。優先度較低,除非近期有多團隊/多產品線共用元件庫的需求才需要拉高。

---

## P4 — `sanring init` 沒有 monorepo/workspace 偵測

- [ ] 評估 `init` 指令加上 monorepo 結構偵測與對應處理邏輯

**現況**:`init.ts` 沒有 `monorepo`/`workspace`/`nx.json`/`pnpm-workspace` 相關的偵測邏輯,目前假設單一 Angular 專案。

**對比**:shadcn 的 `init` 會自動判斷 Next.js/Vite/Remix、偵測 monorepo 結構分別處理。

---

## P5 — 品質關卡類(優先度較低,長期補強)

- [ ] 自動化 a11y 測試(如 axe-core),目前 UI library 完全沒有無障礙迴歸的自動把關,只能靠人工肉眼抓
- [ ] 視覺回歸測試(如 Chromatic / Playwright screenshot),CSS 改動有沒有意外破壞其他元件外觀,現在沒有自動偵測
- [ ] CLI 補真正的 e2e 測試(拉一個全新 Angular 專案、真的跑 `sanring add`、真的 `ng build`)——現有的 `add.test.ts`/`doctor.test.ts` 等是對假的檔案系統 mock 驗證邏輯,不是「CLI 真的能在使用者機器上跑起來」的保證

---

## 查證後確認「不算差距」的項目(備查,避免重複討論)

- **可編輯 playground(Monaco/StackBlitz 匯出)**:查證後 shadcn 自己的元件文件頁也是「靜態 demo + 程式碼區塊」,沒有即時可編輯的 playground,兩邊打平,不是缺口。
- **文件版本切換(per-CLI-version docs)**:shadcn 文件站同樣沒有明顯的版本切換機制,兩邊打平,不是缺口。
