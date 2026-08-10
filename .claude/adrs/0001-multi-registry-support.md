---
schema_version: 1
adr_id: "0001"
title: multi-registry-support
status: Proposed
date: 2026-08-10
deciders: [charlieTai]
related: []
---

# ADR-0001: Multi-Registry Support（自訂 / 第三方 Registry）

## Context

- **觸發事件**：P9 需求——讓企業或開源社群能架設自己的 Sanring-compatible registry，CLI 使用者可以 `sanring add myteam:button` 直接安裝第三方元件，而不是只能消費官方 registry。
- **相關背景**：目前 `fetchRegistry(source?: string)` 採單一 registry 模型，`--registry` flag 是 per-invocation 覆蓋，不持久。`SanringConfig`（`sanring.config.json`）無 `registries` 欄位，`installedVersions` 只記錄 CLI 版本，未記錄元件安裝來源 registry。所有 commands（`add / update / diff / migrate / remove / list / search / info / doctor / init / mcp`）都以 `--registry <path|url>` 將 source 傳入 `fetchRegistry()`。
- **既有狀況**：`fetchRegistry()` 的 resolution 順序為：(1) 明確本地路徑 → (2) 明確 URL → (3) 本地 bundle → (4) 版本鎖定 GitHub fallback。此模型無法同時持有多個 registry 的對應關係，也無法讓 `add` 在沒有 `--registry` 的情況下解析 `alias:component` 語法。

## Decision

**我們決定採用「named alias + URL 存入 `sanring.config.json`」的持久多 registry 模型，搭配 `alias:componentName` 前綴語法，以 `defaultRegistry` 作衝突解決基準，並新增 `sanring build` 指令讓第三方能產出相容的 registry bundle。**

### Q1：Registry 識別方式 → 採用 Option A

`sanring.config.json` 新增選用欄位 `registries`（alias → URL 的 map）與 `defaultRegistry`（alias 字串）：

```json
{
  "componentPath": "src/app/components/ui",
  "registries": {
    "official": "https://registry.sanring.dev",
    "myteam": "https://registry.myteam.com"
  },
  "defaultRegistry": "official"
}
```

`registries` 與 `defaultRegistry` 皆為選用；缺失時行為完全等同現況（官方 bundle → GitHub fallback），不報錯。

### Q2：Component 命名語法 → 採用 Option A

```
alias:componentName   → 明確指定來源 registry
componentName         → 從 defaultRegistry 查找
```

`sanring add myteam:button` 解析 alias `myteam`，取對應 URL，呼叫 `fetchRegistry(url)`，再在其中尋找 `button`。`sanring add button` 等同 `sanring add <defaultRegistry>:button`（或在無 `registries` 時走現有 resolution 路徑）。

### Q3：Conflict resolution → 採用 Option A

`defaultRegistry` 對應的 registry 優先。其他 registry 的同名 component 必須以 `alias:name` 明確指定才能安裝。CLI 不在解析時合併多個 registry 的 component 列表。

### Q4：`sanring build` 指令 → 採用建議 Decision

新增 `sanring build [--source ./components] [--out ./dist-registry]`：
- 掃描 `--source` 下的 Angular component 目錄，自動推斷 `files`、`componentDeps`、`peerDependencies`
- 輸出與官方完全相同的 `Registry` schema（`registry.json`），不另立新 schema
- 一併複製 component 檔案到 `--out`，形成可直接 serve 的靜態目錄

### Q5：Backward compatibility → 採用推薦方案

已有 `sanring.config.json` 但無 `registries` 欄位時，降級到現有單一 registry 行為，不報錯、不警告。`--registry <path|url>` flag 繼續有效，per-invocation 覆蓋優先於 config 內的 registries 設定。

### 實作要點

- `SanringConfig` 介面新增 `registries?: Record<string, string>` 與 `defaultRegistry?: string`（兩者皆選用）
- 新增 `resolveRegistrySource(alias: string | undefined, config: SanringConfig | null, flagOverride?: string): string | undefined`，封裝 alias → URL 的解析邏輯，回傳值直接傳入既有 `fetchRegistry(source?)`
- `installedVersions` 的 key 格式：**新寫入**一律用 `alias:componentName`；**舊 key（無冒號）讀取時保留原樣**，不強制升格——等下次 `add` 或 `update` 觸及該元件時自然改寫為新格式（lazy migration）
- `init.ts` 建立的初始 `sanring.config.json` **不加** `registries` / `defaultRegistry` 欄位，兩者皆為使用者 opt-in；官方 registry 的存取由 CLI binary 內建邏輯處理（local bundle → GitHub raw fallback）
- `sanring build` 實作在獨立的 `packages/cli/src/commands/build.ts`，不污染現有 commands
- `fetchRegistry` 本體不變，由上層 command handler 負責 alias 解析後再呼叫

## Consequences

### ✅ Positive

- 使用者可在 `sanring.config.json` 一次性設定多個 registry，後續 `add / update / diff / list` 等所有 commands 均可透過 `alias:name` 語法操作，不需每次帶 `--registry` 長 URL
- 向下相容：現有無 `registries` 欄位的 config 零改動即可繼續運作，不產生 breaking change
- Registry schema 不需要新版本——`sanring build` 輸出標準 `Registry` schema，第三方 registry 與官方 registry 消費路徑完全一致
- `resolveRegistrySource` 集中封裝 alias 解析，12 個 command handler 不需各自改動 `fetchRegistry` 呼叫細節

### ❌ Negative

- `installedVersions` 舊 key（無冒號）採 lazy migration——讀取時保留原樣，只有下次 `add`/`update` 觸及才改寫。這代表在過渡期間 `update` 對舊 key 的元件無法確認 registry 來源，只能 fallback 到 `defaultRegistry`（或 CLI 內建 official 路徑）；若使用者同時裝了同名的官方與第三方元件（key 相同），可能需要手動清理 config
- `alias:componentName` 語法在 zsh 等 shell 中，若使用者不加引號使用 `alias:name` 可能因 shell alias expansion 造成非預期行為（機率低，但需要在文件中提示）
- `sanring build` 需要能靜態分析 Angular component 目錄以推斷 `componentDeps` 和 `peerDependencies`——自動推斷準確率有上限，複雜 barrel export 或動態 import 可能需要使用者手動補充 manifest

### 〰️ Neutral

- `--registry` per-invocation flag 繼續存在，但其語義從「唯一 registry 來源」變為「覆蓋 config 中的 registries 設定」，需要更新 help text 與 README
- Command 層的 `--registry` flag 值若為 alias 字串（非 URL / 路徑），需要新的解析分支；若為 URL 或路徑則行為與現在相同，僅增加 alias 分支路徑

## Alternatives Considered

### Q1 Option B: Bare URL 作為 namespace

- **是什麼**：直接用 `sanring add https://registry.myteam.com/button` 指定來源，不需要 config 設定
- **拒絕理由**：URL 冗長、重複輸入成本高；無法表達優先順序（多個 registry 哪個先）；`list / search` 等指令需要 URL 才能跨 registry 查詢，DX 顯著下降

### Q1 Option C: 全域改掉單一 `--registry` 設定

- **是什麼**：在 config 中存一個 `defaultRegistry` URL，使用者一次只能認一個 registry
- **拒絕理由**：完全不支援同時使用官方與第三方 registry，無法滿足「既要官方元件、又要團隊私有元件」的核心場景

### Q2 Option B: `@namespace/component`（npm-style）

- **是什麼**：使用 `sanring add @myteam/button` 的 scoped package 語法
- **拒絕理由**：`@` 在部分 shell（zsh globbing）需要額外 quoting；與 npm scoped package 命名規則視覺混淆，使用者可能誤以為是 npm 套件；`@` 已在 `peerDependencies` 中大量出現（如 `@angular/core`），作為 component reference 前綴容易產生解析歧義

### Q3 Option B: 同名時強制報錯

- **是什麼**：兩個 registry 有同名 component 時，拋錯並強制使用者加前綴
- **拒絕理由**：對大多數只有一個 `defaultRegistry` 的使用者而言，`add button` 的行為應是確定性的；opt-in 的嚴格模式可留作未來 flag（`--strict-registry`），不應作預設

### Q3 Option C: 按 `registries` 宣告順序 first-match wins

- **是什麼**：依 JSON 物件 key 順序逐 registry 查找，第一個命中的 registry 獲勝
- **拒絕理由**：JSON 物件的 key 順序在規範上不保證（雖然主流 JS runtime 對字串 key 有保序行為），以此作為優先順序的語義不夠明確，不如 `defaultRegistry` 顯性宣告來得清晰且可測試

### Q4 Alternative: 要求第三方自己手寫 `registry.json`

- **是什麼**：不提供 `sanring build`，讓第三方照 `Registry` schema 手動維護 `registry.json`
- **拒絕理由**：手動維護 `files` 列表和 `peerDependencies` 易出錯、難以持續更新；`sanring build` 的存在是降低第三方 registry 上架門檻的核心 DX 投資

## Implementation Plan

- [ ] **`packages/cli/src/utils.ts`**：`SanringConfig` 介面新增 `registries?: Record<string, string>` 與 `defaultRegistry?: string`；新增 `resolveRegistrySource(alias, config, flagOverride?)` 函式；新增 `migrateInstalledVersionsKeys(config)` 函式（無冒號 key 補上 `defaultRegistry:` 前綴）
- [ ] **`packages/cli/src/commands/add.ts`**：接收 `--registry` flag；解析 `alias:name` 語法，呼叫 `resolveRegistrySource` 取得 URL 後傳入 `fetchRegistry`；寫入 `installedVersions` 時使用 `alias:componentName` 格式
- [ ] **`packages/cli/src/commands/update.ts`**：同 add——讀取 `installedVersions` 時相容無冒號舊格式（fallback 到 `defaultRegistry`）
- [ ] **`packages/cli/src/commands/diff.ts`** / **`migrate.ts`** / **`info.ts`** / **`search.ts`** / **`list.ts`**：在 `--registry` flag 解析時呼叫 `resolveRegistrySource`，其餘邏輯不動
- [ ] **`packages/cli/src/commands/init.ts`**：初始 `sanring.config.json` **不加** `registries` / `defaultRegistry` 欄位；在 README / docs 說明使用者如何手動加入私有 registry
- [ ] **`packages/cli/src/commands/build.ts`**（新增）：實作 `sanring build` command——掃描 `--source` Angular component 目錄、推斷 manifest、輸出 `registry.json` 到 `--out`
- [ ] **`packages/cli/src/index.ts`**：註冊 `build` command
- [ ] **`packages/cli/src/commands/add.test.ts`** / **`update.test.ts`** / **`list.test.ts`**：補充 multi-registry 場景的 unit tests
- [ ] 更新 `packages/cli/README.md`：說明 `registries` config 欄位、`alias:name` 語法、`sanring build` 用法、`--registry` flag 新語義
- [ ] 在 `packages/cli/src/commands/doctor.ts`：加入 `migrateInstalledVersionsKeys` 呼叫，讓 `doctor` 執行時自動補齊舊 key 格式

## Notes

`installedVersions` key 格式升級（無冒號 → `alias:componentName`）是本 ADR 最高風險點。migration 必須在任何寫入路徑（`add`、`update`）執行前先執行 key 格式轉換，否則 `update` 會把同一元件當作新安裝，覆蓋使用者的 hash 記錄。建議在 `readConfig()` 回傳後、任何 config 使用前統一呼叫一次 `migrateInstalledVersionsKeys`。

`sanring build` 的靜態分析範圍 spike 尚未進行，`componentDeps` 自動推斷準確率未知。建議在 Implementation Plan 執行前先做 1 天 spike，確認 TypeScript AST 或 `tsc --listFiles` 能否可靠地從 barrel export 推斷 component 間依賴。

**Spike 結果（已完成，2026-08-10）**：用 TypeScript compiler API 掃 8 個既有元件（`button`/`tag`/`calendar`/`select`/`combobox`/`transfer`/`navigation-menu`/`date-picker`，涵蓋簡單/多依賴/深層 barrel/風格不一致等難度）的 import/export module specifier，分類成 `componentDep`（`../xxx`）/`sharedDep`（`../shared/xxx`）/`peerDependency`（裸套件名，排除 `@angular/core`/`rxjs` 等 baseline 套件），跟手寫 `registry.json` 逐欄位比對。**結論：可行**——24 個欄位 15 個完全吻合，其餘 9 個不吻合全部可歸因到 3 個已理解、可解決的原因，沒有「AST 真的看不出來」的案例：

1. **遞移關係需要去重**：例如 `calendar` 直接 import `@angular/cdk`/`@angular/forms`，但這兩個套件已經透過 `componentDeps`（`popover`/`field`）在下游宣告過，手寫版不重複列——純逐檔案掃描抓不到「已被上游覆蓋」，需要多一輪跨整個 source 目錄的遞移閉包計算才能達到跟手寫版一樣精簡（不會是錯的，只是比手寫版囉唆）。這代表批次 D 的實作至少要分兩輪：(a) 逐檔案抽取原始 import 關係、(b) 對整批已知元件算遞移閉包後剪掉能被上游覆蓋的重複宣告。
2. **baseline 套件排除清單**：`@angular/core`/`@angular/core/rxjs-interop`/`@angular/common`/`rxjs` 這類必然存在的套件，8 個樣本裡零誤判，是穩定可維護的做法。
3. **手寫 `registry.json` 本身有 3 個既有真實 bug（spike 抓對、資料錯），已記錄在 TODOLIST.md P24，不在本 ADR 處理範圍**：`transfer` 元件 4 個檔案的 relative import 路徑寫錯、`navigation-menu` 漏宣告 `@lucide/angular` peerDependency、`tag`/`calendar`/`date-picker` 宣告了實際沒用到的 `component-styles` sharedDep。

**對批次 D 範圍的影響**：可以基於此 spike 開 `.claude/charters/p9-sanring-build.md`，範圍應包含遞移閉包去重這一輪（見上），不能只做逐檔案掃描；`sanring build` 的演算法選型（原生 TS compiler API vs. `ts-morph`）與去重規則的精確定義，留給該 charter 定案。

### 相關連結

- PRD: `.claude/prds/p9-multi-registry.md`（TODO，尚未建立）
- 相關 ADR: （無）
- POC code: 一次性 spike script，未進版控（disposable，見上方 Spike 結果）
- `fetchRegistry` 實作: `packages/cli/src/registry.ts`
- `SanringConfig` 定義: `packages/cli/src/utils.ts`
