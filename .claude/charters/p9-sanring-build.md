---
schema_version: 1
charter_id: p9-sanring-build
charter_name: P9 — sanring build（第三方 Registry 產生器）
status: draft
charter_type: migration
parent_charter: .claude/charters/p9-multi-registry.md
date: 2026-08-10
owner: charlieTai
branch: feat/p9-sanring-build
related_prd:
related_constitution:
---

# Task Charter: P9 — sanring build（第三方 Registry 產生器）

> 任務範圍書。只回答：為什麼做、動什麼、不動什麼、什麼時候停。

## 1. 目的 (Purpose)

第三方 / 企業若要架設自己的 Sanring-compatible registry，目前必須照 `Registry` schema 手寫 `registry.json`，容易漏列 `componentDeps`/`peerDependencies`，且無法隨元件變動持續更新。ADR-0001 Q4 已定案新增 `sanring build` 指令自動掃描 Angular component 目錄產生標準 schema 的 `registry.json`。

- **觸發**：ADR-0001 批次 D（`sanring build`）的先決 spike（2026-08-10）已完成並確認可行，結果記在 ADR-0001 Notes 段落；`p9-multi-registry.md`（批次 A+B+C）已完成，批次 D 依該 charter 第 9 節指示另立本 charter。
- **預期收益**：降低第三方上架 registry 的門檻，`componentDeps`/`sharedDeps`/`peerDependencies` 自動推斷，不需手動維護；輸出跟官方相同的 `Registry` schema，消費端（`fetchRegistry`/`sanring add`）零額外改動即可使用。
- **本次不解決**：不修復既有 `registry/registry.json` 的 3 個真實 bug（TODOLIST P24，spike 副產品，與本次功能無關）；不做 `--watch` 增量掃描；不做互動式 conflict resolution UI；不做跨 registry 的元件合併或衝突偵測。

## 2. 可做範圍 vs 不可做範圍

### ✅ 可做

- 新增 `packages/cli/src/registry-scan.ts`：存放純函式（無 CLI/IO 副作用之外的檔案讀取，不呼叫 `Command`/`ora`/`process.exit`）——目錄掃描、AST import/export 分類、peerDependency 遞移閉包去重、版本解析
- 新增 `packages/cli/src/commands/build.ts`：`sanring build [--source ./components] [--out ./dist-registry] [--dry-run] [--name <registry-name>]` command wiring，呼叫 `registry-scan.ts` 的純函式，組裝 `Registry` 物件、呼叫既有 `validateRegistry()`（`registry.ts`）自我驗證後才寫檔
- 在 `packages/cli/src/index.ts` 註冊 `buildCommand`
- 使用**原生 TypeScript compiler API**（`ts.createSourceFile` + AST walk 抓 `ImportDeclaration`/`ExportDeclaration` 的 `moduleSpecifier.text`）——**不引入 `ts-morph`**，理由見第 4 節「演算法選型定案」
- 修改 `packages/cli/package.json`：將 `typescript` 從 `devDependencies` 移至 `dependencies`（`sanring build` 是使用者透過 `npx @sanring/cli build` 在自己專案執行的執行期功能，不是建置期依賴；查證 `packages/cli/package.json` 目前 `typescript: "~6.0.2"` 僅在 `devDependencies`，需升級）
- 新增 `packages/cli/src/registry-scan.test.ts` / `packages/cli/src/commands/build.test.ts`
- 以 `registry/components/` + `registry/shared/` + 手寫 `registry/registry.json` 作為 golden fixture 撰寫回歸測試（見第 7 節）
- 更新 `packages/cli/README.md`：說明 `sanring build` 用法、`--source`/`--out`/`--dry-run`/`--name` flag、第三方目錄結構假設（components 目錄 + 同層 `shared/` 目錄，僅支援 inline template/style 的 `.ts` 元件）

### ❌ 不可做

- ❌ 不可修復 `TODOLIST.md` P24 的 3 個既有 `registry.json` bug（`transfer` relative import 錯誤 / `navigation-menu` 缺 `@lucide/angular` peerDependency / `tag`/`calendar`/`date-picker` 多餘的 `component-styles` sharedDep）——獨立議題，不在本 charter 範圍；若掃描過程中批次 A/B 的輸出跟這 3 個既有欄位不同，屬預期行為（AST 版本才是對的），不需要也不可以去「修正」AST 掃描結果去遷就手寫版的錯誤資料
- ❌ 不可改動 `fetchRegistry`、`fetchFile`、`createRegistryIndex`、`validateRegistry` 等 `registry.ts` 既有函式的簽名（延續 ADR-0001 對其他批次的邊界；`build.ts` 只能「呼叫」`validateRegistry` 做自我驗證，不能修改它）
- ❌ 不可讓 `sanring build` 輸出的 `registry.json` 跟現有 `Registry` type 不一致（ADR 已定案「不另立新 schema」；批次 C 必須在寫檔前呼叫 `validateRegistry()` 強制驗證，驗證失敗要停止寫檔並回報，不可略過）
- ❌ 不可支援外部 template/style 檔案（`.html`/`.css`/`.scss`）的自動收錄——v1 僅掃描 `.ts` 檔案，假設第三方元件跟 Sanring 官方元件一樣採用 inline template/style 慣例（已查證 `registry/components/{tag,calendar,combobox}` 100% 為 `.ts` 檔案，無任何 `.html`/`.css` 元件檔）；若第三方需要外部檔案支援，屬於後續需求，需另評估
- ❌ 不可自動產生 `groups` 分類欄位——`groups` 為 optional，缺席時 `createRegistryGroups()`（`registry.ts` 既有邏輯）已有 fallback，產生單一 `"Components"` group；`sanring build` 不嘗試猜測分類語意
- ❌ 不可在 peerDependency 版本無法解析時靜默猜一個版本寫入 `registry.json`（見第 10 節開放問題，此為政策性決策，留給使用者拍板，不可腦補）
- ❌ 不可實作 `--watch` 模式或互動式 conflict resolution——批次 D 範圍，見第 3 節
- ❌ 不可在未完成 `tsc --noEmit` 無錯誤的狀態下 commit 任何批次
- ❌ 不可合併無關的格式化（prettier / import 排序）進同一 commit

> **「不可做」比「可做」更重要** —— 沒寫清楚不該做什麼，scope 會無限擴張、commit 會越長越雜。

## 3. 分批策略 (Phased Plan)

### 批次 A：低風險 — 目錄掃描 + AST 分類（純函式，零 CLI 整合）

**內容**：

1. `discoverComponentSources(sourceDir)`：列舉 `--source` 底下每個子目錄為一個 component（目錄名即 `name`），排除 `shared/` 子目錄（視為特殊來源，見 4）；對每個 component 目錄遞迴收集 `.ts` 檔案，排除符合 `/\.(spec|test|stories|cy)\.ts$/` 的檔案
2. `discoverSharedSources(sourceDir)`：掃描 `dirname(sourceDir)/shared/*`（與 `--source` 同層的 sibling 目錄，比照 `registry/components` 與 `registry/shared` 同層的既有慣例；此為明確設計假設，不相容其他佈局）
3. `classifyModuleSpecifiers(fileContent, filePath)`：用 TS compiler API 解析單一 `.ts` 檔案的 `ImportDeclaration`/`ExportDeclaration`，回傳原始 `moduleSpecifier.text` 清單，依規則分三類：
   - `../shared/xxx` → sharedDep 候選，取 `shared/` 後第一段路徑當名字
   - `../xxx`（非 shared）→ componentDep 候選，取 `../` 後第一段路徑當名字
   - 裸套件名（非 `./`/`../` 開頭）→ peerDependency 候選（原始 specifier，尚未 canonicalize）
4. `filterBaselinePackages(candidates)`：從 peerDependency 候選中排除 baseline 清單（**逐字串精確比對，不做 canonicalize**，延續 spike 驗證過的規則）：`@angular/core`、`@angular/core/rxjs-interop`、`@angular/common`、`rxjs`——定義為原始碼中的陣列常數，方便未來擴充
5. `validateReferencedTargets(...)`：componentDep 候選必須對應到 `discoverComponentSources` 找到的某個 component 目錄名，sharedDep 候選必須對應到 `discoverSharedSources` 找到的某個 shared 檔案（去掉副檔名比對名稱）；找不到對應目標時**警告並排除**該候選，不寫入斷鏈的 componentDep/sharedDep（避免 `sanring add` 執行期 `resolveInstallSet`/`sharedByName.get` 靜默失效）
6. `extractDescription(classDeclarationNode)`：若元件主要 class（`@Component` decorator）上方有 `/** ... */` leading comment，取第一行當 `description`；找不到則回傳空字串並警告（`⚠ component "<name>" has no description, please edit manually`）

**準入條件**：

- 僅新增 `packages/cli/src/registry-scan.ts`，不修改任何 `commands/*.ts`
- 每個函式對輸入目錄純粹讀檔，零寫入、零 `process.exit`、零 console 輸出以外的副作用（警告訊息回傳為函式回傳值的一部分，由呼叫端 batch C 決定要不要印，維持純函式可測試性）
- 每個函式有對應單元測試，並用 fixture 目錄驗證（可用 `registry/components/{tag,calendar,combobox}` 三個做至少一組真實案例的 fixture）

**Commit 粒度**：建議拆 2–3 個 commit（目錄掃描一個、AST 分類+baseline 排除一個、validate+description 抽取一個）

---

### 批次 B：中風險 — peerDependency 遞移閉包去重

**內容**：

> ADR-0001 Notes 已驗證：**只有 peerDependency 需要遞移閉包去重**。componentDeps 本身不需要去重（`resolveInstallSet` 的 BFS 本來就靠完整 componentDeps 清單安裝，且既有測試明確涵蓋 `select`↔`listbox` 循環依賴為合法情境，不視為錯誤）；sharedDeps 也不需要遞移去重（9 個欄位不吻合案例中，sharedDeps 的不吻合全部歸因於 TODOLIST P24 的既有 bug，零案例歸因於遞移關係）。批次 B **只處理 peerDependency 這一欄**，不可擴大套用到其他兩欄。

1. `canonicalizePackageName(specifier)`：scoped 套件（`@scope/pkg/...`）取前兩段 `@scope/pkg`；非 scoped 套件（`pkg/...`）取第一段 `pkg`（例：`@angular/cdk/a11y` → `@angular/cdk`）
2. `buildComponentDepGraph(components)`：用批次 A 驗證過的 componentDeps 建有向圖
3. `computeUpstreamPeerCoverage(componentName, graph, rawPeerDepsByComponent)`：從該元件出發，對 componentDeps 做 DFS/BFS（**用 `seen` set 防止重複造訪，循環依賴時直接跳過已造訪節點，不視為錯誤**——比照 `add.ts` 的 `resolveInstallSet` 既有寫法），收集所有**可達的上游元件**（不含自己）各自的 raw peerDependency canonical name 聯集
4. `dedupePeerDependencies(componentName, rawPeerDeps, upstreamCoverage)`：`最終清單 = canonicalize(rawPeerDeps) - upstreamCoverage`（集合差集）
5. `resolvePeerDependencyVersion(packageName, cwdPackageJson)`：在**執行 `sanring build` 的 cwd 底下的 `package.json`**（`dependencies` → `devDependencies` → `peerDependencies` 依此優先序查找，第一個命中即用該版本字串）；查不到時的處理見第 10 節開放問題，批次 B 的函式簽名應讓查不到時回傳明確的 `{ resolved: false, packageName }`（而非猜測版本），把決策留給批次 C 的呼叫端依開放問題的拍板結果處理

**準入條件**：

- 批次 A 全部函式已 commit 且有測試覆蓋
- `computeUpstreamPeerCoverage` 必須有循環依賴情境的測試（仿 `add.test.ts` 的 `select`/`listbox` 循環 fixture）
- 用 `registry/components/calendar` + `registry/components/popover` + `registry/components/field` 三者組成 fixture，驗證 `calendar` 最終不應保留 `@angular/cdk`/`@angular/forms`（因為 `popover`/`field` 已透過 componentDeps 覆蓋）——這是直接對應 ADR Notes 描述案例的回歸測試，必須存在

**Commit 粒度**：建議拆 2 個 commit（canonicalize + 圖建構 + 遞移覆蓋計算一個；去重 + 版本解析一個）

---

### 批次 C：高風險 — build command 本體 + registry.json 輸出 + 檔案複製

**內容**：

1. `packages/cli/src/commands/build.ts`：`sanring build` command 定義（flags：`--source <path>`，預設 `./components`；`--out <path>`，預設 `./dist-registry`；`--dry-run`，預設 `false`；`--name <name>`，未提供時讀取 cwd `package.json` 的 `name` 欄位）
2. 呼叫批次 A/B 的純函式組裝完整 `Registry` 物件（`name`/`shared`/`components`，**不含 `groups`**）
3. 寫檔前呼叫既有 `validateRegistry()`（`registry.ts`）自我驗證，失敗則印出錯誤、`process.exit(1)`、不寫檔
4. `--dry-run`：印出將產生的 component/shared 清單與各自的 `componentDeps`/`sharedDeps`/`peerDependencies` 摘要，**不寫入 `--out`**（比照 `add.ts` 既有 `--dry-run` 慣例：預覽但不落地）
5. 非 dry-run：把 `--out/registry.json` 寫入，並把每個 component 的 `.ts` 檔案複製到 `--out/components/<name>/`、每個 shared 檔案複製到 `--out/shared/`（跟 `registry/components/` + `registry/shared/` 既有佈局一致，確保輸出可直接被 `fetchRegistry(--out路徑)`/`fetchFile` 消費）
6. `packages/cli/package.json`：`typescript` 移至 `dependencies`
7. `packages/cli/src/index.ts`：註冊 `buildCommand`

**準入條件**：

- 批次 A+B 全部函式已 commit 且 `pnpm test` 全綠
- 有 `build.test.ts` 覆蓋：正常輸出、`--dry-run` 不寫檔、`validateRegistry` 失敗時不寫檔且非 0 exit code
- **Golden fixture 回歸測試必須通過**（見第 7 節）：以 `registry/components` + `registry/shared` 為 `--source`/shared 來源跑 `sanring build`，輸出跟手寫 `registry/registry.json` 逐欄位比對，差異必須**僅限**於 TODOLIST P24 已知的 3 個 bug 案例，其餘欄位須完全一致

**Commit 粒度**：每個 commit 必須伴隨 smoke check（見第 7 節）；建議拆 3 個 commit：command wiring + 組裝邏輯一個、檔案複製 + dry-run 一個、`package.json` 依賴升級 + `index.ts` 註冊一個（最後做，確保前面都驗證過再對外掛上指令）

---

### 批次 D：預設暫停 — 進階功能

**內容**：

- `--watch` 模式（監看 `--source` 變動自動重新產生 `registry.json`）
- 互動式 conflict resolution（例如同名 component 跨多次 build 的合併策略）
- 增量 build（只重新掃描變動過的元件目錄）

**原因**：ADR-0001 Q4 只定案一次性 `sanring build [--source] [--out]` 的基本形式；`--watch`/互動式功能會引入檔案監看、狀態管理等 v1 未涵蓋的複雜度，且無明確使用者需求佐證，屬 speculative scope，不應順手做。

**處理方式**：若要做，另開 `.claude/charters/p9-sanring-build-watch.md`（或依實際需求命名）

## 4. 每個項目的執行步驟 (SOP)

**演算法選型定案（批次 A 開始前的前置決策，不留給實作者選）**：使用原生 TypeScript compiler API（`ts.createSourceFile` + `ts.forEachChild` 走訪 `ImportDeclaration`/`ExportDeclaration` 節點取 `moduleSpecifier` 文字），**不引入 `ts-morph`**。理由：(1) spike 已驗證原生 API 對本任務的窄範圍需求（只需抓 import/export module specifier 字串，不需要 symbol resolution 或型別檢查）已達 100% 可解釋的準確率，沒有「AST 抓不到」的案例；(2) `packages/cli` 已有 `typescript` 依賴（升級為 `dependencies` 後零額外套件成本）；`ts-morph` 會新增一個新的執行期依賴，包一層物件模型換取的便利性（fluent API、自動 formatting 等）在本任務用不到；(3) 符合 Karpathy simplicity-first 原則，避免為了「可能更方便」引入不必要的依賴面。

每處理一個模組（`registry-scan.ts` 內一個函式 / `build.ts` 一段邏輯）都走以下流程：

1. 對照第 3 節該批次的內容項目，確認要實作的函式簽名與輸入輸出
2. 若涉及既有型別（`Registry`/`RegistryComponent`/`RegistryShared`），先讀 `packages/cli/src/registry.ts` 確認欄位定義，不自行加欄位
3. 先寫 fixture（優先使用 `registry/components/*` 真實資料，而非憑空捏造），再寫函式實作（測試先行）
4. 跑驗證（見第 7 節）
5. Commit

## 5. Commit 邊界 (Commit Boundary)

建議格式：

```txt
feat(cli/<scope>): <imperative summary>
```

範例：

```txt
feat(cli/registry-scan): scan component source directories and classify import specifiers
feat(cli/registry-scan): compute transitive peer-dependency dedup with cycle-safe traversal
feat(cli/build): add `sanring build` command with dry-run preview
feat(cli): move typescript to dependencies for sanring build runtime
```

每個 commit 必須符合：

- 同一批次的風險層級（不混跨批次）
- 不混入無關檔案搬移
- 不混入無關格式化（prettier / import 排序）
- `tsc --noEmit` 在 commit 時點必須為零錯誤

## 6. 停止條件 (Stop Conditions)

遇到以下任一情況**立即停下回報，不繼續硬改**：

1. **批次 A/C 的 golden fixture 回歸測試（以 `registry/components` 為來源）出現除 TODOLIST P24 三個已知案例以外的欄位差異**：代表 AST 分類規則或去重演算法有未預期的瑕疵，停止並回報差異細節，不自行判斷「應該是對的」就放行。
2. **peerDependency 遞移閉包去重演算法在真實 fixture 上出現無限迴圈或明顯錯誤的覆蓋範圍**（例如非循環依賴卻被誤判為循環而漏算）：停止並回報。
3. **componentDep/sharedDep 候選連續在多個第三方風格的 fixture 上被 `validateReferencedTargets` 判定為斷鏈**（顯示分類規則跟真實第三方目錄結構的假設有落差）：停止並回報，不擴大猜測規則覆蓋範圍。
4. **peerDependency 版本解析（`resolvePeerDependencyVersion`）發現除了「cwd package.json 找不到套件」以外的其他歧義**（例如同一套件在 `dependencies` 和 `peerDependencies` 中版本不同）：停止並回報，不自行選一個當預設。
5. **`validateRegistry()` 在批次 C 組裝完的 `Registry` 物件上驗證失敗**：這代表批次 A/B 的輸出跟既有 schema 不一致，屬於本 charter「不可做」的紅線（Q4 定案「不另立新 schema」），停止並回報是哪個欄位不合規，不繞過驗證直接寫檔。
6. **需要修改 `fetchRegistry`/`fetchFile`/`createRegistryIndex`/`validateRegistry` 的函式簽名才能讓 build 輸出可用**：registry 模組改動超出本 charter 可做範圍，停止並評估是否需另立 ADR。

> 停下回報**不是失敗**，是 charter 在保護你不要把 feature 落地變成 registry 模組的破壞性重寫。

## 7. 驗證標準 (Verification)

### 每批 commit 前必跑

```txt
pnpm --filter @sanring/cli exec tsc --noEmit
pnpm --filter @sanring/cli exec eslint src --max-warnings 0
pnpm --filter @sanring/cli test
```

### 批次 A 額外驗證

- `discoverComponentSources`/`discoverSharedSources` 對 `registry/components`/`registry/shared` 跑一次，元件數與檔案清單需與目錄實際內容一致（用 fs 直接列目錄比對，不手寫期望值）
- `classifyModuleSpecifiers` 對 `calendar.component.ts` 的單元測試：`@angular/cdk/a11y`/`@angular/forms` 應被分類為 peerDependency 候選（去重留給批次 B）、`../shared/utils` 應分類為 sharedDep、`../field/field.type`/`../popover/popover.component` 應分類為 componentDep

### 批次 B 額外驗證（Golden Fixture 回歸測試，最關鍵）

- 以 `registry/components` + `registry/shared` 為輸入跑完整批次 A+B 流程，輸出跟手寫 `registry/registry.json` 逐 component 逐欄位（`componentDeps`/`sharedDeps`/`peerDependencies`）比對
- 差異**必須恰好等於** TODOLIST P24 的 3 個已知案例（`transfer` 4 檔案 relative import 錯誤、`navigation-menu` 缺 `@lucide/angular`、`tag`/`calendar`/`date-picker` 多餘 `component-styles`），不多不少
- `calendar` 的最終 `peerDependencies` 不應包含 `@angular/cdk`/`@angular/forms`（已被 `popover`/`field` 的 componentDeps 覆蓋）——直接對應 ADR Notes 案例的回歸測試

### 批次 C Smoke Check（人工執行）

- `sanring build --source registry/components --out /tmp/dist-registry --dry-run`：印出預覽，`/tmp/dist-registry` 不應被建立
- `sanring build --source registry/components --out /tmp/dist-registry`：`/tmp/dist-registry/registry.json` 通過 `validateRegistry()`；`sanring add --registry /tmp/dist-registry <component>` 在一個測試用 Angular 專案下能成功安裝（消費端零改動即可用，驗證 ADR Q4「不另立新 schema」的實質效果）

## 8. 建議執行順序 (Recommended Order)

1. 批次 A → 驗證（`tsc` + 單元測試 + 目錄掃描/分類 fixture）→ commit
2. 批次 B → 驗證（golden fixture 回歸測試，含 `calendar` 案例）→ commit
3. 批次 C（command wiring → 檔案複製/dry-run → `package.json`/`index.ts` 最後掛上指令）→ smoke check → commit
4. 批次 D 暫停，另開 sub charter

## 9. 本次預設結論 (Time-boxed Scope)

本次 charter 的預設交付邊界為**批次 A + B + C 全部完成**。

- **最小可用里程碑**：批次 A + B——`registry-scan.ts` 的掃描/分類/去重邏輯完整且有 golden fixture 回歸測試背書，但尚無 CLI 指令可用。可先合入作為批次 C 的可靠地基。
- **完整里程碑**：批次 A + B + C，`sanring build` 指令可用，README 已更新。
- **批次 D 明確不在本次**：`--watch`/互動式功能需另立 charter。

若時間有限，建議以**最小可用里程碑**先合入，批次 C 另開短期 task 跟進——但批次 C 的 golden fixture smoke check（`sanring add --registry <build 輸出>` 真的能裝）是驗證 ADR Q4 決策成立與否的關鍵一步，不建議無限期延後。

若要處理批次 D 項目，應另開：

```txt
.claude/charters/p9-sanring-build-watch.md
```

## 10. 開放問題 (Open Questions)

> 還沒回答的範圍邊界問題，標 `TODO` 或 `unknown`，禁止腦補。

- [ ] **unknown（政策性決策，需使用者拍板）**：`resolvePeerDependencyVersion` 在 cwd `package.json` 的 `dependencies`/`devDependencies`/`peerDependencies` 都找不到對應套件時（例如該套件是透過 monorepo workspace 或間接依賴取得，未顯式宣告），`sanring build` 該怎麼處理？三個選項供拍板：
  (a) 寫入 `"*"` 當版本萬用字元，並印出警告要求使用者手動修正
  (b) 直接跳過該 peerDependency（不寫入 `registry.json`），印出警告列出被跳過的套件清單，要求使用者手動補
  (c) `sanring build` 直接失敗（non-zero exit），列出所有無法解析版本的套件，強制使用者在跑之前先把 peerDependencies 正確宣告在自己的 `package.json`
  批次 B 的 `resolvePeerDependencyVersion` 函式簽名應回傳 `{ resolved: false, packageName }` 讓批次 C 依此拍板結果實作，不可在批次 B 內部先假設答案。
- [ ] TODO：`--name` flag 未提供且 cwd `package.json` 也沒有 `name` 欄位（或找不到 `package.json`）時的 fallback 值——目前傾向 `sanring build` 直接報錯要求使用者顯式提供 `--name`（比照批次 C 的驗證失敗即停止寫檔的原則），但未最終拍板，留待批次 C SOP 執行時依上下文決定並在 PR 說明中記錄。
