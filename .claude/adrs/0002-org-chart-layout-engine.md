---
schema_version: 1
adr_id: "0002"
title: org-chart-layout-engine
status: Accepted
date: 2026-10-01
deciders: [jack755051]
related: [.claude/charters/p33-org-chart.md]
---

# ADR-0002: Org Chart 排版引擎與交付形態

## Context

- **觸發事件**：需要「經典組織圖」——主管在上、同儕橫排，且必須支援**雙主管 / 矩陣匯報**、**跨層虛線**、**直角連線避開卡片**。
- **既有狀況**：`tree` 元件是 ARIA treeview（側欄導航），不是 2D 圖。repo 沒有任何圖排版能力。
- **既有約束**：
  - TODOLIST P32「明確不做」：不新增 primitive，官方方向在 blocks 與 registry 生態。
  - block 與 component 共用 `RegistryComponent` 型別（`packages/cli/src/registry.ts:148`），已支援 `peerDependencies`；`sanring add` 會自動安裝 peer（`collectPeerDeps`）。
  - 前例：`carousel` 以 `embla-carousel` 為 peerDependency。

## 候選引擎（2026-10-01 以 `npm pack` 實測）

| 引擎 | 授權 | 主檔 gzip | 多父節點 | 直角繞線 | Worker |
|---|---|---|---|---|---|
| d3-hierarchy 3.1.2 | ISC | ~6 KB（`d3-hierarchy.min.js`） | ❌ 嚴格樹 | ❌ 只給端點 | 不需要 |
| @dagrejs/dagre 3.1.1 | MIT | ~17 KB（`dagre.min.js`） | ✅ | ❌ polyline | ❌ |
| elkjs 0.12.0 | EPL-2.0 OR GPL-3.0-or-later | ~460 KB（`elk-worker.min.js` / `elk.bundled.js`） | ✅ `layered` | ✅ `elk.edgeRouting: ORTHOGONAL` | ✅ `elk-api.js` + worker |

## Decision

1. **引擎：elkjs，演算法固定 `org.eclipse.elk.layered`。** 唯一同時滿足多父節點 + 直角繞線 + Worker 的選項。`mrtree` 是純樹演算法，禁用。
2. **交付形態：單一 block `block/org-chart`**，`peerDependencies: { "elkjs": "^0.12.0" }`。不新增 `diagram-*` / `org-chart` primitive。
3. **引擎隔離：`layout.ts` 是唯一 import elkjs 的檔案**，輸出引擎無關的 `{ nodes, edges }` 座標結構；換引擎只改此檔。
4. **渲染：節點 HTML、連線 SVG**，同一座標系；path 由 elk 轉折點直接拼 `M…L…`。
5. **不引入 d3**：`d3-shape` 對直角線無用；`d3-zoom` 帶入 selection / drag / transition / interpolate 且直接操作 DOM，與 signal 狀態雙軌。平移縮放自寫（pointer + wheel + CSS `transform`）。
6. **授權**：消費端選 EPL-2.0 分支；elkjs 不進 `@sanring/cli` tarball（由 `sanring add` 安裝到消費專案）；docs 頁明示授權與體積。

## Consequences

- ✅ 矩陣匯報、跨層虛線、直角連線一次到位；CLI 零改動。
- ✅ 排版在 Worker，不跟 Angular change detection 搶主線程。
- ⚠️ worker chunk 1.45 MB raw / ~336 KB transfer：只在該頁載入，不進主 bundle（spike 已驗證）。
- ⚠️ EPL-2.0：法務若否決 → 退路是 dagre（MIT），代價是放棄直角繞線與 Worker。
- ⚠️ mergeEdges 讓虛線與實線共用匯流排段（批次 B 處理）。

## Spike 結果（批次 A，2026-10-01）

docs app 暫時頁 `/spike/org-chart`（已移除），17 人 demo（含雙主管、CEO → Junior PM 跨層虛線、跨部門虛線）+ 合成 300 / 1000 人。

### A1 虛線處理 → 採「虛線一起參與 layered」

| 方案 | 結果 |
|---|---|
| 虛線一起參與（all-equal） | ✅ 分層未被扯歪；elk 為虛線繞線並避開卡片 |
| 虛線降 priority（solid-priority） | 與 all-equal 視覺上無差，不值得多一組選項 |
| 只排實線、虛線事後畫直角折線（solid-only） | ❌ 虛線直接穿過卡片（CEO → Junior PM 穿過 CTO 卡片） |

**「經典組織圖」外觀必須加這組選項**（不加則父節點不置中、每條線各自出埠）：

```ts
'elk.algorithm': 'layered',
'elk.direction': 'DOWN',
'elk.edgeRouting': 'ORTHOGONAL',
'elk.layered.mergeEdges': 'true',                         // 同一主管的子線共用匯流排
'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED', // 父節點置中
'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES', // 尊重輸入順序
```

**已知瑕疵（批次 B 處理）**：`mergeEdges` 會讓虛線與同源實線共用匯流排段，起點附近虛線被實線蓋住、看起來像實線。

### A2 效能（Worker 往返，dev server，Apple Silicon）

| 節點 | 耗時 |
|---|---|
| 17（首次，含 worker 啟動） | ~135–215 ms |
| 17（暖機後） | ~10–16 ms |
| 300 | ~51 ms |
| 1000 | ~166–173 ms |

遠低於 2 秒 gate。

### A3 打包 → 通過

- 正確接法：主線程 `import ELK from 'elkjs/lib/elk-api'` + `workerFactory: () => new Worker(new URL('./x.worker', import.meta.url), { type: 'module' })`；worker 檔只寫 `import 'elkjs/lib/elk-worker.min.js'`（它在 worker scope 自己掛 `self.onmessage`）。
- ❌ 不要在自訂 worker 裡用 `elk.bundled.js`：它會再開內層 worker，報 `_Worker is not a constructor`。
- `ng build` 結果：elk 只出現在 `worker-*.js`（1.45 MB raw / ~336 KB transfer）；主 bundle 只多 `elk-api`（~1 KB）。docs app 無需 `webWorkerTsConfig`。
- 會出現 `not ESM` 警告（`elk-api`、`elk-worker.min.js`）→ docs 要教消費端加 `allowedCommonJsDependencies: ["elkjs"]`。
- dev server 首次載入時 Vite 重新最佳化依賴，可能先報一次 `_Worker` 錯，重整後正常；只影響 dev。

## 推翻條件

- spike 任一 gate 不過（見 charter §6）→ 回到本 ADR 重評 dagre 或縮減需求。
- 出現第二個「節點 + 連線」block（如流程圖）→ 另開 ADR 評估抽 `diagram-*` 原語。
