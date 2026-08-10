# 架構補強 Todo List

跳脫 `packages/ui` 元件庫本身,盤點 CLI、CI、docs 站現況後列出的待補項目。依優先順序排列,每項附上現況查證與理由。

只列**尚未完成**的項目。做完的項目——含查證過程、決策理由、驗證方式——記在 [DEVLOG.md](DEVLOG.md),這裡不重複贅述,避免待辦清單被歷史紀錄淹沒;查證後確認「其實不是缺口」的結論也在 DEVLOG.md 備查,避免下次重新調查一次。對外的方向性摘要見 [ROADMAP.md](ROADMAP.md)。項目編號沿用歷史待辦清單的順序,做完的項目移除後編號會留空,不重新排序。

---

## P9 — `sanring build`(讓第三方產出相容 registry.json)

- [x] 批次 A:目錄掃描 + AST import/export 分類(`registry-scan.ts`)
- [ ] 批次 B:peerDependency 遞移閉包去重——**設計本身有問題,見下方說明,需要重新設計或整批拿掉,不是單純續做**
- [ ] 批次 C:`sanring build` 指令本體——程式碼已經寫好(`commands/build.ts`,已註冊進 `index.ts`,`typescript` 已移到 `dependencies`),但驗證用的 golden fixture 測試因為批次 B 的問題目前是 `it.skip`,不能算完成
- [ ] `--source`/`--out`/`--dry-run`/`--name` 之外,README 還沒補 `sanring build` 的使用說明(等批次 B 定案後一起補)

**現況**:`registries` alias → URL 設定與 `sanring add alias:componentName` 語法已完成(見 [DEVLOG.md](DEVLOG.md) 的 P9 段落)。`sanring build` 指令碼骨架跟批次 A 的掃描邏輯都已經做完且有測試覆蓋,但批次 B 的核心演算法被驗證是錯的(見下),導致整個 `sanring build` 目前不能算「可用」。

**批次 B 設計錯誤(2026-08-11 發現)**:[ADR-0001](.claude/adrs/0001-multi-registry-support.md) 的 spike 只抽樣了 8 個元件,從 `calendar` 一個案例就推論出「peerDependency 若已被 componentDeps 上游宣告過,自己不該重複列」的去重規則,並照這個規則實作了 `computeUpstreamPeerCoverage`/`dedupePeerDependencies`。等 P9 batch C 真的用**全部 53 個元件**跑 golden fixture 回歸測試才發現:這個「去重」根本不是普遍慣例——`checkbox`/`input`/`radio`/`select`/`combobox`/`otp-input`/`textarea`/`slider`/`switch`/`file-upload`/`pagination`/`alert-dialog`/`command`(至少 13 個元件)的手寫 `registry.json`,即使 `componentDeps`(`field`/`dialog`)已經宣告過同一個 peer 套件,自己仍然照樣重複列出——這才是多數慣例,`calendar`/`date-picker` 的去重寫法反而是特例。

**下一步**:重新評估批次 B 該怎麼做,目前傾向整個拿掉遞移去重、改成「掃到什麼 peer 套件就照實列」(重複宣告無害,`sanring add` 的 `collectPeerDeps` 本來就是遞移合併),但這個設計決策需要使用者拍板,不能自己直接改——牽涉修改已經 commit 的批次 B 程式碼與其對應 golden fixture 測試(`commands/build.test.ts` 目前用 `it.skip` 卡住,附完整原因註解)。

---

## P24 — registry 內容真實 bug(P9 spike/golden fixture 副產品)

- [ ] `transfer` 元件 4 個檔案(`transfer-action.directive.ts`/`transfer-item.component.ts`/`transfer-header.component.ts`/`transfer-panel.component.ts`)用 `'../../utils'`/`'../component-styles'`,跟其他元件統一的 `'../shared/utils'`/`'../shared/component-styles'` 不一致——使用者跑 `sanring add transfer` 裝出來的檔案,relative import 實際上會指到專案裡不存在的路徑,**編譯會壞**
- [ ] `navigation-menu` 元件:`navigation-menu-sub-trigger.component.ts` 有 `import { LucideChevronRight } from '@lucide/angular'`,但 `registry.json` 沒有把 `@lucide/angular` 列進 `peerDependencies`——沒裝過 lucide-angular 的專案跑 `sanring add navigation-menu` 會建置失敗
- [ ] `accordion` 元件:直接 `import { _IdGenerator } from '@angular/cdk/a11y'`,但 `registry.json` 的 `peerDependencies` 沒有 `@angular/cdk`(只有 `@angular/aria`/`@lucide/angular`)——同樣是裝出來會建置失敗的等級
- [ ] `collapsible` 元件:直接 import `@angular/cdk/a11y`,但 `registry.json` 完全沒有宣告 `peerDependencies`——同上
- [ ] `component-styles` 這個 sharedDep 被過度宣告、實際沒用到,目前確認至少 12 個元件受影響:`tag`/`calendar`/`date-picker`(原本 spike 抓到的 3 個)+ `alert`/`alert-dialog`/`badge`/`breadcrumb`/`card`/`link`/`otp-input`/`tabs`/`tooltip`(用全量 golden fixture 掃描新增發現的 9 個)——無害,但每個都會多裝一個沒用到的檔案
- [ ] **其餘 peerDependencies 落差(`checkbox` 疑似缺 `@angular/cdk`、`select`/`combobox` 疑似缺 `@angular/forms` 等)目前無法準確列出**——因為上面 P9 批次 B 的去重邏輯本身有 bug,現在的掃描結果被那個 bug 污染,同一批元件同時混著「hand-data 真的缺东西」跟「我的去重誤刪」兩種訊號,分不清楚。等批次 B 重新設計/拿掉之後重跑 golden fixture,才能準確列出這部分還有哪些真缺的 peerDependencies。

**現況**:`transfer`/`navigation-menu`/前 3 個 `component-styles` 案例是 P9 batch D spike(8 元件抽樣)當時發現的;`accordion`/`collapsible`/其餘 9 個 `component-styles` 案例是 batch C 用全部 53 個元件跑 golden fixture 回歸測試(2026-08-11)時新增發現的。跟 P9 本身的多 registry 功能無關,是既有元件 registry 資料的既有問題。細節見 [ADR-0001](.claude/adrs/0001-multi-registry-support.md) Notes 段落。

**成本**:前 4 項低——明確的路徑/宣告修正,改完要重新確認對應元件 `sanring add` 安裝後能不能編譯過;`component-styles` 12 項是刪掉多餘宣告,零風險;最後一項要等 P9 批次 B 定案才能動工。

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
