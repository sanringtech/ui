---
schema_version: 1
charter_id: p34-rich-text-editor
charter_name: P34 — Component rich-text-editor（Tiptap v3 + CDK overlay）
status: accepted
charter_type: feature
parent_charter:
date: 2026-10-13
owner: jack755051
branch: feat/p34-rich-text-editor
related_prd: .claude/prds/rich-text-editor.md
related_constitution:
related_adr: .claude/adrs/0003-rich-text-editor-engine.md
---

# Task Charter: P34 — Component rich-text-editor

規格（user story、API、四態、風險）以 [PRD rich-text-editor](../prds/rich-text-editor.md) 為準。選型以 ADR-0003 為準（批次 A 產出）。本檔只管**範圍、順序、停止條件、驗證**，不重寫規格。

## 1. 目的 (Purpose)

- **觸發**：`textarea` 只能輸入純文字，消費端要格式化文字就得自己整合第三方編輯器，樣式、`sanring-field`、a11y 都對不上（PRD §1）。TODOLIST P32 破例開 P34，歸 `patterns` 群組。
- **預期收益**：用 `sanring add rich-text-editor` 或從 `@sanring/ui` 匯入，就能拿到可放進 `sanring-field`、可綁 Reactive Forms、SSR 安全的富文本編輯器。
- **本次不解決**：PRD §3「非範圍」全部（協作、AI、評論、Pro 擴充、Markdown / JSON 值格式、後端 sanitize、圖片上傳後端、Angular NodeView 等）。

## 2. 核心重點（每批都要守）

1. **`@tiptap/*` 的值匯入只出現在 root 元件與擴充設定檔**，其他檔案只能用 `import type`（比照 ADR-0002 決策 3 的引擎隔離）。檔名以 B1 定案為準，提案為 `rich-text-editor.component.ts` 與 `rich-text-editor.extensions.ts`；改名要同步改 §8 的 grep。
2. **只用 `@tiptap/core` + 開源擴充**：不用 `ngx-tiptap`、Tiptap Pro / Cloud 擴充、`@tiptap/extension-bubble-menu` / `@floating-ui/dom`、`@tailwindcss/typography`。
3. **`new Editor()` 只在 `afterNextRender` 內建立**，`DestroyRef.onDestroy` 時 `editor.destroy()`（比照 `carousel-content.component.ts`）。server 端不碰 `window` / `document`。
4. **子元件只注入 `SANRING_RICH_TEXT_EDITOR` context**，不持有 `Editor` 參考，也不自建 `Editor`。
5. **值只走 CVA**：值為 HTML，空內容 `''`，`writeValue` 不回寫。不提供 `[(value)]`。
6. **浮動 UI**：bubble / mention / slash 走 CDK overlay（`menu-overlay-controller` + `collection-controller`）。連結 / 圖片表單需要焦點進入，維持用 `popover`。
7. **樣式只用 `var(--sanring-*)` token**，排版樣式 Tailwind 自寫。
8. **`packages/ui` 與 `registry/` 同一份改動、同一個 commit**；`check-registry-sync.mjs` 與 `check-registry-parity.mjs` 每個 commit 都要綠。
9. **所有 `@tiptap/*` 同一版本範圍**，`@tiptap/pm` 只能有單一實例。
10. **`@sanring/ui` 以 dependencies 宣告 `@tiptap/*`**（比照 `embla-carousel`），單一 entry、從 `public-api.ts` 匯出。

## 3. 可做範圍 vs 不可做範圍

### ✅ 可做

- `packages/ui/src/lib/components/rich-text-editor/` 與 `registry/components/rich-text-editor/`：雙份、檔名一致、spec 只放 `packages/ui`。
- `packages/ui/src/public-api.ts` 新增 `export * from './lib/components/rich-text-editor';`
- `field.type.ts`（`registry/components/field/` 與 `packages/ui/.../field/` 兩份）的 `FieldType` 新增 `richTextEditor: 'rich-text-editor'`。**唯一允許的既有元件契約變動。**
- `registry/registry.json`：`components[]` 新增條目、加進 `patterns` 群組，填 `peerDependencies` / `componentDeps` / `sharedDeps`。peer 隨里程碑遞增，M1 只放 M1 用到的套件。
- `packages/ui/package.json` `dependencies` 加 `@tiptap/*`，`ng-package.json` `allowedNonPeerDependencies` 同步加（比照 `embla-carousel`）。
- 根 `package.json` 加 `@tiptap/*`（docs app 編譯 registry-stage 用，比照 elkjs）。
- `registry/shared/` 與 `packages/ui/.../shared/` 的 `menu-overlay-controller.ts` / `collection-controller.ts`：**只可新增**（新 method / option / export），既有行為與既有 spec 不得變動。
- docs app：
  - `apps/docs/src/app/pages/components/rich-text-editor/`（page component、`rich-text-editor.docs.ts`，`ssrSafe: true`）
  - `docs-navigation.ts` 的 `DocsComponentId`、`app.routes.ts` 的 components children
  - `i18n/locales/{en,zh}/components/rich-text-editor.ts`
- 批次 A 期間可加 docs 暫時頁 `/spike/rich-text-editor`，處理方式見批次 A「Gate 結束清理」。
- `apps/docs/e2e/rich-text-editor.spec.ts`（比照 `org-chart.spec.ts`）。
- `packages/cli/src/commands/add.test.ts`：**只新增測試案例**（比照 elkjs 的 `collectPeerDeps` 與 `--dry-run` 案例）。
- changeset：`@sanring/ui` 在 `.changeset/config.json` 的 `ignore` 內，版本異動落在 `@sanring/cli`（registry 隨 CLI 出貨）。
- `TODOLIST.md` P34 勾選與連結、ADR-0003。

### ❌ 不可做

- ❌ 修改 `packages/cli` 的 `src/`（測試檔除外）、`scripts/`（含 sync / parity 腳本的 `EXPECTED_*_GAPS`）、`e2e/fresh-angular.mjs`。
- ❌ 把 `@tiptap/*` 放進 `@sanring/cli` 的 tarball。
- ❌ `ngx-tiptap`、`@tiptap-pro/*`、需 Tiptap Cloud 授權的擴充、`@tiptap/extension-bubble-menu`、`@tiptap/extension-floating-menu`、`@floating-ui/dom`、`@tailwindcss/typography`。
- ❌ 為 `@sanring/ui` 新增 secondary entry。
- ❌ 修改既有共用元件的公開 API：`popover`、`toggle`、`dropdown-menu`、`tooltip`、`divider`、`field`、`skeleton`（`FieldType` 新增值除外）。
- ❌ 修改 `menu-overlay-controller.ts` / `collection-controller.ts` 的既有行為（參數語意、預設值、事件順序、焦點處理）。
- ❌ 自訂 Angular NodeView、Markdown / JSON 值格式、`[(value)]` model。
- ❌ 在 repo 的 `angular.json` 加 SSR / server 設定，或把 SSR 驗證寫進 CLI e2e（SSR 驗證方法見 A2）。
- ❌ M1 啟用 StarterKit 內建 Link（M2 才開）。
- ❌ 跨里程碑偷做（例如 M1 順手加 Image / Table peer 或按鈕）。
- ❌ 用 `bypassSecurityTrustHtml` 渲染輸出（docs 範例也不行）。
- ❌ 自行回答 PRD §12 的待決題，必須由使用者拍板。

## 4. 分批策略 (Phased Plan)

### 批次 A：M0 Spike（Gate，不出貨）

在 docs app 暫時頁 `/spike/rich-text-editor` 進行，所有數字與結論寫進 ADR-0003。

- [ ] **A1 生命週期**：Tiptap v3 + StarterKit 在 Angular 22 docs app（沿用現行 change detection 設定）下建立 / 銷毀。反覆進出路由 ≥ 10 次，確認 `editor.destroy()` 後無殘留 listener / DOM。以 transaction 事件驅動 signal 版本號，確認 OnPush 會更新。
- [ ] **A2 SSR**：repo 沒有 SSR build 目標（docs 無 server 設定，CLI e2e 用 `--ssr=false`），因此在 repo 外 scratchpad 建 `ng new --ssr` 專案，裝入 spike 版元件，跑 server build 並 render 一次。指令與版本寫入 ADR-0003，供每個里程碑收尾重跑。此專案不 commit。
- [ ] **A3 Bundle 量測**（記錄用，不設數字門檻）：

  | 路徑 \ 組合 | M1 組合（core / pm / starter-kit / extensions） | 全擴充（再加 image / table / mention / suggestion） |
  |---|---|---|
  | registry：`pnpm ng build docs`，rte 頁 lazy chunk 增量（raw / transfer） | | |
  | `@sanring/ui`：scratch 消費端只 import 非 rte 元件時 tiptap 是否進 bundle；import rte 時的增量 | | |

  硬性要求：tiptap **不得**進入 docs initial chunk（現行 budget：initial 500kB warning / 1MB error）。
- [ ] **A4 `@sanring/ui` dependencies 驗證**：已拍板用 dependencies + 單一 entry（核心重點 10）。M0 只驗證 tree-shaking：消費端未 import rte 時，tiptap 不出現在其 bundle。結果寫入 ADR-0003；若 tree-shaking 失效，記錄於 ADR 並回報使用者，不自行改成 secondary entry。
- [ ] **A5 v3 API 細節**（以 `npm view` 與 v3 原始碼 / 文件確認，不參考 v2）：
  - 各套件確切名稱與最新版本，訂出 peer 範圍
  - `setContent` 簽章，以及不 emit `update` 的方法
  - StarterKit 停用 Link 的設定鍵名
  - Mention 預設輸出的 HTML 屬性
  - CharacterCount 貼上超限內容時是截斷還是拒絕
  - Image 擴充有無載入失敗 hook
- [ ] **A6 CDK overlay PoC**：`flexibleConnectedTo({x,y,width,height})` + `editor.view.coordsAtPos` 定位到選取範圍，翻轉時不偏移。只用 `menu-overlay-controller` / `collection-controller` 既有 API；若需擴充，記錄要「新增」什麼。打字時焦點留在編輯區。
- [ ] **A7 授權**：`npm view <pkg> license` 逐一確認所有預計使用的 `@tiptap/*` 及傳遞依賴（至少 `prosemirror-*`），列表寫入 ADR。
- [ ] **A8 ADR-0003**：Context / Decision / Consequences / ≥2 alternatives / Spike 結果 / 推翻條件，Status 改 Accepted 或 Rejected。TODOLIST P34 同步補 ADR 連結。
- [ ] **Gate 結束清理**：
  - 刪除 `/spike/rich-text-editor` 暫時頁與 route。
  - 根 `package.json` **只保留 M1 組合**（`@tiptap/core`、`@tiptap/pm`、`@tiptap/starter-kit`、`@tiptap/extensions`），其餘到各自里程碑再加。
  - `packages/ui/package.json` 批次 A 不動，B1 才加。
  - SSR scratch 專案留在 repo 外。

**準入條件**：PRD 已 accepted（已滿足）。
**Gate**：A1–A7 全部通過、ADR-0003 Accepted，才能進入批次 B。任一不過依 §7 停工回報。
**Commit 粒度**：spike 程式碼可只存在本地 / 草稿 commit；最終 PR 只留 ADR-0003、TODOLIST 與根 `package.json` 的 M1 依賴。

### 批次 B：M1 核心 tracer bullet

> **拆法說明**：`check-registry-sync.mjs` 要求 `packages/ui` 元件目錄、`public-api.ts` 匯出、`registry.json` 條目、docs nav / route / page **同時存在**，否則 CI registry-sync-check 失敗。因此 B1 必須一次打通全部 surface，後續各批在這條鏈路上疊功能。

- **B1 root + CVA + field + 全 surface 打通**
  - root 元件、`SANRING_RICH_TEXT_EDITOR` context、StarterKit（停用 Link）、初始化前 skeleton（`aria-busy`）、`SanringCvaBase<string>`、`SanringFieldControlAdapter`、`FieldType.richTextEditor`
  - `packages/ui` 與 `registry` 雙份；`public-api.ts` 匯出；`registry.json` 條目（patterns、M1 peer）；`packages/ui/package.json` + `ng-package.json` 加 `@tiptap/*`
  - docs 最小頁（basic 範例 + `ssrSafe: true` + en / zh i18n + nav + route）
  - 單元測試涵蓋 PRD Story 1、4
- **B2 Toolbar**
  - `sanring-rich-text-editor-toolbar`（roving tabindex）、`button[sanringRichTextEditorToggle]`（`hostDirectives: ToggleDirective`）、`button[sanringRichTextEditorAction]`、`sanring-rich-text-editor-heading-menu`（`dropdown-menu`）、`divider`、`tooltip`
  - 同步更新 `registry.json` `componentDeps`
  - 單元測試涵蓋 PRD Story 2
- **B3 Placeholder / readonly / disabled / 字數 / 排版樣式**
  - Placeholder、`readonly`、`disabled`、`sanring-rich-text-editor-character-count`（`aria-live="polite"`）、內容排版樣式（只用 token）
  - 單元測試涵蓋 PRD Story 3
- **B4 docs 完整 + e2e + 發版**
  - docs 補齊 basic / usage / installation / composition / examples / API / accessibility，揭露 bundle 體積（引用 ADR-0003）與 HTML sanitize 責任
  - `apps/docs/e2e/rich-text-editor.spec.ts`：輸入、格式化、表單值、鍵盤導覽、axe 零違規
  - `add.test.ts` 新增 rte 的 `collectPeerDeps` 與 `--dry-run` 案例
  - `/audit-component rich-text-editor` 工程裁決 ✅
  - changeset、TODOLIST 勾選 M1

**準入條件**：批次 A Gate 通過；PRD §12 影響 M1 的待決題（disabled 按鈕方向鍵是否跳過、readonly 時工具列隱藏或 disabled、是否暴露 `extensions` / `editorReady`、是否加 `SANRING_RICH_TEXT_EDITOR_CONFIG`、e2e 是否用 `data-testid`）已拍板。未拍板者保留 TODO，不在實作中自行決定。
**Commit 粒度**：B1–B4 各一或數個 commit，每個 commit sync 與 parity 都綠。

### 批次 C：M2 Link + Image + Bubble menu

- **C1 Link**：開啟 StarterKit Link；protocol 白名單；`sanring-rich-text-editor-link`（`popover` 表單）；拒絕 `javascript:` 的測試。
- **C2 Image**：peer 加 `@tiptap/extension-image`（registry、根 `package.json`、`@sanring/ui` 同步）；URL + alt；`imageUpload` 介面（不實作上傳）；`imageUploadError`。
- **C3 Bubble menu**：CDK overlay 定位到選取範圍（沿用 A6）；與 toolbar 共用按鈕元件。
- **C4 e2e + 發版**：與既有 `dropdown-menu` / `popover` 同頁共存 e2e、axe、changeset。

**準入條件**：B4 已合併；Link protocol 清單、圖片 scheme（是否允許 `data:`）、貼上 / 拖放上傳、圖片載入失敗呈現、bubble menu 鍵盤進入方式、`Mod-K` 已拍板。

### 批次 D：M3 Table（與 C 無依賴，可對調）

- peer 加 `@tiptap/extension-table`；`sanring-rich-text-editor-table-menu`（`dropdown-menu`）；表格樣式；Tab 導覽 e2e；axe；changeset。

**準入條件**：B4 已合併；表格預設尺寸、是否開欄寬 resize 已拍板。

### 批次 E：M4 Mention + Slash

- peer 加 `@tiptap/extension-mention`、`@tiptap/suggestion`
- 共用 `sanring-rich-text-editor-suggestion-list`（CDK overlay + `role="listbox"` + `aria-activedescendant`，焦點留在編輯區）
- 自寫 Slash extension；Promise / Observable 資料來源；丟棄過期回應；四態；`suggestionError`
- e2e、axe、changeset

**準入條件**：批次 C 已合併。Slash 指令若要插入表格需批次 D 也已合併，否則該指令保留 TODO。

## 5. 每個項目的執行步驟 (SOP)

1. 讀 PRD 對應 Story 與 AC，以及 ADR-0003 相關決策。
2. 讀要重用的既有元件或 shared 檔，確認只用公開 API。
3. 先在 `packages/ui` 實作並寫 spec，再同步到 `registry/`（同名檔、相同 input / output 與 a11y binding）。
4. 依需要更新 `registry.json`、`public-api.ts`、docs 三面。
5. 跑 §8 每批必跑檢查。
6. 若在 shared controller 新增 API：兩份 shared 檔各加，既有 spec 不改且全綠。
7. commit（見 §6）。
8. 里程碑最後一批：跑 §8 收尾驗證，再執行 `/audit-component rich-text-editor`。

## 6. Commit 邊界 (Commit Boundary)

```txt
feat(rich-text-editor): <imperative summary>
test(rich-text-editor): <...>
docs(rich-text-editor): <...>      # docs 頁、ADR、TODOLIST
chore(rich-text-editor): <...>     # 依賴、changeset
```

- 一批一或數個 commit，不跨批混雜（沿用 p33）。
- 批次 A 暫時頁不得留在最終 PR，最遲批次 A 結束時刪除（沿用 p33）。
- **`packages/ui` 與 `registry/` 的對應改動必須同一個 commit**；`registry.json`、`public-api.ts`、docs nav / route 若因此需要同步也放同一 commit（由 CI `registry-sync-check.yml` 推導，非 p33 原文）。
- peer 新增在同一 commit 同步三處：`registry.json` peer、根 `package.json`、`packages/ui/package.json` + `ng-package.json`。
- 每個里程碑一份 changeset（`@sanring/cli`）。
- 每個里程碑至少一個 PR；B1–B4 可合成一個 PR 或分開。
- 不混入無關格式化、無關元件的修正。

## 7. 停止條件 (Stop Conditions)

遇到任一，停工回報，不自行繞過：

- **SSR**：A2 或之後任一次 SSR 驗證失敗（server build 報錯，或 server render 觸發 `window` / `document` / `new Editor()`）。
- **生命週期**：A1 銷毀後殘留 listener / DOM，或 OnPush 下狀態無法同步。
- **`packages/cli` 需要改程式碼**：`src/`（測試檔除外）、`scripts/`（含 `EXPECTED_*_GAPS`）、`e2e/fresh-angular.mjs`。
- **Tree-shaking 失效**：A4 發現未 import rte 的消費端 bundle 仍含 tiptap，且無法在元件內修正。
- **禁用依賴**：需要 Tiptap Pro / Cloud、`ngx-tiptap`、`@tiptap/extension-bubble-menu`、`@floating-ui/dom`、`@tailwindcss/typography` 才能達成 AC。
- **Parity**：sync 或 parity 檢查無法在不改腳本的前提下對齊。
- **Bundle**：tiptap 進入 docs initial chunk，或觸發 initial budget（500kB warning / 1MB error）。
- **既有共用元件公開 API 需要變動**：`popover`、`toggle`、`dropdown-menu`、`tooltip`、`divider`、`field`、`skeleton`（`FieldType` 新增值除外）。
- **shared controller 需要改既有行為**：新增可以；改既有語意、預設值或既有 spec 就停。
- **v3 API 不足**：`setContent` 無法抑制 `update` 導致 CVA 回寫迴圈無解；或 StarterKit 無法單獨停用 Link。
- **Overlay**：A6 無法只靠 CDK overlay 定位到選取範圍。
- **版本**：`@tiptap/pm` 無法收斂成單一實例。
- **授權**：任一必要套件（含 `prosemirror-*`）非 MIT 或相容寬鬆授權。
- **範圍**：需要 Angular NodeView、Markdown / JSON 值格式，或 PRD 非範圍項目。
- **待決題**：某批準入題未拍板而實作無法繞開。

## 8. 驗證標準 (Verification)

### 每批 commit 前必跑

```bash
pnpm lint
pnpm test
node packages/cli/scripts/check-registry-sync.mjs
node packages/cli/scripts/check-registry-parity.mjs
pnpm --filter @sanring/cli test        # 本批有動 registry.json 或 add.test.ts 時
# 引擎隔離：只有 root 與 extensions 檔可以值匯入 @tiptap（輸出必須為空）
grep -rlE "^import \{[^}]*\} from '@tiptap/" --include='*.ts' --exclude='*.spec.ts' \
  registry/components/rich-text-editor packages/ui/src/lib/components/rich-text-editor \
  | grep -vE "rich-text-editor\.(component|extensions)\.ts$"
# 禁用依賴（輸出必須為空）
grep -rnE "ngx-tiptap|@tiptap-pro/|@tiptap/extension-(bubble|floating)-menu|@floating-ui/dom|@tailwindcss/typography" \
  package.json packages/ui/package.json registry/registry.json registry/components/rich-text-editor packages/ui/src
```

### 里程碑收尾驗證（B4 / C4 / D / E 結束時）

- [ ] `pnpm ng build @sanring/ui` 通過
- [ ] `pnpm ng build docs` 通過；initial chunk 不含 tiptap（重跑 A3 方法），增量記錄在 docs
- [ ] SSR 驗證通過（重跑 ADR-0003 記錄的 A2 方法）
- [ ] `pnpm test:e2e:docs`（含 rte spec axe 零違規）、`pnpm test:e2e:cli` 通過
- [ ] `pnpm why @tiptap/pm` 只有單一版本
- [ ] `/audit-component rich-text-editor` 工程裁決 ✅
- [ ] 該里程碑 PRD Story 的 AC 逐條勾選
- [ ] §2 核心重點逐條勾選

### 人工 smoke（M2 / M4 涉及 overlay）

- 同頁開啟 `dropdown-menu` / `popover` 時，bubble menu / 建議清單疊層與 outside-click 不誤關對方
- Escape 關閉後焦點回到正確位置
- 打字時焦點不離開編輯區

## 9. 建議執行順序 (Recommended Order)

1. 批次 A（Gate）→ ADR-0003 Accepted → 清理
2. B1 → 驗證 + commit
3. B2 → B3 → B4（各自驗證 + commit），M1 PR 合併
4. 批次 C 或 D（無依賴，可對調）
5. 另一個（D 或 C）
6. 批次 E（需 C 已合併）

## 10. 本次預設結論 (Time-boxed Scope)

- **預設停損點：M1（B4）出貨後暫停**。M2–M4 各自等準入待決題拍板才開工，不在 M1 尾端順手開始。
- 批次 A Gate 不過，P34 停在 ADR-0003（Status: Rejected 或需重評），不進入 B。
- 時間更緊時：A + B1 可先合併（sync / parity / SSR 皆綠、docs 頁標預覽）。是否允許：TODO，需使用者確認。

若觸發 §7 又決定繞開（例如改 sync 腳本支援 secondary entry），另開子 charter（名稱提案 `.claude/charters/p34-sanring-ui-secondary-entry.md`）。

## 11. 開放問題 (Open Questions)

### 已拍板（2026-10-13）
- [x] `@sanring/ui` 依賴策略：dependencies + 單一 entry（比照 embla）；`@sanring/ui` 為 private 不發版，膨脹影響小
- [x] Bundle：不設數字門檻；硬性要求 tiptap 不進 initial chunk，增量記錄於 ADR-0003 與 docs
- [x] SSR 驗證：repo 外 scratch `ng new --ssr` 專案，不動 `angular.json` / CLI e2e
- [x] ADR-0003 slug：`0003-rich-text-editor-engine`

### 待決
- [ ] TODO：axe 覆蓋方式——新增 `rich-text-editor.spec.ts`，或擴充 `component-page-accessibility.spec.ts`（後者目前不是逐元件迭代）
- [ ] TODO：A + B1 能否在 docs 標「預覽」先合併
- [ ] TODO：M2 之後的分支 / PR 命名
- [ ] TODO：PRD §12 待決題（各批準入條件已列出），以及各里程碑日期
- [ ] unknown：`pnpm test`（`ng test`）是否同時涵蓋 `@sanring/ui` 與 docs 兩個 project 的 spec（B1 實測）
