---
schema_version: 1
adr_id: "0003"
title: rich-text-editor-engine
status: Accepted
date: 2026-10-13
deciders: [jack755051]
related: [.claude/prds/rich-text-editor.md, .claude/charters/p34-rich-text-editor.md]
---

# ADR-0003: Rich Text Editor 引擎、載入方式與浮動 UI

## Context

- **觸發事件**：P34 新增 `rich-text-editor` 元件（PRD accepted），需要富文本引擎。`textarea` 只能輸入純文字。
- **既有約束**：
  - `packages/ui` + `registry` 雙份交付，受 `check-registry-parity.mjs` / `check-registry-sync.mjs` 約束；`@sanring/ui` 只有單一 entry（`public-api.ts`），dist 為 `sideEffects: false`，目前 `private` 不發版。
  - 51 個 docs 頁宣告 `ssrSafe: true`，`/audit-component` Phase 1-B 檢查 SSR 安全；repo 內沒有 SSR build 目標。
  - 既有 `popover` 開啟時為 `role="dialog"` 並把焦點移進面板，不適合打字中浮出的選單。
  - 前例：`carousel` → `embla-carousel`（`@sanring/ui` dependencies）；`org-chart` → `elkjs`（ADR-0002，引擎隔離 + spike gate）。

## 候選方案

| 方案 | 授權 | Angular 整合 | 結論 |
|---|---|---|---|
| `@tiptap/core` v3 直接用 | MIT | 自寫薄殼 | ✅ 採用 |
| `ngx-tiptap` | MIT | 社群 wrapper | ❌ 多一層第三方維護風險；消費端不擁有原始碼 |
| ProseMirror 直接用 | MIT | 自寫全部 | ❌ schema / commands / input rules 全要自己做，成本高 |
| Tiptap Pro / Cloud 擴充 | 商業 | — | ❌ registry 消費端無法安裝 |

## Decision

1. **引擎：`@tiptap/*` 3.31.4 開源套件**（`core`、`pm`、`starter-kit`、`extensions`；M2+ 加 `extension-image`、`extension-table`、`extension-mention`、`suggestion`）。所有 `@tiptap/*` 宣告同一範圍 **`^3.31.4`**，一起升級（每個擴充都以 exact 版本 peer 綁定 `core` / `pm`）。
2. **載入方式：在 root 元件內以動態 `import()` 載入 `@tiptap/*`**，`afterNextRender(async () => …)` 中 `Promise.all` 載入後才 `new Editor()`；載入完成前若元件已銷毀則不建立。其他檔案只能 `import type`。理由見 Spike A4：`@tiptap/starter-kit`、`@tiptap/extensions` 沒有 `sideEffects` 欄位，靜態 import 會讓**所有** `@sanring/ui` 消費端的 initial bundle 多約 100 KB transfer，即使沒用到編輯器。
3. **`@sanring/ui` 以 `dependencies` 宣告 `@tiptap/*`**（比照 `embla-carousel`，同步加進 `ng-package.json` 的 `allowedNonPeerDependencies`），單一 entry，不開 secondary entry。registry 以 `peerDependencies` 宣告，由 `sanring add` 安裝。
4. **引擎隔離**：值匯入 `@tiptap/*`（含動態 `import()`）只出現在 root 元件與 extensions 設定檔；子元件透過 `SANRING_RICH_TEXT_EDITOR` context 操作，不持有 `Editor`。
5. **SSR**：server 端不載入、不建立 Editor，只輸出 `aria-busy="true"` 的佔位；瀏覽器 hydrate 後才建立。
6. **浮動 UI：CDK overlay，沿用既有 `MenuOverlayController`**。origin 用 `editor.view.coordsAtPos(from/to)` 組成 `{ x, y, width, height }`。建議在 B/C 把 `open()` 的 origin 型別**加寬**為 `{ x; y; width?; height? }`（純型別、無行為變動）。不用 `@tiptap/extension-bubble-menu`；`@floating-ui/dom` 只作為 `@tiptap/suggestion` 的傳遞 peer 存在（它被靜態 import 且非 optional），我們的程式碼不 import、不用 suggestion 的 `floatingUi` 定位。
7. **CVA 值**：`writeValue` 用 `setContent(html, { emitUpdate: false })`；輸出用 `editor.isEmpty ? '' : editor.getHTML()`（空文件的 `getHTML()` 是 `'<p></p>'`）。
8. **M1 停用 Link**：`StarterKit.configure({ link: false })`（v3 鍵名；undo/redo 的鍵名是 `undoRedo`，不是 v2 的 `history`）。

## Consequences

- ✅ 未使用編輯器的 `@sanring/ui` 消費端 bundle 不受影響（A4 實測回到基準值）。
- ✅ 全部 49 個新增套件為 MIT；`@tiptap/pm` 單一實例。
- ✅ CLI 零改動；`packages/cli/scripts` 零改動。
- ⚠️ 編輯器初始化為非同步：第一次進入使用編輯器的頁面時，多一段 lazy chunk 下載時間，由 skeleton 佔位（PRD §8 loading 態）。單元測試需 `await` 初始化（B1 提供 `whenReady` 類的測試輔助，命名 B1 定案）。
- ⚠️ 使用編輯器的頁面增量：M1 組合約 106 KB transfer、全擴充約 130 KB transfer（docs 實測）。docs 需揭露。
- ⚠️ `@sanring/ui` 消費端無論是否使用編輯器，都會**安裝**（非打包）`@tiptap/*`；`@sanring/ui` 目前 private，影響僅限本 repo。對外發佈時重評。
- ⚠️ `CharacterCount` 的 `autoTrim` 預設 `true`：`writeValue` 傳入超過上限的 HTML 會被**靜默截斷**，control 值與編輯器內容不一致。已拍板（2026-10-13）：設 `autoTrim: false`，超限內容完整顯示並以錯誤色提示，不靜默刪除資料。
- ⚠️ `extension-image` 沒有載入失敗 hook（只有啟用 `resize` NodeView 時才處理 error）。PRD Story 6「圖片載入失敗顯示錯誤樣式」在不寫自訂 NodeView（非範圍）的前提下只能用 CSS 做到有限呈現（PRD §12 新增待決）。
- ⚠️ CDK overlay 的 `keydownEvents()` 會收到 document 上所有按鍵（含在編輯器內打字），bubble / suggestion 的 `onKeydown` 只能處理自己負責的鍵（如 Escape）。
- ⚠️ docs 文章區在內層容器捲動，不是 `window`；C3 需驗證 `reposition` scroll strategy 在該容器下是否跟隨（可能需要 `CdkScrollable`）。

## Spike 結果（批次 A，2026-10-13）

docs 暫時頁 `/spike/rich-text-editor` + 暫時 Playwright spec（皆已移除）；SSR 與 tree-shaking 在 repo 外 scratch 專案驗證（未 commit）。

### A1 生命週期 → 通過

docs app 為 zoneless；元件 OnPush，`onTransaction` 遞增 signal 版本號驅動 `computed`。

| 檢查 | 結果 |
|---|---|
| 輸入後值與字數同步（OnPush） | ✅ |
| toolbar 粗體 `aria-pressed` 隨選取狀態同步 | ✅ |
| `setContent(html, { emitUpdate: false })` 不觸發 `onUpdate` | ✅（update 計數不變） |
| Placeholder | ✅ `p.is-editor-empty[data-placeholder]` |
| 10 次路由來回（`history.back/forward`） | ✅ created − destroyed = 1，DOM 只剩 1 個 `.ProseMirror`，overlay pane ≤ 1 |
| 改為動態 `import()` 後重跑以上全部 | ✅ |

### A2 SSR → 通過

`ng new --ssr`（`@angular/core` ^22.2.0、`@angular/ssr` ^22.2.2）、`RenderMode.Server`，掛入 spike 元件：

- `ng build`（browser + server）通過。
- `NG_ALLOWED_HOSTS=localhost PORT=4399 node dist/<app>/server/server.mjs`，`GET /` → 200；輸出含 `aria-busy="true"` 佔位、0 個 `.ProseMirror`；server log 無錯誤。
- Chromium 載入：hydration 成功（有 `ngh`），瀏覽器端建立編輯器，console 0 錯誤 / 警告。
- 註：Angular SSR 預設有 host 白名單，本機跑要設 `NG_ALLOWED_HOSTS`，與 Tiptap 無關。

**每個里程碑收尾重跑此流程**（charter §8）。

### A3 打包（docs，`pnpm ng build docs`）→ 通過

| | Raw | Transfer |
|---|---|---|
| docs initial total（有無 spike 皆同） | 439.19 KB | 98.4 KB |
| spike 頁 lazy chunk，M1 組合 | 390.97 KB | 105.59 KB |
| spike 頁 lazy chunk，全擴充（+ image / TableKit / mention） | 481.95 KB | 130.10 KB |

`main-*.js`、`styles-*.css` 中 `ProseMirror|tiptap` 0 筆。

### A4 `@sanring/ui` 單一 entry tree-shaking → 靜態 import 失敗，動態 import 修正

scratch 專案中以假套件模擬 `@sanring/ui` 的 FESM（單檔、`sideEffects: false`），消費端只 import 非編輯器的 export：

| 套件內寫法 | 消費端 initial（raw / transfer） |
|---|---|
| 基準（不 import 該套件） | 229.20 KB / 63.98 KB |
| 靜態 import `@tiptap/core` | 229.74 KB / 64.10 KB（可 tree-shake，`sideEffects: false`） |
| 靜態 import `@tiptap/starter-kit` | **597.16 KB / 162.99 KB** |
| 靜態 import `@tiptap/extensions` | **519.97 KB / 141.27 KB** |
| `create()` 內動態 `import()` 三者 | **227.40 KB / 63.16 KB**，tiptap 只在 lazy chunk |

`sideEffects`：`@tiptap/core` false；`@tiptap/pm` / `starter-kit` / `extensions` 未宣告；`prosemirror-view` 為 `["./style/prosemirror.css"]`。→ 決策 2。

### A5 v3 API → 確認（讀 3.31.4 原始碼）

- `setContent(content, { emitUpdate = true, parseOptions, errorOnInvalidContent })`
- StarterKit：`link: false`、`undoRedo`（非 `history`）
- Mention 預設輸出：`<span data-type="mention" data-id data-label data-mention-suggestion-char>{char}{label ?? id}</span>`
- CharacterCount：打字超限 → 拒絕 transaction；貼上超限 → 從游標處截斷，截斷後仍超限（如在表格內）則拒絕；`autoTrim` 預設 `true`
- Image：無載入失敗 hook（僅 `resize` NodeView 會處理），`resize` 預設 `false`
- `@tiptap/suggestion` 靜態 import `@floating-ui/dom`（必要 peer）

### A6 CDK overlay PoC → 通過（既有 API 不需修改）

| 檢查 | 結果 |
|---|---|
| bubble 置中於選取範圍上方 | ✅ 中心偏差 < 4px |
| 上方空間不足時翻到下方 | ✅ |
| 選取收合時隱藏 | ✅ |
| 打字 / 選取時焦點留在編輯區 | ✅（`DomPortal` 不搶焦點） |

`MenuOverlayController.open()` 型別為 `{ x, y }`，但結構型別允許多帶 `width` / `height`，CDK `flexibleConnectedTo` 會使用。

### A7 授權 → 通過

lockfile 新增 49 個套件全為 MIT：`@tiptap/*` 29 個、`prosemirror-*` 13 個、`orderedmap`、`rope-sequence`、`w3c-keyname`、`linkifyjs`、`@floating-ui/{core,dom,utils}`。

## 推翻條件

- Tiptap 未來版本讓 `starter-kit` / `extensions` 宣告 `sideEffects: false` → 可改回靜態 import（重跑 A4）。
- `@sanring/ui` 對外發佈 → 重評 dependencies vs optional peer（後者需 secondary entry，須改 CLI 腳本，另開 charter）。
- Tiptap v4 發佈 → 重跑 A1 / A2 / A5。
- 出現第二個需要「選取範圍定位浮動 UI」的元件 → 評估把 selection-anchored overlay 抽成 `shared/`。
