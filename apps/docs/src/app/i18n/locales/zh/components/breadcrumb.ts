export const breadcrumbTranslations = {
  'breadcrumb.description':
    '顯示使用者在層級中目前位置的導航輔助元件——由可組合的 primitives 建構，完整支援無障礙規範。',
  'breadcrumb.examples.basic.description': '使用預設 chevron 分隔符的三層麵包屑。',
  'breadcrumb.usage.description':
    '以 breadcrumb-item 和 breadcrumb-divider 組合成 breadcrumb-list，並用 breadcrumb-page 標記當前位置。',
  'breadcrumb.installation.description':
    '用 CLI 加入這個元件，再匯入 breadcrumb primitives，或使用 SANRING_BREADCRUMB_IMPORTS 一次匯入。',
  'breadcrumb.composition.description':
    'Breadcrumb 由 nav 根節點、有序清單、項目、連結、頁面標記、分隔符組成，並提供 ellipsis 元件用於折疊路徑。',
  'breadcrumb.examples.description':
    '常見麵包屑模式：分隔符變體、以 ellipsis 折疊路徑、自訂分隔符。',
  'breadcrumb.demo.divider': '分隔符',
  'breadcrumb.demo.withEllipsis': '含 Ellipsis',
  'breadcrumb.demo.customDivider': '自訂分隔符',
  'breadcrumb.api.description': 'breadcrumb primitives 支援的 inputs。',
  'breadcrumb.api.type.description':
    "分隔符圖示：'chevron'（預設，›）或 'dot'（·）。透過 ng-content 傳入自訂內容可完全覆寫。",
  'breadcrumb.api.routerLink.description': '傳遞給內部 anchor 元素的 Angular RouterLink 值。',
  'breadcrumb.api.class.description': '合併到 host 元素的額外 class。',

} as const;
