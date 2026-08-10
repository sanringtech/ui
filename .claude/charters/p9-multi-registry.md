---
schema_version: 1
charter_id: p9-multi-registry
charter_name: P9 — Multi-Registry Support
status: draft
charter_type: migration
parent_charter:
date: 2026-08-10
owner: charlieTai
branch: feat/p9-multi-registry
related_prd:
related_constitution:
---

# Task Charter: P9 — Multi-Registry Support

> 任務範圍書。只回答：為什麼做、動什麼、不動什麼、什麼時候停。

## 1. 目的 (Purpose)

當前 CLI 每次只能指向單一 registry（透過 `--registry` flag 或預設遠端），使用者若需同時使用官方元件庫與私有元件庫，必須在每個指令手動切換 flag，無法在同一個專案中宣告多個 registry 別名並透過 `alias:componentName` 語法精確定址。

- **觸發**：ADR-0001 決策確立 named alias 機制，`sanring.config.json` 需支援 `registries` + `defaultRegistry` 兩個新欄位；`installedVersions` key 格式需從 `componentName` 升級為 `alias:componentName` 以區分跨 registry 同名元件。
- **預期收益**：使用者可在 config 中宣告多個 registry alias，所有 command 自動解析正確來源，減少手動 flag 切換；`installedVersions` key 格式升級後能精確追蹤跨 registry 的元件版本。
- **本次不解決**：`sanring build`（TypeScript AST 靜態分析推斷 `componentDeps`）可行性尚未 spike，明確不在本次範圍內。

## 2. 可做範圍 vs 不可做範圍

### ✅ 可做

- 在 `SanringConfig` 介面新增 `registries?: Record<string, string>` 與 `defaultRegistry?: string`
- 在 `utils.ts` 新增 `resolveRegistrySource(alias, config, flagOverride?)` 純函式
- 在 `utils.ts` 新增 `migrateInstalledVersionsKeys(config)` migration 函式（舊格式無冒號 → `alias:componentName`）
- 修改 10 個現有 commands，將 `options.registry` / `registrySource` 呼叫改為透過 `resolveRegistrySource` 取得
- 修改 `add.ts`：解析 `alias:name` 語法，寫入 `installedVersions` 時 key 格式改為 `alias:componentName`
- 修改 `update.ts`：讀取 `installedVersions` 時相容無冒號舊格式（backward compat），並同步改寫入格式
- 修改 `init.ts`：新 config 預設值加入 `registries: {}` 與 `defaultRegistry` 欄位（值待確認，見 Open Questions）
- 修改 `mcp.ts`：`registryUrl`（line 142, 163）改透過 `resolveRegistrySource` 取得
- 新增 / 補齊 `add.test.ts`、`update.test.ts`、`list.test.ts` 的對應測試案例
- 更新 `packages/cli/README.md`

### ❌ 不可做

- ❌ 不可新增任何使用者可見的新 UX 功能超出 alias 解析所必要的範圍
- ❌ 不可改動 `fetchRegistry` 或 `fetchFile` 的函式簽名（registry 來源解析層在 `resolveRegistrySource`，不下沉到 registry 模組）
- ❌ 不可在批次 B 期間同時修改 `add.ts` 的 alias 解析與 `installedVersions` key 格式（`add.ts` 必須最後做，在其他 command 全部接入後才動）
- ❌ 不可實作 `sanring build`（TypeScript AST 靜態分析），此為批次 D 且需另立 charter
- ❌ 不可更改 `semverLte`、`hashContent`、`isUntouchedSinceInstall` 等與 registry 解析無關的 utils 函式
- ❌ 不可在未完成 `tsc --noEmit` 無錯誤的狀態下 commit 任何批次
- ❌ 不可合併無關的格式化（prettier / import 排序）進同一 commit

> **「不可做」比「可做」更重要** —— 沒寫清楚不該做什麼，scope 會無限擴張、commit 會越長越雜。

## 3. 分批策略 (Phased Plan)

### 批次 A：低風險 — 型別與純函式（utils.ts 零 command 改動）

**內容**：

1. `SanringConfig` 介面加 `registries?: Record<string, string>` 與 `defaultRegistry?: string`
2. 新增 `resolveRegistrySource(alias: string | undefined, config: SanringConfig | null, flagOverride?: string): string | undefined`
   - 優先級：`flagOverride` > `registries[alias]` > `defaultRegistry` > `undefined`（降級靜默，不報錯）
3. 新增 `migrateInstalledVersionsKeys(config: SanringConfig): SanringConfig`
   - 舊 key（無冒號）**保留原樣**，不強制升格（lazy migration）；讀取時作為向下相容處理，下次 `add`/`update` 觸及該元件時才自然改寫為新格式

**準入條件**：

- `packages/cli/src/utils.ts` 是唯一修改檔案
- 不得呼叫任何 command 或 registry 模組
- 新函式必須有對應單元測試

**Commit 粒度**：可一個 commit 包含型別定義 + 兩個函式（建議拆為 2 個 commit：型別定義一個、函式實作一個）

---

### 批次 B：中風險 — 10 個現有 commands 接入 resolveRegistrySource

**內容**（`add.ts` 最後做，其餘 9 個先行）：

| Command | 現有用法 | 改動位置 |
|---|---|---|
| `diff.ts` | `registrySource = options.registry`（line 128）；`fetchFile(..., registrySource)`（line 243） | 改呼叫 `resolveRegistrySource` |
| `migrate.ts` | `options.registry`（line 40） | 同上 |
| `info.ts` | `options.registry`（line 128） | 同上 |
| `search.ts` | `options.registry`（line 25） | 同上 |
| `list.ts` | `options.registry`（line 192, 221） | 同上 |
| `remove.ts` | `registrySource`（line 101, 108） | 同上 |
| `doctor.ts` | `options.registry`（line 109） | 同上 |
| `mcp.ts` | `registryUrl`（line 142, 163） | 同上 |
| `init.ts` | 不改 config 預設值（`registries`/`defaultRegistry` 皆 opt-in）；僅更新 README 說明 | 文件補充 |
| `add.ts` | **最後處理（僅接入 resolveRegistrySource，alias 解析留批次 C）** | line 209 |

**準入條件**：

- 批次 A 的 `resolveRegistrySource` 已 commit 且 `tsc --noEmit` 無錯誤
- 每個 command 改動後立即跑驗證，不攢改多個 command 再一起驗證

**Commit 粒度**：每個 command 一個 commit，最多兩個相關 command 合一個 commit

---

### 批次 C：高風險 — add.ts alias 解析 + installedVersions key 格式升級

**內容**：

1. `add.ts`：解析 `alias:name` 語法，從 `componentNames` 陣列中拆出前綴與元件名
2. `add.ts`：`installedVersions[component.name]` → `installedVersions[\`${alias}:${component.name}\`]`
3. `update.ts`：讀取 `installedVersions` 時相容無冒號舊格式（舊 key 保留原樣，不強制升格）；本次寫入的 key 統一改為 `alias:componentName`（lazy migration）
4. 執行 `migrateInstalledVersionsKeys` 的呼叫點整合（決定在 `readConfig` 之後立即 migrate 還是懶 migrate，見 Open Questions）

**準入條件**：

- 批次 B 全部 command 已 commit 且 `pnpm test` 全綠
- 有 `add.test.ts` 覆蓋 `alias:name` 解析的正反測試案例
- 有 `update.test.ts` 覆蓋舊 key 格式 backward compat

**Commit 粒度**：每個 commit 必須伴隨 smoke check（見第 7 節）；建議拆為 3 個 commit：alias 解析、installedVersions key 寫入格式、update.ts backward compat

---

### 批次 D：預設暫停 — sanring build（TypeScript AST 靜態分析）

**內容**：

- `packages/cli/src/commands/build.ts`（新指令 `sanring build`）
- `packages/cli/src/index.ts` 註冊 build command
- 輸出標準 `Registry` schema，需從 TypeScript AST 推斷 `componentDeps`

**原因**：TypeScript AST 靜態分析可行性尚未 spike，技術風險未知。在無 spike 結果前貿然實作風險過高。

**Spike 先決條件**（由使用者另行決定）：

1. 確認可行的 AST 解析策略（`ts-morph` / TypeScript compiler API / babel / 其他）
2. 確認 `componentDeps` 推斷的精確度需求（靜態 100% 準確 vs 啟發式近似）
3. 評估對現有 `tsconfig` 設定的耦合程度

**處理方式**：若要做，另開 `.claude/charters/p9-sanring-build.md`

## 4. 每個項目的執行步驟 (SOP)

每處理一個 command 都走以下流程：

1. 讀取目標 command 原始碼，確認 `options.registry` / `registrySource` / `registryUrl` 的實際行號（以原始碼為準）
2. 執行 `rg "options\.registry|registrySource|registryUrl" packages/cli/src/commands/<target>.ts` 確認所有使用點
3. 判斷改動類型：單純替換呼叫 / 需調整函式簽名 / 需新增 import
4. 修改：將用法替換為 `resolveRegistrySource(undefined, config, options.registry)`（或對應 alias 參數）
5. 補充 import（`resolveRegistrySource` from `../utils.js`）
6. 跑驗證（見第 7 節）
7. Commit

**批次 C 的 add.ts 額外步驟**：

1. 先補充 `add.test.ts` 的 alias 解析測試（測試先行）
2. 實作 `alias:name` 解析邏輯
3. 修改 `installedVersions` key 寫入格式
4. 跑 smoke check（見第 7 節批次 C 項目）
5. Commit alias 解析（一個 commit）
6. Commit key 格式修改（一個 commit）

## 5. Commit 邊界 (Commit Boundary)

建議格式：

```txt
feat(cli/<scope>): <imperative summary>
```

範例：

```txt
feat(cli/utils): add resolveRegistrySource + migrateInstalledVersionsKeys
feat(cli/diff): wire resolveRegistrySource for registry resolution
feat(cli/add): parse alias:name syntax in componentNames
feat(cli/add): upgrade installedVersions key format to alias:componentName
feat(cli/update): backward compat for legacy installedVersions keys
```

每個 commit 必須符合：

- 同一批次的風險層級（不混跨批次）
- 不混入無關檔案搬移
- 不混入無關格式化（prettier / import 排序）
- `tsc --noEmit` 在 commit 時點必須為零錯誤

## 6. 停止條件 (Stop Conditions)

遇到以下任一情況**立即停下回報，不繼續硬改**：

1. **`resolveRegistrySource` 的優先級語意與 ADR-0001 不一致**：若實作時發現 `flagOverride` / `defaultRegistry` / `registries[alias]` 的優先級邏輯有歧義，停止並回報，不自行腦補決策。
2. **批次 B 任一 command 改動後 `tsc --noEmit` 出現超出當前 command 範圍的型別錯誤**：例如 `diff.ts` 改動後 `update.ts` 出現錯誤，停止並回報影響範圍。
3. **批次 C 的 `installedVersions` key 格式升級導致現有測試需大幅重寫（超過 5 個 test case）**：停止評估測試改動成本後再繼續。
4. **`migrateInstalledVersionsKeys` 在處理舊 key 時發現 `defaultRegistry` 為空**：若無法確定應將無前綴 key 遷移為何值，停止並回報，不靜默丟棄或腦補預設值。
5. **批次 B 的 `mcp.ts` 改動涉及 MCP tool handler 的對外介面（schema 或行為）**：MCP tool 介面變動屬跨系統契約，不在本 charter 範圍，立即停止。
6. **批次 C 的 `alias:name` 解析邏輯需要改動 `fetchRegistry` 或 `createRegistryIndex` 函式簽名**：registry 模組改動超出本 charter 可做範圍，停止並評估是否需另立 ADR/PRD。

> 停下回報**不是失敗**，是 charter 在保護你不要把 migration 變成 rewrite。

## 7. 驗證標準 (Verification)

### 每批 commit 前必跑

```txt
pnpm --filter @sanring/cli exec tsc --noEmit
pnpm --filter @sanring/cli exec eslint src --max-warnings 0
pnpm --filter @sanring/cli test
```

### 批次 A 額外驗證

- `resolveRegistrySource` 單元測試：`flagOverride` 優先 > `registries[alias]` > `defaultRegistry` > 回傳 `undefined`
- `migrateInstalledVersionsKeys` 單元測試：舊格式 key（無冒號）轉換後結果正確

### 批次 B 額外驗證

- 每個 command 接入後，手動驗證 `--registry` flag 仍有效（可用 `--registry <local-path>` 測試）
- `list.ts` 的 line 192 / 221 兩處皆確認改到（grep 驗證）

### 批次 C Smoke Check（人工執行）

- `sanring add button`：無前綴走 `defaultRegistry`，安裝成功，`installedVersions` key 格式為 `<defaultRegistry>:button`
- `sanring add myalias:button`：走 `registries.myalias`，安裝成功，key 為 `myalias:button`
- 舊 config（`installedVersions: { "button": "0.x.x" }`）執行 `sanring update` 後，key 自動遷移且版本資訊保留
- `sanring update` 在有舊格式 key 的 config 下不報錯、不丟失資料

## 8. 建議執行順序 (Recommended Order)

1. 批次 A → 驗證（`tsc` + 單元測試）→ commit
2. 批次 B（`diff` → `migrate` → `info` → `search` → `list` → `remove` → `doctor` → `mcp` → `init` → `add` 接入）→ 每個 command 驗證後各 commit
3. 批次 C（`add.ts` alias 解析 → `installedVersions` key 格式 → `update.ts` backward compat）→ 每步驗證 + smoke check → commit
4. 批次 D 暫停，另開 `.claude/charters/p9-sanring-build.md`

## 9. 本次預設結論 (Time-boxed Scope)

本次 charter 的預設交付邊界為**批次 A + B + C 全部完成**。

- **最小可用里程碑**：批次 A + B——可先合入，`alias:name` 語法尚未支援，但所有 command 已透過 `resolveRegistrySource` 解析 registry 來源，功能降級但不破壞現有使用者。
- **完整里程碑**：批次 A + B + C，含 `alias:name` 解析與 key 格式升級，需同步更新 `README.md`。
- **批次 D 明確不在本次**：`sanring build` 需另立 charter，並以 spike 結果為準入條件。

若時間有限，建議以**最小可用里程碑**先合入，批次 C 另開短期 task 跟進。

若要處理批次 D 項目，應另開：

```txt
.claude/charters/p9-sanring-build.md
```

## 10. 開放問題 (Open Questions)

> 還沒回答的範圍邊界問題，標 `TODO` 或 `unknown`，禁止腦補。

- [x] ~~`migrateInstalledVersionsKeys` 在 `defaultRegistry` 為空時的策略~~：**已決議**——舊 key 保留原樣（lazy migration），不強制升格
- [x] ~~`init.ts` 新 config 預設值中 `defaultRegistry` 的預設字串~~：**已決議**——不加 `registries`/`defaultRegistry` 欄位，兩者皆 opt-in
- [x] ~~`mcp.ts` tool handler 是否需要在 schema 層支援 `alias:name`~~：**已決議**——不改 MCP schema，CLI 層透明處理
- [ ] TODO: `alias:name` 的 separator 確定為冒號（`:`）？若元件名本身可能含冒號，是否需要 escape 規則？（目前元件名全部為 kebab-case，無冒號，暫時可接受）
- [ ] unknown: `sanring build` 靜態分析所需的 TypeScript AST 解析策略，需 spike 後才能評估工時與依賴。
