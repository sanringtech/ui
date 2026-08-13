# Table 元件待辦清單

## 已完成

- `caption.directive.ts` — `TableCaptionDirective`(`caption[sanringCaption]`），投影進 `CdkTable` 內建的 `<ng-content select="caption">`
- `cell.directive.ts` — 模具三兄弟(`sanringHeaderCellDef`/`sanringCellDef`/`sanringFooterCellDef`)+ 蛋糕三兄弟(`sanringHeaderCell`/`sanringCell`/`sanringFooterCell`，各自用 `hostDirectives` 複用 `CdkHeaderCell`/`CdkCell`/`CdkFooterCell`)
- `column-def.directive.ts` — `TableColumnDefDirective`(`[sanringColumnDef]`），已轉發 `cdkColumnDef`/`sticky`/`stickyEnd`，並支援 `ratio`/`width` 欄寬分配
- `row.directive.ts` — RowDef 三兄弟(已轉發 `columns`/`when`/`sticky`)+ Row 三兄弟(`TableHeaderRowDirective`/`TableRowDirective`/`TableFooterRowDirective`，footer 用 `border-t`，body 有 `last:border-b-0`，`TableRowDirective` 有 `selected` input 驅動 `data-state=selected`)
- `table.directive.ts` — 外層 `<table>` reset 樣式(已移除誤導性的 `role="grid"`)
- `table-container.component.ts` — `<sanring-table-container>` 捲動包裝(`relative block w-full overflow-auto`)
- `no-data-row.directive.ts` — `TableNoDataRowDirective`(`ng-template[sanringNoDataRow]`)
- `sort.directive.ts` + `sort-header.component.ts` — `SortDirective`(`[sanringSort]` 用 `model()` 提供初始值/雙向綁定/外部可重置)+ `SortHeaderComponent`(`th[sanringSortHeader]`，鏈式複用 `TableHeaderCellDirective`，自己就是 `<th>` 所以能設 `aria-sort`，內部真的用 `<button>` 保證鍵盤可及性)
- **Paginator(分頁器)** — 已實作為獨立的 `pagination` 元件(`SanringPaginatorComponent`)，docs 的 table 頁面已示範跟 table 組合使用
- **Table spec / docs demo 驗證渲染** — `table.component.spec.ts` 已覆蓋 `sanringColumnDef`+`sanringCellDef`+`sanringRowDef` 內容查詢鏈、sort 點擊、selected row 樣式、no-data 分支、ratio/width 欄寬計算、axe a11y
- **官網文件** — `apps/docs/src/app/pages/components/table/` 已存在，示範 row actions(dropdown-menu)、row selection checkbox 欄、sort、pagination 組合用法

## 待處理

- [ ] Sticky 欄位的背景色 —— `sticky`/`stickyEnd` 已能傳進去，但 CDK 只會加 `position: sticky` + 位移，不會加背景色，實際用 sticky checkbox/actions 欄時要自己補不透明背景(例如 `bg-[var(--sanring-surface)]`），不然捲動時文字會透出來。
- [ ] `CdkTextColumn` 等效元件 —— 目前決定不做(它是 sealed Component，模板寫死原生 `cdk-*` attribute，要支援等於要重寫一整套 `ViewChild` 註冊邏輯)，先讓使用者手動組 `sanringColumnDef` + `sanringCellDef`。
- [ ] CDK flex-layout(`<cdk-table>` 自訂標籤，非原生 `<table>`)—— 目前完全不支援。`TableDirective` 的 selector 已收窄成只認 `table[cdk-table][sanringTable]`，因為所有 cell/row directive 都只匹配原生 `th`/`td`/`tr`。真的要支援 flex 模式，需要幫每個 cell/row directive 都做一份平行 selector(例如 `cdk-cell[sanringCell]`），範圍不小，先不做。

## 不用寫新元件，純粹是「使用模式」要補進文件

- [x] Row actions(⋯ 選單)—— docs table 頁面已示範用 `dropdown-menu` 放進最後一欄的 cell
- [ ] Loading skeleton rows —— 用既有 `skeleton`，loading 時把 tbody 內容換掉；docs 頁面尚未示範
- [ ] 欄位顯示/隱藏切換 —— dropdown-menu + checkbox 湊 checklist，搭配 `sanringRowDefColumns` 動態陣列；docs 頁面尚未示範
- [x] Row selection checkbox 欄 —— docs table 頁面已示範 `sanringColumnDef` + `sanring-checkbox` + `TableRowDirective` 的 `selected` input 組合
