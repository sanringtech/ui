export const tableTranslations = {
  'table.description':
    '可組合的 CDK table primitives，適合密集資料、可排序表頭、空資料狀態與 sticky 操作欄。',
  'table.examples.basic.description':
    '以 Sanring cell、row 與 column directives 包在 Angular CDK table 上的精簡發票表格。',
  'table.usage.description':
    '匯入 Angular CDK table 與 Sanring table primitives，並在 template 中組合欄位、儲存格與列。',
  'table.installation.description':
    '用 CLI 加入這個元件，再與 Angular CDK table 一起匯入 table primitives。',
  'table.demo.sortable': '可排序表頭',
  'table.demo.columnSizing': '欄位比例',
  'table.demo.sticky': 'Sticky 欄位',
  'table.demo.empty': '空資料狀態',
  'table.demo.selection': '列選取',
  'table.demo.actions': '操作選單',
  'table.demo.pagination': '搭配分頁器',
  'table.api.description': 'table primitive set 提供的 directives 與 components。',
  'table.api.sanringTable.description':
    '將 Sanring 的尺寸、字體與 reset 樣式套用到 Angular CDK table。',
  'table.api.sanringColumnDef.description':
    '包裝 CdkColumnDef，並轉發欄位名稱、sticky 與 stickyEnd inputs。',
  'table.api.cellDef.description': 'header、body 與 footer cell 的 template definitions。',
  'table.api.cell.description':
    '渲染出的 header、body 與 footer cell directives，包含 Sanring 間距與 CDK cell 串接。',
  'table.api.rowDef.description':
    'header、body 與 footer row 的 template definitions，包含 columns 與 sticky inputs。',
  'table.api.row.description':
    '渲染出的 row directive，提供 border、hover 與 selected state 樣式。',
  'table.api.sort.description': '透過 sanringSort model input/output 協調目前欄位與排序方向。',
  'table.api.sortHeader.description':
    '互動式 header cell，可在 asc、desc、none 三種排序狀態間切換。',
  'table.api.noDataRow.description': '當 CDK table 的 data source 為空時渲染的 template。',

} as const;
