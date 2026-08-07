---
name: insert-component
description: Sanring UI lib 元件審查。當新元件開發完成、準備加入 registry 之前執行：檢查 Angular 結構正確性（OnPush、CDK 使用方式、瀏覽器 API 安全性）、a11y 合規（ARIA roles、鍵盤導覽、focus 管理）、props/API 設計（signal inputs、ariaLabel 族群、id 綁定），以及是否有 spec 檔案——沒有的話自動補寫最低 baseline spec。
argument-hint: "元件名稱，例如 switch 或 packages/ui/src/lib/components/switch"
user-invocable: true
allowed-tools: "Read Write Edit Bash Glob Grep"
---

# insert-component — Sanring 元件審查 Skill

被呼叫時，依序執行以下六個 Phase。每個 Phase 完成後先輸出結果再繼續下一個。

---

## Phase 0 — 定位元件目錄

1. 若使用者傳入參數，判斷是元件名稱（`button`）還是路徑（`packages/ui/src/lib/components/button`）。
2. 若為名稱，在以下位置搜尋：
   - `packages/ui/src/lib/components/<name>/`
   - `registry/components/<name>/`
3. 讀取該目錄下所有 `.ts` 檔案（不含 `.spec.ts`）。
4. 若目錄不存在或無法確定，向使用者確認路徑後再繼續。

---

## Phase 1 — Angular 結構檢查

讀取所有非 spec 的 `.ts` 源碼，逐條確認：

### 1-A 基礎設定
- [ ] 所有 `@Component` 都設定了 `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] 所有 `@Component` 都設定了 `standalone: true`（或 `standalone` 欄位存在）
- [ ] 沒有使用 `@Input()` / `@Output()` decorator（應改用 signal-based `input()` / `output()`）
- [ ] 沒有裸露的 `any` 型別（`as any`、`: any`）

### 1-B 瀏覽器 API 安全性（SSR 防護）
- [ ] `MutationObserver`、`ResizeObserver`、`IntersectionObserver` 的實例化都包在 `afterNextRender()` 內，不放在建構子或 `ngOnInit`
- [ ] `window`、`document`、`navigator` 直接存取都包在 `afterNextRender()` 或 `isPlatformBrowser()` guard 內
- [ ] `EmblaCarousel`、第三方 DOM 操作套件的初始化同上

### 1-C CDK Overlay 使用方式（若有使用）
- [ ] `OverlayRef` 在 `ngOnDestroy` 或 `DestroyRef` 中有呼叫 `.dispose()`
- [ ] `outsidePointerEvents$` 訂閱有用 `takeUntilDestroyed()` 或 `.pipe(take(1))` 清理
- [ ] `keydownEvents$` 訂閱同上
- [ ] 使用了 `MenuOverlayController` 共用抽象而非手刻同樣的 lifecycle（若適用）

### 1-D 訂閱清理
- [ ] 所有 `.subscribe()` 都有 `takeUntilDestroyed()` 或隨 overlay dispose 自動 complete

輸出格式：每條列為 ✅ / ❌ / ⚠（不適用）。列出所有 ❌ 項目的具體位置（檔名:行號）。

---

## Phase 2 — Accessibility 檢查

### 2-A ARIA roles
- [ ] 互動元件的根元素或觸發元素有正確的 `role`（`button`、`listbox`、`option`、`combobox`、`dialog`、`menu`、`menuitem` 等）
- [ ] `role="button"` 的元素同時有 `tabindex="0"` 和 keyboard event handler
- [ ] Landmark roles（`dialog`、`alertdialog`、`navigation`、`region`）有對應的 `aria-label` 或 `aria-labelledby`

### 2-B 狀態屬性
- [ ] 可展開的元素（下拉、手風琴、popover）有 `aria-expanded`
- [ ] 有子選單的觸發元素有 `aria-haspopup`
- [ ] 選單/清單項目有 `aria-selected` 或 `aria-checked`（視語意）
- [ ] Disabled 狀態有 `aria-disabled="true"`（而非只有 CSS）

### 2-C 鍵盤導覽
- [ ] 互動元件支援預期的鍵盤操作：`Enter`/`Space` 觸發；`Escape` 關閉；方向鍵在清單中導覽
- [ ] 方向鍵導覽會跳過 disabled 項目
- [ ] `Tab` 行為符合預期（modal = focus trap；dropdown = Tab 關閉並移到下一個焦點）

### 2-D Focus 管理
- [ ] Modal / Dialog / Sheet 使用了 CDK `FocusTrap` 或 `trapFocus()`
- [ ] 關閉 overlay 後焦點有回到觸發元素
- [ ] `autoFocus` 或 `focus()` 呼叫包在 `afterNextRender` 或 `setTimeout(0)` 內（避免 SSR 問題）

### 2-E Label 關聯
- [ ] 元件有暴露 `ariaLabel?: string` 或 `ariaLabelledBy?: string` input
- [ ] 表單控制元件有 `id` input，讓外部 `<label for="...">` 可以綁定
- [ ] `aria-describedby` 有暴露（若元件有 helper text / description）

輸出格式同 Phase 1。

---

## Phase 3 — Props / API 設計檢查

### 3-A Input 設計
- [ ] 使用 `input<T>()` / `input.required<T>()` signal 寫法（非 `@Input()` decorator）
- [ ] Input 名稱語意清楚（不用縮寫如 `val`；用 `value`）
- [ ] Boolean input 用 `input<boolean>(false)` 有預設值
- [ ] 沒有 `any` 型別的 input

### 3-B Output 設計
- [ ] 使用 `output<T>()` signal 寫法（非 `@Output() xxx = new EventEmitter<T>()`）
- [ ] Output 名稱清楚反映語意（`selectionChange` 而非 `change`；`checkedChange` 而非 `check`）
- [ ] 若是表單元件，`[(value)]` 兩路綁定有對應的 `valueChange` output

### 3-C 元件公開 API 完整性
- [ ] 有 `id?: string` input（讓 `<label for="">` 可關聯）
- [ ] 有 `ariaLabel?: string` 和/或 `ariaLabelledBy?: string`（視元件類型）
- [ ] 若是互動元件，有 `disabled?: boolean` input
- [ ] Class merging：host class 用 `cn()` 合併，支援 `class` 屬性傳入

### 3-D registry.json 對應（若元件已在 registry）
- [ ] `registry.json` 對應條目的 `sharedDeps` 有列出實際依賴的 shared 檔案
- [ ] `files` 陣列列出所有實際的元件檔案

輸出格式同 Phase 1。

---

## Phase 4 — Spec 檔案檢查

1. 在元件目錄搜尋 `*.spec.ts` 檔案。
2. 若**存在**，讀取並確認：
   - [ ] 有 render test（`expect(fixture.nativeElement).toBeTruthy()`）
   - [ ] 有 class merging test（傳入 `class="custom"` 驗證 host 有加上去）
   - [ ] 有核心 a11y attribute test（對應 Phase 2 發現的 role/aria 屬性）
   - [ ] 若為互動元件，有至少一個 keyboard/interaction behavior test
3. 若**不存在**，直接進入 Phase 5 自動補寫。

---

## Phase 5 — 自動補寫 Spec（僅在 Phase 4 判定缺少 spec 時執行）

根據 Phase 1–3 的發現，為元件產生最低 baseline spec，寫入 `packages/ui/src/lib/components/<name>/<name>.spec.ts`。

Spec 必須覆蓋：

```typescript
// 樣板結構（根據實際元件調整）
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
// ... 匯入元件

describe('<ComponentName>', () => {
  // 1. Render test
  it('renders without error', ...);

  // 2. Class merging
  it('merges host class with consumer class', ...);

  // 3. Core a11y attributes
  it('has correct role / aria attributes in default state', ...);

  // 4. Disabled state（若元件有 disabled input）
  it('sets aria-disabled when disabled', ...);

  // 5. Keyboard（若互動元件）
  it('responds to Enter/Space/Escape/Arrow keys', ...);

  // 6. Component-specific core behavior（根據 Phase 1–3 判斷補充）
});
```

寫完 spec 後，執行：
```bash
pnpm --filter @sanring/ui exec vitest run --reporter=verbose <spec-file-path>
```
確認 spec 能通過後才結束 Phase 5。若有測試失敗，修正 spec（不修改元件源碼）直到通過。

---

## Phase 6 — 審查摘要

輸出一份結構化摘要：

```
## insert-component 審查結果：<component-name>

### ✅ 通過
- <條目>

### ❌ 需要修正
- <條目>（位置：file:line）
  建議：<具體修正方式>

### ⚠ 注意事項
- <非阻斷性問題或建議>

### Spec 狀態
- 已存在 / 自動補寫（X tests，全部通過）

### 結論
元件是否可加入 registry：✅ 可加入 / ⚠ 建議修正後加入 / ❌ 需修正後再審查
```

結論判定：
- **❌ 需修正**：任何 Phase 1 的 ❌ 或 Phase 2 2-A/2-C 的 ❌ → 結構或 a11y 核心缺失，阻斷加入 registry
- **⚠ 建議修正後加入**：Phase 2 2-B/2-D/2-E 或 Phase 3 有 ❌ → 功能正確但 API 或 a11y 細節未完整
- **✅ 可加入**：全部通過或只有 ⚠（不適用）

---

## 注意事項

- **不修改元件源碼**：Phase 1–4 只讀取，Phase 5 只補 spec。若發現需要修正的問題，列在 Phase 6 摘要讓使用者決定是否修改。
- **spec 只補不改**：若 spec 已存在，Phase 5 不會覆蓋它，只列出缺少的 test case 建議。
- **registry 路徑同步**：审查的是 `packages/ui/` 下的源碼，但 registry 的 `.ts` 檔案是對應的複製版，兩者應一致（registry-sync-check.mjs 有自動驗證）。
