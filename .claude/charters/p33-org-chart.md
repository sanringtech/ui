---
schema_version: 1
charter_id: p33-org-chart
charter_name: P33 — Block org-chart（elkjs 排版 + 薄殼渲染）
status: draft
charter_type: feature
parent_charter:
date: 2026-10-01
owner: jack755051
branch: feat/p33-org-chart
related_prd:
related_constitution:
related_adr: .claude/adrs/0002-org-chart-layout-engine.md
---

# Task Charter: P33 — Block org-chart

選型理由見 [ADR-0002](../adrs/0002-org-chart-layout-engine.md)。本檔只管**範圍、順序、驗證**。

## 1. 目的 (Purpose)

交付 `sanring add block/org-chart`：經典組織圖頁面模板，支援雙主管 / 矩陣匯報、跨層虛線、直角連線避障、平移縮放，並以 `tree` 側欄提供鍵盤可及性。

## 2. 核心重點（每批都要守）

1. **elkjs 只在 `layout.ts`**——其他檔案 grep 不到 `elkjs`。
2. **演算法只用 `elk.layered`**，`elk.edgeRouting: ORTHOGONAL`。
3. **節點 HTML、連線 SVG**，同一座標系；不做純 SVG 圖。
4. **Worker 預設開**；elk 不得進主 bundle。
5. **狀態在 block 的 signal**；不建 `providedIn: 'root'` service。
6. **圖不是 ARIA treeview**；鍵盤導航交給既有 `tree`，兩者共用同一份資料。
7. **不引入 d3**。

## 3. 可做範圍 vs 不可做範圍

### ✅ 可做

- `registry/blocks/org-chart/`（`org-chart.component.ts`、`layout.ts`、`index.ts`）
- `registry/registry.json` `blocks[]` 新增一筆，`peerDependencies: { "elkjs": "^0.12.0" }`
- 根 `package.json` 加 `elkjs`（docs app / spike 用）
- docs app：`/blocks` 頁加 org-chart 示範；spike 期間可加暫時頁面（批次 A 結束移除）
- 卡片組合既有元件：`card`、`avatar`、`badge`、`dropdown-menu`、`tree`、`sheet`、`skeleton`、`button`
- 固定卡片尺寸 input（`nodeW` / `nodeH`）
- 平移、縮放、fit-to-view、捲動到指定節點（自寫）
- 循環匯報：偵測後 `console.warn`，不畫

### ❌ 不可做

- `diagram-*` / `org-chart` primitive（`packages/ui` 不動）
- 改 `packages/cli`（含授權提示機制）
- elkjs 進 `@sanring/cli` tarball
- d3 任何套件
- 可變卡片尺寸 / 隱藏量測、部門分組框（compound node）、節點拖曳
- CRUD、權限、搜尋後端
- `mrtree` 或其他 elk 演算法切換 API

## 4. 分批策略 (Phased Plan)

### 批次 A：Spike（Gate，不進 registry）

docs app 暫時頁 + 假資料：≥1 位雙主管員工、≥1 條 CEO → 基層 PM 跨層虛線。

- [ ] A1 虛線處理：比較「虛線一起參與 layered」vs「只用實線排版、虛線另算繞線」，截圖存證，選一種
- [ ] A2 效能：300 / 1000 節點在 Worker 中 `layout()` 耗時（記錄數字）
- [ ] A3 打包：`ng build` 後確認 elk 位於獨立 worker chunk，主 bundle 無 elk
- [ ] A4 結論寫回 ADR-0002（Status → Accepted 或 Rejected）

### 批次 B：`layout.ts`

- [ ] 型別：`OrgNode { id, ... }`、`OrgEdge { id, source, target, kind: 'solid' | 'dotted' }`
- [ ] 選項定案（依 A1）；輸出 `{ nodes: {id,x,y,width,height}[], edges: {id,kind,points}[] }`
- [ ] 循環偵測
- [ ] unit test（sync bundled 版，小圖）

### 批次 C：渲染殼

- [ ] 卡片層（`@for` + 絕對定位）+ SVG 連線層（實線 / 虛線走 token）
- [ ] loading / empty / error 三態

### 批次 D：互動

- [ ] 平移、縮放（滑鼠 + 觸控板）、fit-to-view、捲到指定節點

### 批次 E：a11y

- [ ] `tree` 側欄聯動：選取同步、焦點移到對應卡片
- [ ] axe 掃描零違規

### 批次 F：Registry + docs

- [ ] `registry.json` `blocks[]`、`/blocks` 頁示範
- [ ] docs 註明 EPL-2.0 與 ~460 KB（gzip）worker 體積

### 批次 G：E2E + 發版

- [ ] Playwright：渲染、縮放、tree 聯動
- [ ] CLI e2e：`sanring add block/org-chart` 會裝 elkjs
- [ ] changeset

## 5. Commit 邊界

- 一批一個（或數個）commit，不跨批混雜。
- 批次 A 的暫時頁面不得留在最終 PR；或於批次 A 結束時刪除。

## 6. 停止條件 (Stop Conditions)

遇到以下任一，停工回報，不自行繞過：

- A1：兩種虛線處理方式都會讓實線主幹明顯變形
- A2：1000 節點 Worker 排版 > 2 秒
- A3：Angular 22 build 無法把 elk 切成獨立 worker chunk
- 任一步需要改 `packages/ui` 或 `packages/cli`
- 法務否決 EPL-2.0

## 7. 驗證標準 (Verification)

### 每批 commit 前必跑

```bash
pnpm lint
pnpm test
grep -rln "elkjs" registry/blocks/org-chart | grep -v layout.ts   # 必須無輸出
grep -rn "d3-" registry/blocks/org-chart package.json             # 必須無輸出
```

### 收尾驗證

- [ ] `pnpm build` 後主 bundle 無 elk（A3 的方法重跑）
- [ ] `pnpm test:e2e:docs`、`pnpm test:e2e:cli` 通過
- [ ] §2 核心重點逐條勾選
