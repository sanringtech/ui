# Table 元件待辦清單

## 已完成

- `caption.directive.ts` — `TableCaptionDirective`(`caption[sanringCaption]`),投影進 `CdkTable` 內建的 `<ng-content select="caption">`
- `cell.directive.ts` — 模具三兄弟(`sanringHeaderCellDef`/`sanringCellDef`/`sanringFooterCellDef`)+ 蛋糕三兄弟(`sanringHeaderCell`/`sanringCell`/`sanringFooterCell`,各自用 `hostDirectives` 複用 `CdkHeaderCell`/`CdkCell`/`CdkFooterCell`)
- `column-def.directive.ts` — `TableColumnDefDirective`(`[sanringColumnDef]`),已轉發 `cdkColumnDef`/`sticky`/`stickyEnd`
- `row.directive.ts` — RowDef 三兄弟(已轉發 `columns`/`when`/`sticky`)+ Row 三兄弟(`TableHeaderRowDirective`/`TableRowDirective`/`TableFooterRowDirective`,footer 用 `border-t`,body 有 `last:border-b-0`,`TableRowDirective` 有 `selected` input 驅動 `data-state=selected`)
- `table.directive.ts` — 外層 `<table>` reset 樣式(已移除誤導性的 `role="grid"`)
- `table-container.component.ts` — `<sanring-table-container>` 捲動包裝(`relative block w-full overflow-auto`)
- `no-data-row.directive.ts` — `TableNoDataRowDirective`(`ng-template[sanringNoDataRow]`)
- `sort.directive.ts` + `sort-header.component.ts` — `SortDirective`(`[sanringSort]` 用 `model()` 提供初始值/雙向綁定/外部可重置)+ `SortHeaderComponent`(`th[sanringSortHeader]`,鏈式複用 `TableHeaderCellDirective`,自己就是 `<th>` 所以能設 `aria-sort`,內部真的用 `<button>` 保證鍵盤可及性)

## 待處理

- [ ] **Paginator(分頁器)** —— CDK 本身不含 paginator(那是 Angular Material 專屬),需要從零刻 `sanring-paginator`:頁碼/上下頁按鈕、每頁筆數選擇、目前頁數/總筆數顯示。跟 sort 一樣,資料層邏輯(實際切資料、算總頁數)應該留給使用端,元件只負責顯示 + 發出「使用者想跳到第幾頁」的意圖。
- [ ] Sticky 欄位的背景色 —— `sticky`/`stickyEnd` 已能傳進去,但 CDK 只會加 `position: sticky` + 位移,不會加背景色,實際用 sticky checkbox/actions 欄時要自己補不透明背景(例如 `bg-[var(--sanring-surface)]`),不然捲動時文字會透出來。
- [ ] `CdkTextColumn` 等效元件 —— 目前決定不做(它是 sealed Component,模板寫死原生 `cdk-*` attribute,要支援等於要重寫一整套 `ViewChild` 註冊邏輯),先讓使用者手動組 `sanringColumnDef` + `sanringCellDef`。
- [ ] CDK flex-layout(`<cdk-table>` 自訂標籤,非原生 `<table>`)—— 目前完全不支援。`TableDirective` 的 selector 已收窄成只認 `table[cdk-table][sanringTable]`,因為所有 cell/row directive 都只匹配原生 `th`/`td`/`tr`。真的要支援 flex 模式,需要幫每個 cell/row directive 都做一份平行 selector(例如 `cdk-cell[sanringCell]`),範圍不小,先不做。
- [ ] **Table spec / docs demo 驗證渲染**(優先權高)—— 目前只驗證過 `tsc --noEmit` 型別通過,**沒有實際跑過瀏覽器**確認 `sanringColumnDef`+`sanringCellDef`+`sanringRowDef` 這條 content-query 鏈真的能渲染資料、no-data 分支、sort 點擊、selected row 樣式都正常運作。build 過不代表功能正確,這是目前最大的未知風險,建議在寫更多功能之前先補這個。

## 不用寫新元件,純粹是「使用模式」要補進文件

- [ ] Row actions(⋯ 選單)—— 用既有 `dropdown-menu` 放進最後一欄的 cell
- [ ] Loading skeleton rows —— 用既有 `skeleton`,loading 時 `*ngIf` 換掉 tbody 內容
- [ ] 欄位顯示/隱藏切換 —— dropdown-menu + checkbox 湊 checklist,搭配 `sanringRowDefColumns` 動態陣列
- [ ] Row selection checkbox 欄 —— `sanringColumnDef` + `sanring-checkbox` + `TableRowDirective` 的 `selected` input 組合範例

## 官網文件

- [ ] `apps/docs/src/app/pages/components/table/` 目前不存在,要新增一頁,示範上面這些組合用法(比照其他元件頁面的 usage-imports 慣例)
