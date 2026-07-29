export const paginationTranslations = {
  'pagination.description': '用於大量資料導覽的 pagination primitives 與已組合好的 paginator。',
  'pagination.examples.basic.description': '一個受控 paginator，搭配小型清單預覽目前頁面資料。',
  'pagination.usage.description':
    '常見情境使用 PaginatorComponent；需要自訂排列時，改用底層 pagination primitives 組合。',
  'pagination.installation.description':
    '用 CLI 加入這個元件，再匯入 PaginatorComponent 或 pagination primitive set。',
  'pagination.demo.controlled': '受控分頁器',
  'pagination.demo.pageSize': '每頁筆數',
  'pagination.demo.primitives': 'Primitive 組合',
  'pagination.demo.currentPage': '目前頁數',
  'pagination.demo.items': '筆資料',
  'pagination.demo.rowsPerPage': '每頁筆數',
  'pagination.api.description':
    'pagination primitive set 提供的 components、directives 與 inputs。',
  'pagination.api.paginator.description':
    '已組合好的 paginator，包含範圍文字、頁碼、省略號與導覽控制。',
  'pagination.api.pageIndex.description': '目前頁面的 zero-based index。',
  'pagination.api.pageSize.description': '每一頁代表的資料筆數。',
  'pagination.api.length.description': '所有頁面合計的資料總筆數。',
  'pagination.api.siblingCount.description': '省略號出現前，在目前頁左右兩側顯示的鄰近頁數。',
  'pagination.api.boundaryCount.description': '頁碼範圍的開頭與結尾固定顯示的頁數。',
  'pagination.api.showFirstLast.description': '顯示或隱藏第一頁與最後一頁導覽控制。',
  'pagination.api.pageChange.description': '當使用者要求切換到不同頁面時 emit。',
  'pagination.api.pagination.description':
    '根層 navigation component，提供 layout 與 aria-label 串接。',
  'pagination.api.list.description': '頁碼與導覽控制的 flex list wrapper。',
  'pagination.api.item.description':
    '套用到頁碼按鈕或連結的 directive，包含 active 與 disabled 狀態。',
  'pagination.api.nav.description':
    '套用到上一頁、下一頁、第一頁或最後一頁控制，同時保留 button/link 語意。',

} as const;
