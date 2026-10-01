---
schema_version: 1
adr_id: "0002"
title: org-chart-layout-engine
status: Proposed
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
- ⚠️ ~460 KB gzip：必須確保 worker chunk 只在該頁載入，不進主 bundle（spike 驗證）。
- ⚠️ EPL-2.0：法務若否決 → 退路是 dagre（MIT），代價是放棄直角繞線與 Worker。
- ⚠️ 虛線若參與 layered 分層，可能扯歪實線主幹（spike 驗證，見 charter 批次 A）。

## 推翻條件

- spike 任一 gate 不過（見 charter §6）→ 回到本 ADR 重評 dagre 或縮減需求。
- 出現第二個「節點 + 連線」block（如流程圖）→ 另開 ADR 評估抽 `diagram-*` 原語。
